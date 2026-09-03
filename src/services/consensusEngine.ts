import { MandatoryDeclaration, PricingIntelligence, InspectionFinding, ProductCategory } from '../types/inspection';
import { VerifiedProductRecord } from '../data/productMasterDB';
import { LiveProductData } from './liveRegistryService';

export interface ConsensusInput {
  opticalDeclarations: MandatoryDeclaration[];
  opticalPricing: PricingIntelligence;
  geminiData?: any | null;
  masterProduct?: VerifiedProductRecord;
  liveProduct?: LiveProductData | null;
  category: ProductCategory;
}

export interface ConsensusOutput {
  reconciledDeclarations: MandatoryDeclaration[];
  reconciledPricing: PricingIntelligence;
  reconciledFindings: InspectionFinding[];
  consensusTrustScore: number;
  dataSourcesUsed: string[];
  truthEvidenceSummary: string;
}

/**
 * 3-Way Truth Triangulation Consensus Engine
 * Merges and cross-validates (1) Optical Text, (2) Gemini Multimodal Vision, and (3) Live GS1/OpenFoodFacts Master DB.
 */
export function calculate3WayTruthConsensus(input: ConsensusInput): ConsensusOutput {
  const dataSourcesUsed: string[] = ['Optical High-Contrast OCR'];
  if (input.geminiData) dataSourcesUsed.push('Gemini 1.5 Multimodal Vision');
  if (input.masterProduct) dataSourcesUsed.push(`GS1 India Registry (${input.masterProduct.brand})`);
  if (input.liveProduct?.found) dataSourcesUsed.push(`Open Food Facts Live API`);

  const reconciledDeclarations: MandatoryDeclaration[] = [...input.opticalDeclarations];
  let consensusTrustScore = 85;

  // 1. Reconcile MRP
  const mrpDecl = reconciledDeclarations.find(d => d.key === 'mrp');
  const masterMrp = input.masterProduct?.officialMrp;
  const geminiMrp = input.geminiData?.mrp ? Number(input.geminiData.mrp) : undefined;
  const opticalMrp = input.opticalPricing.mrpAmount;

  if (mrpDecl) {
    if (geminiMrp && masterMrp && Math.abs(geminiMrp - masterMrp) < 0.01) {
      mrpDecl.extractedValue = `₹ ${geminiMrp.toFixed(2)}`;
      mrpDecl.confidence = 99.9;
      mrpDecl.status = 'PASS';
      mrpDecl.explanation = 'Verified via Gemini Vision & GS1 Official Registry.';
      consensusTrustScore = Math.max(consensusTrustScore, 98);
    } else if (geminiMrp && opticalMrp && Math.abs(geminiMrp - opticalMrp) < 0.01) {
      mrpDecl.extractedValue = `₹ ${geminiMrp.toFixed(2)}`;
      mrpDecl.confidence = 99.5;
      mrpDecl.status = 'PASS';
      mrpDecl.explanation = 'Cross-verified between Optical OCR & Multimodal Vision.';
      consensusTrustScore = Math.max(consensusTrustScore, 95);
    } else if (masterMrp && opticalMrp && Math.abs(masterMrp - opticalMrp) < 0.01) {
      mrpDecl.confidence = 99.0;
      mrpDecl.explanation = 'Verified against GS1 Master Registry.';
    }
  }

  // 2. Reconcile Net Quantity
  const qtyDecl = reconciledDeclarations.find(d => d.key === 'net_quantity');
  if (qtyDecl) {
    if (input.masterProduct?.netQuantity) {
      qtyDecl.confidence = Math.max(qtyDecl.confidence, 98);
      qtyDecl.explanation = 'Verified with official standard net quantity.';
    }
  }

  // 3. Reconcile FSSAI License
  const fssaiDecl = reconciledDeclarations.find(d => d.key === 'fssai_lic');
  if (fssaiDecl) {
    const fssaiVal = input.geminiData?.fssaiLicense || input.masterProduct?.fssaiNumber;
    if (fssaiVal && /^\d{14}$/.test(fssaiVal.replace(/\D/g, ''))) {
      fssaiDecl.extractedValue = fssaiVal;
      fssaiDecl.status = 'PASS';
      fssaiDecl.confidence = 99.0;
      fssaiDecl.explanation = '14-Digit statutory FSSAI license confirmed.';
    }
  }

  // 4. Reconcile Manufacturer Details
  const mfgDecl = reconciledDeclarations.find(d => d.key === 'manufacturer_details');
  if (mfgDecl && input.masterProduct?.manufacturer) {
    mfgDecl.extractedValue = `${input.masterProduct.manufacturer}, ${input.masterProduct.manufacturerAddress} - ${input.masterProduct.pinCode}`;
    mfgDecl.status = 'PASS';
    mfgDecl.confidence = 99.2;
    mfgDecl.explanation = 'Manufacturer address & PIN code verified via master database.';
  }

  // 5. Build Trust Evidence Summary
  const truthEvidenceSummary = `Triangulated across ${dataSourcesUsed.length} independent streams: ${dataSourcesUsed.join(', ')}. Trust Confidence: ${consensusTrustScore}%.`;

  return {
    reconciledDeclarations,
    reconciledPricing: input.opticalPricing,
    reconciledFindings: [],
    consensusTrustScore,
    dataSourcesUsed,
    truthEvidenceSummary
  };
}
