const fs = require('fs');
const path = require('path');

// 1. types/inspection.ts
const inspectionTypes = `
export type ComplianceStatus = 'PASS' | 'FAIL' | 'WARNING';

export type InspectionOverallStatus = 'COMPLIANT' | 'ATTENTION_REQUIRED' | 'CRITICAL_NON_COMPLIANT';

export interface BoundingBox {
  id: string;
  declarationKey: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  confidence: number; // 0-100
  status: ComplianceStatus;
  extractedText: string;
}

export interface MandatoryDeclaration {
  id: string;
  key: string;
  name: string;
  legalReference: string; // e.g. Rule 6(1)(a) of Legal Metrology (Packaged Commodities) Rules, 2011
  status: ComplianceStatus;
  extractedValue: string;
  confidence: number;
  explanation: string;
  boundingBoxId?: string;
}

export interface PricingIntelligence {
  mrpAmount: number; // in INR
  mrpCurrency: string;
  netQuantityValue: number;
  netQuantityUnit: string; // 'g' | 'kg' | 'ml' | 'l' | 'pcs'
  standardizedQuantity: number; // in base units (g or ml or pcs)
  standardUnit: string; // 'g' | 'ml' | 'pcs'
  
  hasPrintedUSP: boolean;
  printedUSPAmount?: number;
  printedUSPUnit?: string;
  printedUSPText?: string;
  
  calculatedUSPAmount: number;
  calculatedUSPUnit: string;
  
  isDiscrepancy: boolean;
  differenceAmount: number;
  differencePercentage: number;
  discrepancyType: 'NONE' | 'OVERCHARGING' | 'UNDERSTATING' | 'MISSING_USP' | 'INVALID_FORMAT';
  statusDescription: string;
  ruleReference: string;
}

export interface InspectionFinding {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  description: string;
  legalActClause: string;
  declarationKey?: string;
}

export interface InspectionResult {
  inspectionId: string;
  timestamp: string;
  inspector: {
    id: string;
    name: string;
    designation: string;
    jurisdiction: string;
  };
  product: {
    name: string;
    brand: string;
    category: string;
    imageUrl: string;
    imageWidth?: number;
    imageHeight?: number;
  };
  declarations: MandatoryDeclaration[];
  verifiedCount: number;
  totalCount: number;
  compliancePercentage: number;
  overallStatus: InspectionOverallStatus;
  pricing: PricingIntelligence;
  findings: InspectionFinding[];
  boundingBoxes: BoundingBox[];
  ocrMetadata: {
    engine: string;
    processingTimeMs: number;
    tokensDetected: number;
    averageConfidence: number;
  };
}

export interface DemoProductPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  imageUrl: string;
  data: Partial<InspectionResult>;
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'types', 'inspection.ts'), inspectionTypes.trim());
console.log('Created src/types/inspection.ts');
