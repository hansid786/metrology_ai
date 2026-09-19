import {
  InspectionResult,
  ProductCategory,
  PackageShape,
  ImageQualityInfo,
  PipelineDiagnosticTrace,
  InspectionFinding
} from '../types/inspection';
import { calculatePricingIntelligence, analyzeCompliance } from './complianceEngine';
import { runTesseractOCR, TesseractOCRResult } from './tesseractEngine';
import { extractEvidenceDeclarations } from './evidenceExtractor';
import { assessImageQuality } from '../utils/imageQuality';
import { calculate3WayTruthConsensus } from './consensusEngine';

export interface OCRProgressCallback {
  (stage: { stage: number; label: string; detail: string; progressPercent: number }): void;
}

/**
 * Server-Side Gemini Vision Caller
 * Sends packaging image to the secure /api/analyze-packaging backend route.
 * Never leaks API keys on client side.
 */
async function callServerPackagingVision(
  base64Image: string,
  mimeType: string,
  categoryHint: ProductCategory = 'FOOD'
): Promise<{ data: any | null; durationMs: number; error?: string; modelUsed?: string }> {
  const t0 = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000); // 28s client timeout for serverless vision

    const response = await fetch('/api/analyze-packaging', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64Image,
        mimeType,
        categoryHint
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        return {
          data: json.data,
          durationMs: Date.now() - t0,
          modelUsed: json.modelUsed || 'Gemini 1.5/2.0 Vision Serverless'
        };
      }
    }

    const errJson = await response.json().catch(() => ({}));
    return {
      data: null,
      durationMs: Date.now() - t0,
      error: errJson.error || `Server responded with status ${response.status}`,
      modelUsed: undefined
    };
  } catch (err: any) {
    return {
      data: null,
      durationMs: Date.now() - t0,
      error: err?.name === 'AbortError' ? 'Serverless vision request timed out (28s)' : (err?.message || 'Network error'),
      modelUsed: undefined
    };
  }
}

/**
 * End-to-End Evidence-Based Packaging Recognition & Compliance Pipeline
 */
