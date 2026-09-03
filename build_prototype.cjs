const fs = require('fs');
const path = require('path');

function writeFile(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`Created: ${relPath}`);
}

// 1. types/inspection.ts
writeFile('src/types/inspection.ts', `
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
  legalReference: string;
  status: ComplianceStatus;
  extractedValue: string;
  confidence: number;
  explanation: string;
  boundingBoxId?: string;
}

export interface PricingIntelligence {
  mrpAmount: number;
  mrpCurrency: string;
  netQuantityValue: number;
  netQuantityUnit: string;
  standardizedQuantity: number;
  standardUnit: string;
  
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
  mrp: number;
  netQuantity: string;
  printedUSP: string;
  data: InspectionResult;
}

export interface InspectorSettings {
  inspectorId: string;
  inspectorName: string;
  designation: string;
  zone: string;
  ocrEngine: 'demo-local' | 'paddle-cloud';
  mathTolerancePercent: number;
  strictCountryOriginCheck: boolean;
}
`);

console.log('Types created');
