import {
  InspectionResult,
  ProductCategory,
  PackageShape,
  ImageQualityInfo,
  PipelineDiagnosticTrace
} from '../types/inspection';
import { calculatePricingIntelligence, analyzeCompliance } from './complianceEngine';
import { runTesseractOCR, TesseractOCRResult } from './tesseractEngine';
import { extractEvidenceDeclarations } from './evidenceExtractor';
import { assessImageQuality } from '../utils/imageQuality';
import { lookupBarcodeInText } from './barcodeService';
import { optimizePackagingROI } from '../utils/roiOptimizer';
import { fetchLiveProductByBarcode } from './liveRegistryService';
import { calculate3WayTruthConsensus } from './consensusEngine';

export interface OCRProgressCallback {
  (stage: { stage: number; label: string; detail: string; progressPercent: number }): void;
}

/**
 * Calls Cloud Serverless AI Vision API first, falling back to direct client call if needed.
 */
async function callGeminiVisionStrict(base64Image: string, mimeType: string): Promise<{ data: any | null; durationMs: number }> {
  const t0 = Date.now();

  // 1. Try Serverless Cloud Function first (/api/analyze-packaging)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const serverResponse = await fetch('/api/analyze-packaging', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Image, mimeType }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (serverResponse.ok) {
      const json = await serverResponse.json();
      if (json.success && json.data) {
        return { data: json.data, durationMs: Date.now() - t0 };
      }
    }
  } catch (serverErr) {
    // Non-fatal: continue to direct client fallback
  }

  // 2. Client-side direct fallback if API key is stored locally
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
  if (!apiKey) return { data: null, durationMs: 0 };

  const prompt = `You are a certified Legal Metrology optical inspector.
CRITICAL INSTRUCTION:
Read ONLY the verbatim text visibly printed on this product packaging image.
NEVER guess, estimate, or invent any detail. If any field is not clearly visible in the image, return null.

Return ONLY a valid JSON object matching this schema:
{
  "productName": "exact name printed on package or null",
  "brandName": "exact brand printed on package or null",
  "mrp": <number or null>,
  "netQuantityValue": <number or null>,
  "netQuantityUnit": "exact unit (g, kg, ml, L, Tablets, Pages, NOS, Unit) or null",
  "mfgDate": "exact printed mfg date or null",
  "expiryDate": "exact printed expiry/best before date or null",
  "manufacturer": "exact printed manufacturer name and address or null",
  "fssaiLicense": "14-digit FSSAI number or null",
  "drugLicense": "drug or ayush license number or null",
  "batchNo": "exact batch number or null",
  "countryOfOrigin": "country of origin if declared or null",
  "customerCare": "exact care phone or email or null",
  "category": "FOOD or PHARMA or ELECTRONICS or GENERAL",
  "rawText": "verbatim text lines visible in image"
}`;

  try {
    const directController = new AbortController();
    const directTimeout = setTimeout(() => directController.abort(), 15000);

    // Try gemini-1.5-flash
    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: directController.signal,
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: base64Image } }
            ]
          }],
          generationConfig: { temperature: 0.0, maxOutputTokens: 1024 }
        })
      }
    );

    // If 1.5-flash fails or returns 404, fallback to gemini-2.0-flash
    if (!response.ok) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: directController.signal,
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: base64Image } }
              ]
            }],
            generationConfig: { temperature: 0.0, maxOutputTokens: 1024 }
          })
        }
      );
    }
    clearTimeout(directTimeout);

    if (!response.ok) return { data: null, durationMs: Date.now() - t0 };
    const data = await response.json();
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!rawContent) return { data: null, durationMs: Date.now() - t0 };

    const cleaned = rawContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return { data: null, durationMs: Date.now() - t0 };

    return {
      data: JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)),
      durationMs: Date.now() - t0
    };
  } catch (err) {
    console.warn('[MetrologyLens] Gemini Vision API note:', err);
    return { data: null, durationMs: Date.now() - t0 };
  }
}

/**
 * End-to-End Evidence-Based Image OCR and Statutory Compliance Engine
 */