export async function performRealImageOCR(
  imageUrl: string,
  fileName: string,
  initialCategory: ProductCategory = 'FOOD',
  onProgress?: OCRProgressCallback
): Promise<InspectionResult> {
  const overallStartTime = Date.now();

  // ─── Stage 1: Quality Gate & Metadata Assessment ─────────────────────────────
  if (onProgress) {
    onProgress({
      stage: 1,
      label: 'Image Quality Assessment',
      detail: 'Analyzing blur, brightness, contrast, and resolution...',
      progressPercent: 15
    });
  }

  const q0 = Date.now();
  const qualityInfo: ImageQualityInfo = await assessImageQuality(imageUrl);
  const qualityCheckMs = Date.now() - q0;

  let base64Data = '';
  let mimeType = 'image/jpeg';
  let sizeBytes = 0;
  if (imageUrl.startsWith('data:')) {
    const parts = imageUrl.split(',');
    base64Data = parts[1] || '';
    mimeType = parts[0].split(':')[1]?.split(';')[0] || 'image/jpeg';
    sizeBytes = Math.round((base64Data.length * 3) / 4);
  }

  // ─── Stage 2: Optical Recognition Execution (Gemini Vision + Tesseract) ─────
  if (onProgress) {
    onProgress({
      stage: 2,
      label: 'Multimodal Vision & Optical OCR',
      detail: 'Invoking Gemini Vision AI and local Tesseract OCR in parallel...',
      progressPercent: 40
    });
  }

  const ocrStartTime = Date.now();

  // 1. Parallel Local Tesseract OCR (cross-check & offline fallback, 12s timeout)
  const tesseractPromise = runTesseractOCR(imageUrl, (percent, status) => {
    if (onProgress) {
      onProgress({
        stage: 2,
        label: 'Tesseract OCR',
        detail: status || 'Scanning text blocks on packaging...',
        progressPercent: Math.min(65, 40 + Math.round(percent * 0.25))
      });
    }
  });

  const tesseractWithTimeout = Promise.race([
    tesseractPromise,
    new Promise<TesseractOCRResult>((resolve) =>
      setTimeout(() => {
        resolve({ fullText: '', lines: [], averageConfidence: 0, tokensCount: 0, processingTimeMs: 12000 });
      }, 12000)
    )
  ]);

  // 2. Primary Engine: Server-side Gemini Vision AI (/api/analyze-packaging)
  const geminiVisionPromise = base64Data
    ? callServerPackagingVision(base64Data, mimeType, initialCategory)
    : Promise.resolve({ data: null, durationMs: 0, error: 'No base64 data URL provided', modelUsed: undefined });

  // Run both engines concurrently
  const [tesseractSettled, geminiSettled] = await Promise.allSettled([
    tesseractWithTimeout,
    geminiVisionPromise
  ]);

  const tesseractResult: TesseractOCRResult = tesseractSettled.status === 'fulfilled'
    ? tesseractSettled.value
    : { fullText: '', lines: [], averageConfidence: 0, tokensCount: 0, processingTimeMs: Date.now() - ocrStartTime };

  const geminiResult = geminiSettled.status === 'fulfilled'
    ? geminiSettled.value
    : { data: null, durationMs: 0, error: 'Vision promise rejected', modelUsed: undefined };

  const ocrMs = tesseractResult.processingTimeMs;
  const aiMs = geminiResult.durationMs;

  // Separate and reconcile raw text streams
  const geminiRawText = Array.isArray(geminiResult.data?.rawText)
    ? geminiResult.data.rawText.join('\n')
    : (geminiResult.data?.rawText || '');
  const tesseractRawText = tesseractResult.fullText || '';

  const reconciledRawText = [
    geminiRawText,
    tesseractRawText
  ].filter(t => t && t.trim().length > 2).join('\n\n---TESSERACT LOCAL OCR---\n\n').trim();

  // ─── Stage 3: Strict Evidence Validation & Candidate Reconciliation ──────────
  if (onProgress) {
    onProgress({
      stage: 3,
      label: 'Evidence-First Field Verification',
      detail: 'Validating MRP, Net Quantity, Dates, and Manufacturer against visible text...',
      progressPercent: 75
    });
  }

  const ext0 = Date.now();
  const evidenceResult = extractEvidenceDeclarations(
    reconciledRawText,
    tesseractResult.lines,
    geminiResult.data,
    initialCategory,
    fileName
  );
  const extractionMs = Date.now() - ext0;

  const finalMRPAmount = evidenceResult.mrpAmount ?? 0;
  const finalQtyAmount = evidenceResult.netQuantityValue ?? 0;
  const finalQtyUnit = evidenceResult.netQuantityUnit ?? 'g';

  // ─── Stage 4: Pricing Intelligence & Truth Triangulation ─────────────────────
  const pricing = calculatePricingIntelligence(
    finalMRPAmount,
    finalQtyAmount,
    finalQtyUnit,
    evidenceResult.printedUSPText
  );

  const consensus = calculate3WayTruthConsensus({
    opticalDeclarations: evidenceResult.declarations,
    opticalPricing: pricing,
    geminiData: geminiResult.data,
    masterProduct: undefined,
    liveProduct: null,
    category: evidenceResult.category
  });

  // ─── Stage 5: Statutory Compliance Engine Evaluation ─────────────────────────
  if (onProgress) {
    onProgress({
      stage: 4,
      label: 'Legal Metrology Compliance Evaluation',
      detail: 'Evaluating PCR 2011 statutory rules, USP formulas, and mandatory presence...',
      progressPercent: 90
    });
  }

  const comp0 = Date.now();
  const packageShape: PackageShape = (
    (evidenceResult.category === 'FOOD' && (finalQtyUnit === 'ml' || finalQtyUnit === 'L')) ||
    (evidenceResult.category === 'PHARMA' && finalQtyUnit === 'ml')
  ) ? 'CYLINDRICAL' : 'RECTANGULAR';

  const hasAnyReadableText = reconciledRawText.trim().length > 4 || evidenceResult.extractedEvidenceCount > 0;

  const complianceAssessment: {
    verifiedCount: number;
    totalCount: number;
    compliancePercentage: number;
    overallStatus: any;
    findings: InspectionFinding[];
  } = hasAnyReadableText
    ? analyzeCompliance(
      consensus.reconciledDeclarations,
      pricing,
      evidenceResult.category,
      packageShape,
      evidenceResult.boundingBoxes
    )
    : {
      verifiedCount: 0,
      totalCount: consensus.reconciledDeclarations.length,
      compliancePercentage: 0,
      overallStatus: 'INSUFFICIENT_EVIDENCE' as const,
      findings: [{
        id: 'finding-insufficient-evidence',
        severity: 'WARNING' as const,
        title: 'Insufficient packaging label evidence',
        description: 'Unable to detect legible printed declarations from the image. Please ensure good lighting, avoid glare, and hold the camera steady.',
        legalActClause: 'Rule 6(1) · Packaging Visibility Standard',
        declarationKey: 'mrp'
      }]
    };

  const complianceMs = Date.now() - comp0;
  const totalMs = Date.now() - overallStartTime;

  // ─── Stage 6: Build Transparent Diagnostic Trace ─────────────────────────────
  const diagnosticTrace: PipelineDiagnosticTrace = {
    imageStatus: {
      uploaded: Boolean(imageUrl),
      fileName: fileName || 'uploaded_package_image.jpg',
      sizeBytes,
      mimeType,
      resolution: `${qualityInfo.width || 0}x${qualityInfo.height || 0}`,
      qualityScore: qualityInfo.qualityScore,
      sharpness: qualityInfo.sharpness
    },
    ocrStatus: {
      engine: 'Tesseract.js OCR (On-Device WebAssembly)',
      startedAt: new Date(ocrStartTime).toISOString(),
      durationMs: ocrMs,
      linesCount: tesseractResult.lines?.length || 0,
      tokensCount: tesseractResult.tokensCount || 0,
      rawText: tesseractRawText
    },
    aiStatus: {
      modelUsed: geminiResult.modelUsed || (geminiResult.data ? 'Gemini Vision AI' : 'None / Fallback'),
      called: Boolean(base64Data),
      success: Boolean(geminiResult.data),
      responseTimeMs: aiMs,
      rawResponse: geminiResult.data || { error: geminiResult.error }
    },
    validationStatus: {
      extractedFields: consensus.reconciledDeclarations.map(d => ({
        field: d.name,
        value: d.extractedValue || 'Not detected',
        source: d.evidence?.sourceText || 'Optical pattern matching',
        confidence: `${d.confidence}% (${d.status})`
      })),
      rejectedCandidates: evidenceResult.rejectedCandidates
    },
    timings: {
      qualityCheckMs,
      ocrMs,
      aiMs,
      extractionMs,
      complianceMs,
      totalMs
    }
  };

  const inspectionId = `INSP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  return {
    inspectionId,
    timestamp: new Date().toISOString(),
    inspector: {
      id: 'LMO-SYSTEM-AUTO',
      name: 'Automated Optical Surveillance',
      designation: 'Legal Metrology AI Assistant',
      jurisdiction: 'National'
    },
    product: {
      name: evidenceResult.productName || 'Scanned Packaged Commodity',
      brand: evidenceResult.brandName || 'General Brand',
      category: evidenceResult.category,
      imageUrl: imageUrl || '',
      shape: packageShape
    },
    overallStatus: complianceAssessment.overallStatus,
    compliancePercentage: complianceAssessment.compliancePercentage,
    verifiedCount: complianceAssessment.verifiedCount,
    totalCount: complianceAssessment.totalCount,
    declarations: consensus.reconciledDeclarations,
    findings: complianceAssessment.findings,
    pricing,
    boundingBoxes: evidenceResult.boundingBoxes,
    rawOcrText: reconciledRawText,
    imageQuality: qualityInfo,
    diagnosticTrace,
    ingredientAnalysis: evidenceResult.ingredientAnalysis,
    ocrMetadata: {
      engine: geminiResult.modelUsed || 'Gemini Vision AI + Tesseract.js',
      processingTimeMs: totalMs,
      tokensDetected: tesseractResult.tokensCount || 0,
      averageConfidence: tesseractResult.averageConfidence || 90,
      status: 'SUCCESS',
      rawText: reconciledRawText
    }
  };
}
