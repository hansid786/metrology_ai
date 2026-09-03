export type ComplianceStatus = 'PASS' | 'FAIL' | 'WARNING' | 'EXEMPT' | 'NOT_APPLICABLE' | 'REVIEW_REQUIRED' | 'VIOLATION' | 'NOT_DETECTED';

export type ProductCategory = 'FOOD' | 'ELECTRONICS' | 'GENERAL' | 'COSMETICS' | 'PHARMA';

export type PackageShape = 'RECTANGULAR' | 'CYLINDRICAL' | 'OTHER';

export type InspectionOverallStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_VERIFIED' | 'INSUFFICIENT_EVIDENCE' | 'ATTENTION_REQUIRED' | 'CRITICAL_NON_COMPLIANT';

export type InspectionStatus = 'DRAFT' | 'IN_REVIEW' | 'COMPLETED' | 'PENDING';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NOT_DETECTED';

export interface ImageQualityInfo {
  isAcceptable: boolean;
  qualityScore: number;
  brightness: number;
  contrast: number;
  sharpness: number;
  width: number;
  height: number;
  issues: string[];
  recommendation?: string;
}

export interface DeclarationEvidence {
  sourceText: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  locationOnPackage?: string;
  isEvidenceBacked: boolean;
  boundingBoxId?: string;
}

export interface EntityRoles {
  manufacturer?: string;
  packer?: string;
  importer?: string;
  marketer?: string;
  manufacturerAddress?: string;
}

export interface ManufacturingDates {
  mfgDate?: string;
  packingDate?: string;
  expiryDate?: string;
  bestBefore?: string;
  rawDateUnverified?: string;
}

export interface FontComplianceInfo {
  measuredHeightMm: number;
  requiredMinHeightMm: number;
  isEmbossedOrMolded?: boolean;
  isQuantityNumeral?: boolean;
  quantityTier?: 'SMALL' | 'MEDIUM' | 'LARGE';
  isCompliant: boolean;
  ruleReference: string;
  explanation: string;
}

export interface PDPPlacementInfo {
  isInsidePDP: boolean;
  locationDescription: string;
  isCompliant: boolean;
  ruleReference: string;
}

export interface PDPInfo {
  packageShape: PackageShape;
  packageDimensionsMm?: {
    height: number;
    width?: number;
    depth?: number;
    diameter?: number;
  };
  totalSurfaceAreaSqCm?: number;
  pdpAreaSqCm?: number;
  pdpAreaPercentage: number;
  pdpBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  exclusionZonesDescription: string;
  isPdpCompliant: boolean;
  ruleReference: string;
}