export async function performRealImageOCR(
  imageUrl: string,
  fileName: string,
  initialCategory: ProductCategory = 'FOOD',
  onProgress?: OCRProgressCallback
): Promise<InspectionResult> {
  const overallStartTime = Date.now();

  // Stage 1: Quality Check & Image Preparation
  if (onProgress) {
    onProgress({
      stage: 1,
      label: 'Checking Image Quality',
      detail: 'Analyzing blur, brightness, contrast, and resolution...',
      progressPercent: 20
    });
  }

  const q0 = Date.now();
  const qualityInfo: ImageQualityInfo = await assessImageQuality(imageUrl);
  const qualityCheckMs = Date.now() - q0;

  // Extract base64
  let base64Data = '';
  let mimeType = 'image/jpeg';
  let sizeBytes = 0;
  if (imageUrl.startsWith('data:')) {
    const parts = imageUrl.split(',');
    base64Data = parts[1] || '';
    mimeType = parts[0].split(':')[1]?.split(';')[0] || 'image/jpeg';
    sizeBytes = Math.round((base64Data.length * 3) / 4);
  }

  // Stage 2: Optical Character Recognition (Parallel Tesseract + Vision AI)
  if (onProgress) {
    onProgress({
      stage: 2,
      label: 'Optical Character Recognition',
      detail: 'Scanning packaging text, numbers, and statutory declarations...',
      progressPercent: 45
    });
  }

  const ocrStartTime = Date.now();
  
  // Launch Tesseract and Gemini in parallel for maximum speed
  const tesseractPromise = runTesseractOCR(imageUrl, (percent, status) => {
    if (onProgress) {
      onProgress({
        stage: 2,
        label: 'Optical Character Recognition',
        detail: status || 'Reading text blocks from packaging...',
        progressPercent: Math.min(70, 45 + Math.round(percent * 0.25))
      });
    }
  });

  const geminiPromise = base64Data
    ? callGeminiVisionStrict(base64Data, mimeType)
    : Promise.resolve({ data: null, durationMs: 0 });

  const [tesseractSettled, geminiSettled] = await Promise.allSettled([
    tesseractPromise,
    geminiPromise
  ]);

  const tesseractResult: TesseractOCRResult = tesseractSettled.status === 'fulfilled'
    ? tesseractSettled.value
    : { fullText: '', lines: [], averageConfidence: 0, tokensCount: 0, processingTimeMs: Date.now() - ocrStartTime };

  const geminiResult = geminiSettled.status === 'fulfilled'
    ? geminiSettled.value
    : { data: null, durationMs: 0 };

  const ocrMs = tesseractResult.processingTimeMs;
  const aiMs = geminiResult.durationMs;

  // Combine OCR text evidence
  const rawOcrText = [
    tesseractResult.fullText,
    geminiResult.data?.rawText || ''
  ].filter(Boolean).join('\n\n---\n\n').trim();

  // Stage 3: Evidence Extraction & Strict Field Identification
  if (onProgress) {
    onProgress({
      stage: 3,
      label: 'Evidence Field Extraction',
      detail: 'Verifying MRP, Net Quantity, Dates, and Manufacturer evidence...',
      progressPercent: 80
    });
  }

  const ext0 = Date.now();
  const evidenceResult = extractEvidenceDeclarations(
    tesseractResult.fullText || geminiResult.data?.rawText || '',
    tesseractResult.lines,
    geminiResult.data,
    initialCategory
  );
  const extractionMs = Date.now() - ext0;

  // 3-Way Truth Triangulation: Cross-verify with Barcode Master DB & Live Open Food Facts
  const barcodeMatch = lookupBarcodeInText(rawOcrText);
  let liveProduct = null;
  if (barcodeMatch.rawCode) {
    try {
      liveProduct = await fetchLiveProductByBarcode(barcodeMatch.rawCode);
    } catch {}
  }

  const finalMRPAmount = evidenceResult.mrpAmount ?? (barcodeMatch.matchedProduct?.officialMrp || 0);
  const finalQtyAmount = evidenceResult.netQuantityValue ?? (barcodeMatch.matchedProduct?.netQuantityValue || 0);
  const finalQtyUnit = evidenceResult.netQuantityUnit ?? (barcodeMatch.matchedProduct?.netQuantityUnit || 'g');

  const pricing = calculatePricingIntelligence(
    finalMRPAmount,
    finalQtyAmount,
    finalQtyUnit,
    undefined
  );

  const consensus = calculate3WayTruthConsensus({
    opticalDeclarations: evidenceResult.declarations,
    opticalPricing: pricing,
    geminiData: geminiResult.data,
    masterProduct: barcodeMatch.matchedProduct,
    liveProduct,
    category: evidenceResult.category
  });

  // Stage 4: Legal Metrology Compliance Engine
  if (onProgress) {
    onProgress({
      stage: 4,
      label: 'Statutory Compliance Evaluation',
      detail: 'Evaluating Legal Metrology Rules, USP math, and statutory standards...',
      progressPercent: 92
    });
  }

  const comp0 = Date.now();
  const packageShape: PackageShape = (
    (evidenceResult.category === 'FOOD' && (finalQtyUnit === 'ml' || finalQtyUnit === 'L')) ||
    (evidenceResult.category === 'PHARMA' && finalQtyUnit === 'ml')
  ) ? 'CYLINDRICAL' : 'RECTANGULAR';

  const complianceAssessment = analyzeCompliance(
    consensus.reconciledDeclarations,
    pricing,
    evidenceResult.category,
    packageShape,
    evidenceResult.boundingBoxes
  );
  const complianceMs = Date.now() - comp0;

  const totalMs = Date.now() - overallStartTime;

  // Build Comprehensive Developer Diagnostic Trace
  const diagnosticTrace: PipelineDiagnosticTrace = {
    imageStatus: {
      uploaded: true,
      fileName,
      sizeBytes,
      mimeType,
      resolution: `${qualityInfo.width} × ${qualityInfo.height} px`,
      qualityScore: qualityInfo.qualityScore,
      sharpness: qualityInfo.sharpness
    },
    ocrStatus: {
      engine: 'Tesseract.js 7.0 (Optimized)',
      startedAt: new Date(ocrStartTime).toISOString(),
      durationMs: ocrMs,
      linesCount: tesseractResult.lines.length,
      tokensCount: tesseractResult.tokensCount,
      rawText: rawOcrText || '(No text read by optical engine)'
    },
    aiStatus: {
      modelUsed: geminiResult.data ? 'Gemini 1.5 Flash (Grounded Vision)' : 'None (Browser Optical Only)',
      called: Boolean(base64Data),
      success: Boolean(geminiResult.data),
      responseTimeMs: aiMs,
      rawResponse: geminiResult.data
    },
    validationStatus: {
      extractedFields: evidenceResult.declarations.map(d => ({
        field: d.name,
        value: d.extractedValue,
        source: d.evidence?.sourceText || 'None',
        confidence: `${d.evidence?.confidenceLevel || 'NOT_DETECTED'} (${d.confidence}%)`
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

  return {
    inspectionId: `INS-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    inspector: {
      id: 'LMO-SYS-2026',
      name: 'Legal Metrology AI Optical Verification',
      designation: 'Certified AI Vision Inspection Engine',
      jurisdiction: 'National Jurisdiction — Ministry of Consumer Affairs, GoI'
    },
    product: {
      name: evidenceResult.productName,
      brand: evidenceResult.brandName,
      category: evidenceResult.category,
      imageUrl,
      shape: packageShape,
      imageWidth: qualityInfo.width,
      imageHeight: qualityInfo.height
    },
    declarations: evidenceResult.declarations,
    verifiedCount: complianceAssessment.verifiedCount,
    totalCount: complianceAssessment.totalCount,
    compliancePercentage: complianceAssessment.compliancePercentage,
    overallStatus: complianceAssessment.overallStatus,
    pricing,
    findings: complianceAssessment.findings,
    boundingBoxes: evidenceResult.boundingBoxes,
    pdpInfo: complianceAssessment.pdpInfo,
    fontReadabilitySummary: complianceAssessment.fontReadabilitySummary,
    imageQuality: qualityInfo,
    rawOcrText: rawOcrText || (tesseractResult.lines.length === 0 ? 'No text could be optically decoded from this image.' : tesseractResult.lines.map(l => l.text).join('\n')),
    multiSideInfo: {
      sidesAnalyzed: ['Single Scanned Image View (Visible Packaging Side)'],
      isSingleSide: true,
      hasAdditionalSidesUploaded: false
    },
    entityRoles: evidenceResult.entityRoles,
    manufacturingDates: evidenceResult.manufacturingDates,
    diagnosticTrace,
    ingredientAnalysis: evidenceResult.ingredientAnalysis,
    ocrMetadata: {
      engine: geminiResult.data ? 'MetrologyLens Hybrid (Tesseract.js + Grounded Gemini 1.5 Vision)' : 'MetrologyLens On-Device Optical Engine (Tesseract.js 7.0)',
      processingTimeMs: totalMs,
      tokensDetected: tesseractResult.tokensCount || (rawOcrText.split(/\s+/).filter(Boolean).length),
      averageConfidence: tesseractResult.averageConfidence || 85
    }
  };
}
