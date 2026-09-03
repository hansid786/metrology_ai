import {
  InspectionResult,
  MandatoryDeclaration,
  MultiSideInspectionCoverage,
  PackageSideTag,
  SideScanEvidence
} from '../types/inspection';
import { calculatePricingIntelligence, analyzeCompliance } from './complianceEngine';
import { analyzeIngredients } from './ingredientAnalyzer';

export interface MultiSideScanPayload {
  sideTag: PackageSideTag;
  imageUrl: string;
  result: InspectionResult;
}

/**
 * Multi-Side Packaging Evidence Aggregator
 * Combines declarations, OCR text, and bounding boxes across multiple angles of the same physical packaging.
 */
export function aggregateMultiSideScans(
  baseInspection: InspectionResult,
  additionalScans: MultiSideScanPayload[]
): InspectionResult {
  if (!additionalScans || additionalScans.length === 0) {
    const coverage: MultiSideInspectionCoverage = {
      frontCaptured: true,
      backCaptured: false,
      sidesCaptured: false,
      bottomCaptured: false,
      totalSidesAnalyzed: 1,
      sidesList: ['Visible Front / Primary Surface'],
      sideDetails: [{
        id: `side-1`,
        sideTag: 'FRONT',
        imageUrl: baseInspection.product.imageUrl,
        rawOcrText: baseInspection.rawOcrText || '',
        declarations: baseInspection.declarations,
        timestamp: baseInspection.timestamp
      }]
    };

    return {
      ...baseInspection,
      multiSideCoverage: coverage
    };
  }

  // Combine declarations map: key -> best evidence declaration
  const declMap: Record<string, MandatoryDeclaration> = {};

  // Seed with base inspection declarations
  baseInspection.declarations.forEach(d => {
    declMap[d.key] = { ...d };
  });

  const sideDetails: SideScanEvidence[] = [
    {
      id: `side-base`,
      sideTag: 'FRONT',
      imageUrl: baseInspection.product.imageUrl,
      rawOcrText: baseInspection.rawOcrText || '',
      declarations: baseInspection.declarations,
      timestamp: baseInspection.timestamp
    }
  ];

  let combinedRawOcrText = baseInspection.rawOcrText || '';

  // Merge additional scans
  additionalScans.forEach((scan, idx) => {
    sideDetails.push({
      id: `side-${idx + 2}`,
      sideTag: scan.sideTag,
      imageUrl: scan.imageUrl,
      rawOcrText: scan.result.rawOcrText || '',
      declarations: scan.result.declarations,
      timestamp: scan.result.timestamp
    });

    if (scan.result.rawOcrText) {
      combinedRawOcrText += `\n\n=== [SIDE ${idx + 2}: ${scan.sideTag}] ===\n${scan.result.rawOcrText}`;
    }

    scan.result.declarations.forEach(newDecl => {
      const existing = declMap[newDecl.key];
      // If existing is NOT_DETECTED and new is PASS, or new has higher confidence
      if (!existing || existing.status === 'NOT_DETECTED' || (newDecl.status === 'PASS' && newDecl.confidence > (existing.confidence || 0))) {
        declMap[newDecl.key] = {
          ...newDecl,
          evidence: {
            ...newDecl.evidence,
            sourceText: `${newDecl.evidence?.sourceText || newDecl.extractedValue} (Found on ${scan.sideTag})`,
            locationOnPackage: `${scan.sideTag} Surface`,
            isEvidenceBacked: newDecl.status === 'PASS',
            confidenceLevel: newDecl.evidence?.confidenceLevel || 'HIGH',
            confidenceScore: newDecl.confidence
          }
        };
      }
    });
  });

  const mergedDeclarations = Object.values(declMap);

  // Extract merged MRP and Qty for pricing calculation
  const mrpDecl = mergedDeclarations.find(d => d.key === 'mrp');
  const qtyDecl = mergedDeclarations.find(d => d.key === 'net_quantity');

  let mergedMRP = 0;
  if (mrpDecl && mrpDecl.status === 'PASS') {
    const numMatch = mrpDecl.extractedValue.replace(/,/g, '').match(/([0-9]+(?:\.[0-9]+)?)/);
    if (numMatch) mergedMRP = parseFloat(numMatch[1]);
  }

  let mergedQty = baseInspection.pricing.netQuantityValue || 0;
  let mergedUnit = baseInspection.pricing.netQuantityUnit || 'g';
  if (qtyDecl && qtyDecl.status === 'PASS') {
    const qMatch = qtyDecl.extractedValue.match(/([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z]+)/);
    if (qMatch) {
      mergedQty = parseFloat(qMatch[1]);
      mergedUnit = qMatch[2];
    }
  }

  const updatedPricing = calculatePricingIntelligence(
    mergedMRP,
    mergedQty,
    mergedUnit,
    baseInspection.pricing.printedUSPText
  );

  const updatedCompliance = analyzeCompliance(
    mergedDeclarations,
    updatedPricing,
    baseInspection.product.category as any || 'FOOD',
    baseInspection.product.shape || 'RECTANGULAR',
    baseInspection.boundingBoxes
  );

  const sidesTagsList = sideDetails.map(s => s.sideTag);
  const coverage: MultiSideInspectionCoverage = {
    frontCaptured: sidesTagsList.includes('FRONT'),
    backCaptured: sidesTagsList.includes('BACK'),
    sidesCaptured: sidesTagsList.includes('SIDE_LEFT') || sidesTagsList.includes('SIDE_RIGHT'),
    bottomCaptured: sidesTagsList.includes('BOTTOM') || sidesTagsList.includes('TOP'),
    totalSidesAnalyzed: sideDetails.length,
    sidesList: sidesTagsList.map(t => `${t} Surface`),
    sideDetails
  };

  const updatedIngredientAnalysis = analyzeIngredients(
    combinedRawOcrText,
    (baseInspection.product.category as any) || 'FOOD'
  );

  return {
    ...baseInspection,
    declarations: mergedDeclarations,
    pricing: updatedPricing,
    verifiedCount: updatedCompliance.verifiedCount,
    totalCount: updatedCompliance.totalCount,
    compliancePercentage: updatedCompliance.compliancePercentage,
    overallStatus: updatedCompliance.overallStatus,
    findings: updatedCompliance.findings,
    rawOcrText: combinedRawOcrText,
    multiSideCoverage: coverage,
    ingredientAnalysis: updatedIngredientAnalysis,
    multiSideInfo: {
      sidesAnalyzed: coverage.sidesList,
      isSingleSide: coverage.totalSidesAnalyzed <= 1,
      hasAdditionalSidesUploaded: coverage.totalSidesAnalyzed > 1
    }
  };
}