export interface BoundingBox {
  id: string;
  declarationKey: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  status: ComplianceStatus;
  extractedText: string;
  fontCompliance?: FontComplianceInfo;
  isInsidePDP?: boolean;
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
  isExempt?: boolean;
  fontCompliance?: FontComplianceInfo;
  pdpPlacement?: PDPPlacementInfo;
  evidence?: DeclarationEvidence;
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
  discrepancyType: 'NONE' | 'OVERCHARGING' | 'UNDERSTATING' | 'MISSING_USP' | 'INVALID_FORMAT' | 'NOT_APPLICABLE';
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

export interface GeoLocationInfo {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  addressText?: string;
  timestamp: string;
  isTamperProofSection65B: boolean;
  docketSha256Hash?: string;
}

export interface BarcodeVerificationInfo {
  rawBarcode: string;
  barcodeFormat: 'EAN-13' | 'QR_CODE' | 'UPC-A' | 'CODE_128';
  gs1Country: string;
  manufacturerGTIN: string;
  isRegisteredGS1India: boolean;
  matchesExtractedManufacturer: boolean;
  status: 'VERIFIED_MATCH' | 'MISMATCH_COUNTERFEIT_FLAG' | 'EXEMPT_NON_BARCODED' | 'NOT_DETECTED';
  details: string;
}

export type PackageSideTag = 'FRONT' | 'BACK' | 'SIDE_LEFT' | 'SIDE_RIGHT' | 'TOP' | 'BOTTOM' | 'LABEL_DETAIL';

export interface SideScanEvidence {
  id: string;
  sideTag: PackageSideTag;
  imageUrl: string;
  rawOcrText: string;
  declarations: MandatoryDeclaration[];
  timestamp: string;
}

export interface MultiSideInspectionCoverage {
  frontCaptured: boolean;
  backCaptured: boolean;
  sidesCaptured: boolean;
  bottomCaptured: boolean;
  totalSidesAnalyzed: number;
  sidesList: string[];
  sideDetails: SideScanEvidence[];
}

export interface PipelineDiagnosticTrace {
  imageStatus: {
    uploaded: boolean;
    fileName: string;
    sizeBytes: number;
    mimeType: string;
    resolution: string;
    qualityScore: number;
    sharpness: number;
  };
  ocrStatus: {
    engine: string;
    startedAt: string;
    durationMs: number;
    linesCount: number;
    tokensCount: number;
    rawText: string;
  };
  aiStatus: {
    modelUsed: string;
    called: boolean;
    success: boolean;
    responseTimeMs: number;
    rawResponse: any;
  };
  validationStatus: {
    extractedFields: { field: string; value: string; source: string; confidence: string }[];
    rejectedCandidates: { field: string; candidateText: string; reason: string }[];
  };
  timings: {
    qualityCheckMs: number;
    ocrMs: number;
    aiMs: number;
    extractionMs: number;
    complianceMs: number;
    totalMs: number;
  };
}

export type IngredientHazardLevel = 'HARMFUL' | 'CAUTION' | 'SAFE' | 'UNKNOWN';

export type IngredientCategory =
  | 'PRESERVATIVE'
  | 'COLOR'
  | 'SWEETENER'
  | 'FLAVOR_ENHANCER'
  | 'FAT_OIL'
  | 'EMULSIFIER'
  | 'ALLERGEN'
  | 'NATURAL';

export interface IngredientItem {
  name: string;
  matchedName: string;
  insCode?: string;
  hazardLevel: IngredientHazardLevel;
  category: IngredientCategory;
  healthRiskEn: string;
  healthRiskHi: string;
  isAllergen: boolean;
  allergenType?: string;
  fssaiRegulationNote?: string;
}

export interface IngredientSafetyAnalysis {
  hasIngredientsDeclared: boolean;
  rawIngredientsText: string;
  totalIngredientsCount: number;
  harmfulCount: number;
  cautionCount: number;
  safeCount: number;
  healthSafetyScore: number; // 0 to 100
  healthRating: 'CLEAN' | 'MODERATE' | 'POOR_NUTRITION' | 'ULTRA_PROCESSED_HARMFUL';
  harmfulIngredients: IngredientItem[];
  cautionIngredients: IngredientItem[];
  safeIngredients: IngredientItem[];
  allDetectedIngredients: IngredientItem[];
  allergensDetected: string[];
  consumerAdviceEn: string;
  consumerAdviceHi: string;
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
    shape?: PackageShape;
  };
  declarations: MandatoryDeclaration[];
  verifiedCount: number;
  totalCount: number;
  compliancePercentage: number;
  overallStatus: InspectionOverallStatus;
  pricing: PricingIntelligence;
  findings: InspectionFinding[];
  boundingBoxes: BoundingBox[];
  pdpInfo?: PDPInfo;
  fontReadabilitySummary?: {
    totalMeasured: number;
    compliantCount: number;
    failedCount: number;
    overallFontCompliant: boolean;
  };
  geoLocation?: GeoLocationInfo;
  barcodeInfo?: BarcodeVerificationInfo;
  imageQuality?: ImageQualityInfo;
  rawOcrText?: string;
  multiSideCoverage?: MultiSideInspectionCoverage;
  multiSideInfo?: {
    sidesAnalyzed: string[];
    isSingleSide: boolean;
    hasAdditionalSidesUploaded: boolean;
  };
  entityRoles?: EntityRoles;
  manufacturingDates?: ManufacturingDates;
  diagnosticTrace?: PipelineDiagnosticTrace;
  ingredientAnalysis?: IngredientSafetyAnalysis;
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

export interface AuditEntry {
  id: string;
  type: 'INSPECTION_CREATED' | 'AI_ANALYSIS_COMPLETED' | 'FINDING_REVIEWED' | 'INSPECTION_SAVED' | 'PDF_EXPORTED' | 'STATUS_CHANGED' | 'OFFICER_OVERRIDE';
  description: string;
  timestamp: string;
  actor: string;
}

export interface InspectionMetadata {
  inspectionId: string;
  establishmentName: string;
  establishmentAddress?: string;
  productName: string;
  productCategory: ProductCategory;
  manufacturer?: string;
  location?: string;
  inspectorId: string;
  inspectorName: string;
  inspectorDesignation: string;
  dateTime: string;
  notes?: string;
  geoLocation?: GeoLocationInfo;
  barcodeInfo?: BarcodeVerificationInfo;
}

export type ReviewActionType = 'ACCEPTED' | 'REJECTED' | 'OVERRIDDEN' | 'MANUAL_REVIEW' | 'PENDING';

export interface InspectorDecision {
  findingId: string;
  declarationKey?: string;
  action: ReviewActionType;
  comment?: string;
  timestamp: string;
  officerId: string;
  officerName: string;
}

export type ReviewAction = InspectorDecision;

export interface SavedInspection {
  id: string;
  metadata: InspectionMetadata;
  presetId?: string;
  images: string[];
  result: InspectionResult;
  decisions: ReviewAction[];
  auditTrail: AuditEntry[];
  savedAt: string;
  updatedAt: string;
  status: InspectionStatus;
  pdfGenerated: boolean;
}

export interface DashboardStats {
  total: number;
  today: number;
  passed: number;
  withViolations: number;
  highSeverity: number;
  pendingReview: number;
  overallComplianceRate: number;
}