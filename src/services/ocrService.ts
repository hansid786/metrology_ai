import { InspectionResult, ProductCategory } from '../types/inspection';
import { DEMO_PRESETS } from '../data/demoProducts';
import { analyzeCompliance } from './complianceEngine';
import { performRealImageOCR } from './realOcrService';
import { convertToJpegDataUrl } from '../utils/imagePreprocessor';
import { analyzeIngredients } from './ingredientAnalyzer';

export interface OCRProcessingStage {
  stage: number;
  label: string;
  detail: string;
  progressPercent: number;
}

export interface OCRProvider {
  processImage(
    imageUrl: string,
    fileName: string,
    category?: ProductCategory,
    onStageUpdate?: (stage: OCRProcessingStage) => void
  ): Promise<InspectionResult>;
}

export class DemoOCRProvider implements OCRProvider {
  async processImage(
    imageUrl: string,
    fileName: string,
    category: ProductCategory = 'FOOD',
    onStageUpdate?: (stage: OCRProcessingStage) => void
  ): Promise<InspectionResult> {

    // ── DEMO PRESET PATH ────────────────────────────────────────────────────────
    // Custom camera/gallery uploads have data:image/jpeg/png/webp or non-demo filenames
    const isCustomUpload = (imageUrl.startsWith('data:image/jpeg') || imageUrl.startsWith('data:image/png') || imageUrl.startsWith('data:image/webp') || imageUrl.startsWith('blob:')) && !fileName.startsWith('demo-');
    const isExplicitPreset = !isCustomUpload && fileName.startsWith('demo-') && DEMO_PRESETS.some(p => p.id === fileName);
    const matchingPreset = isExplicitPreset ? DEMO_PRESETS.find(p => p.id === fileName) : undefined;

    if (matchingPreset) {
      const stages: OCRProcessingStage[] = [
        { stage: 1, label: 'Preprocessing Image', detail: 'Loading benchmark packaging data...', progressPercent: 20 },
        { stage: 2, label: 'Identifying Declarations', detail: 'Matching Legal Metrology tags under PCR 2011...', progressPercent: 55 },
        { stage: 3, label: 'Running Compliance Checks', detail: 'Verifying font standards & statutory presence...', progressPercent: 80 },
        { stage: 4, label: 'Analyzing Pricing', detail: 'Validating Unit Sale Price formula (MRP ÷ Net Quantity)...', progressPercent: 96 },
      ];
      for (const st of stages) {
        if (onStageUpdate) onStageUpdate(st);
        await new Promise(r => setTimeout(r, 80));
      }
      const rawData = matchingPreset.data as InspectionResult;
      const packageShape = (matchingPreset.id.includes('oil') || matchingPreset.id.includes('pharma')) ? 'CYLINDRICAL' : 'RECTANGULAR';

      const presetText = rawData.rawOcrText || (
        matchingPreset.id.includes('potato')
          ? 'CRUNCHY SUPREME POTATO CHIPS\nIngredients: Potato, Edible Vegetable Oil (Palmolein), Salt, Tartrazine (INS 102), Flavor Enhancer (INS 621), Antioxidant BHA (INS 320).\nAllergen Alert: Contains Gluten, Soy.'
          : matchingPreset.id.includes('coconut')
          ? 'VEDA ORGANICS VIRGIN COCONUT OIL\nIngredients: 100% Pure Cold Pressed Virgin Coconut Oil.\nNo Added Preservatives. No Artificial Flavours.'
          : matchingPreset.id.includes('wheat')
          ? 'SHAKTIMAN WHOLE WHEAT ATTA\nIngredients: 100% Whole Wheat Grain (Atta).\nContains Wheat Gluten.'
          : ''
      );

      const ingredientAnalysis = rawData.ingredientAnalysis || analyzeIngredients(presetText, (rawData.product?.category as any) || 'FOOD');

      return {
        ...rawData,
        timestamp: new Date().toISOString(),
        product: { ...rawData.product, imageUrl: matchingPreset.imageUrl, shape: packageShape },
        overallStatus: rawData.overallStatus,
        findings: rawData.findings,
        declarations: rawData.declarations,
        pricing: rawData.pricing,
        compliancePercentage: rawData.compliancePercentage,
        verifiedCount: rawData.verifiedCount,
        totalCount: rawData.totalCount,
        rawOcrText: presetText,
        ingredientAnalysis
      };
    }

    // ── REAL IMAGE PIPELINE ─────────────────────────────────────────────────────
    // Stage 1 – Image normalisation (HEIC → JPEG + bounded resize)
    if (onStageUpdate) onStageUpdate({
      stage: 1, label: 'Normalising Image',
      detail: 'Converting format, suppressing glare & enhancing contrast for OCR...',
      progressPercent: 18
    });

    let processedUrl = imageUrl;
    try {
      processedUrl = await convertToJpegDataUrl(imageUrl);
    } catch (prepErr) {
      // Non-fatal – continue with original image
      console.warn('[MetrologyLens] Preprocessing skipped:', prepErr);
      processedUrl = imageUrl;
    }

    // Stage 2 – Hand off to Gemini Vision + compliance engine
    // (performRealImageOCR handles its own progress callbacks from stage 2 onward)
    const result = await performRealImageOCR(processedUrl, fileName, category, onStageUpdate);
    const detectedDeclarations = result.declarations.filter(declaration => declaration.status !== 'NOT_DETECTED').length;
    if (detectedDeclarations === 0 && processedUrl !== imageUrl) {
      return performRealImageOCR(imageUrl, fileName, category, onStageUpdate);
    }
    return result;
  }
}

export const ocrService: OCRProvider = new DemoOCRProvider();
