import { 
  MandatoryDeclaration, 
  PricingIntelligence, 
  InspectionFinding, 
  InspectionOverallStatus,
  ComplianceStatus,
  ProductCategory,
  PackageShape,
  BoundingBox,
  FontComplianceInfo,
  PDPInfo,
  PDPPlacementInfo
} from '../types/inspection';

/**
 * Standard Legal Metrology Declarations for Food / FMCG
 */
export const FOOD_DECLARATIONS_DEF = [
  { key: 'mrp', name: 'Maximum Retail Price (MRP)', legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011' },
  { key: 'net_quantity', name: 'Net Quantity', legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011' },
  { key: 'unit_sale_price', name: 'Unit Sale Price (USP)', legalReference: 'Rule 6(1)(e) [Amendment 2021] - Compulsory for Food Retail' },
  { key: 'expiry_date', name: 'Best Before / Expiry Date', legalReference: 'Rule 6(1)(c) - Legal Metrology & FSSAI Standards' },
  { key: 'fssai_lic', name: 'FSSAI License & Food Logo', legalReference: 'FSSAI Packaging & Labelling Regulations, 2011' },
  { key: 'country_of_origin', name: 'Country of Origin', legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011' },
  { key: 'manufacturer_details', name: 'Manufacturer / Packer Address', legalReference: 'Rule 6(1)(d) - Legal Metrology (PC) Rules, 2011' },
  { key: 'customer_care', name: 'Consumer Care Helpline & Email', legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011' },
];

/**
 * Legal Metrology Declarations for Electronics & Appliances
 */
export const ELECTRONICS_DECLARATIONS_DEF = [
  { key: 'mrp', name: 'Maximum Retail Price (MRP)', legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011' },
  { key: 'net_quantity', name: 'Net Quantity (Units)', legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011' },
  { key: 'model_no', name: 'Model / Type Number & Brand', legalReference: 'Rule 6(1)(a) - Legal Metrology (PC) Rules, 2011' },
  { key: 'voltage_power', name: 'Rated Voltage & Power Rating', legalReference: 'Bureau of Indian Standards (BIS) Act, 2016' },
  { key: 'bis_mark', name: 'BIS / ISI Safety Mark', legalReference: 'Electronics & IT Goods Compulsory Order, 2021' },
  { key: 'mfg_date', name: 'Month & Year of Import / Mfg', legalReference: 'Rule 6(1)(c) - Legal Metrology (PC) Rules, 2011' },
  { key: 'country_of_origin', name: 'Country of Origin', legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011' },
  { key: 'customer_care', name: 'Customer Service & Warranty', legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011' },
];

/**
 * Legal Metrology Declarations for General / Books / Stationery
 */
export const GENERAL_DECLARATIONS_DEF = [
  { key: 'mrp', name: 'Maximum Retail Price (MRP)', legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011' },
  { key: 'net_quantity', name: 'Net Quantity / Page Count / Size', legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011' },
  { key: 'generic_name', name: 'Product Title & Description', legalReference: 'Rule 6(1)(a) - Legal Metrology (PC) Rules, 2011' },
  { key: 'mfg_date', name: 'Month & Year of Publication / Mfg', legalReference: 'Rule 6(1)(c) - Legal Metrology (PC) Rules, 2011' },
  { key: 'manufacturer_details', name: 'Publisher / Maker Address', legalReference: 'Rule 6(1)(d) - Legal Metrology (PC) Rules, 2011' },
  { key: 'country_of_origin', name: 'Country of Origin', legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011' },
  { key: 'customer_care', name: 'Consumer Grievance Helpline', legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011' },
  { key: 'dimensions', name: 'Dimensions & Paper Specifications', legalReference: 'Rule 13 - Legal Metrology (PC) Rules, 2011' },
];

/**
 * Standard Package Heights (in mm) for Calibration
 */
export const CATEGORY_DEFAULT_PACKAGE_HEIGHT_MM: Record<ProductCategory, number> = {
  FOOD: 220,       // Standard 200-250g snack pouch height
  ELECTRONICS: 150, // Standard gadget box height
  GENERAL: 240,    // Standard A5/notebook height
  COSMETICS: 180,  // Standard cosmetic bottle/carton
  PHARMA: 120,     // Standard medicine container
};

/**
 * Evaluates Font Size & Readability Compliance under Rule 7(3) & Rule 8 Table 1
 */
export function evaluateFontCompliance(
  declarationKey: string,
  boxHeightPercent: number,
  packageHeightMm: number,
  netQtyValue: number = 250,
  netQtyUnit: string = 'g',
  isEmbossedOrMolded: boolean = false
): FontComplianceInfo {
  // Convert percentage height of bounding box to real-world millimeters
  // e.g., 5.5% of a 220mm pouch = 12.1mm box height (text height ≈ 35-50% of bbox)
  const estimatedTextHeightMm = Math.max(0.6, Number(((boxHeightPercent / 100) * packageHeightMm * 0.45).toFixed(1)));

  const isQuantityNumeral = declarationKey === 'net_quantity';

  if (isQuantityNumeral) {
    // Rule 8 Table 1 Net Quantity Numeral Tiers:
    // Small Tier <= 200g/ml: Min 2.0 mm (Embossed: 4.0 mm)
    // Medium Tier 200g-1kg/L: Min 4.0 mm (Embossed: 6.0 mm)
    // Large Tier > 1kg/L: Min 6.0 mm (Embossed: 6.0 mm)
    const normalizedQtyG = (netQtyUnit.toLowerCase().includes('k') || netQtyUnit.toLowerCase().includes('l'))
      ? netQtyValue * 1000
      : netQtyValue;

    let tier: 'SMALL' | 'MEDIUM' | 'LARGE' = 'SMALL';
    let requiredMin = isEmbossedOrMolded ? 4.0 : 2.0;

    if (normalizedQtyG > 1000) {
      tier = 'LARGE';
      requiredMin = 6.0;
    } else if (normalizedQtyG > 200) {
      tier = 'MEDIUM';
      requiredMin = isEmbossedOrMolded ? 6.0 : 4.0;
    } else {
      tier = 'SMALL';
      requiredMin = isEmbossedOrMolded ? 4.0 : 2.0;
    }

    const isCompliant = estimatedTextHeightMm >= requiredMin;

    return {
      measuredHeightMm: estimatedTextHeightMm,
      requiredMinHeightMm: requiredMin,
      isEmbossedOrMolded,
      isQuantityNumeral: true,
      quantityTier: tier,
      isCompliant,
      ruleReference: 'Rule 8, Table 1 - Legal Metrology (PC) Rules, 2011 (Net Qty Numeral Height)',
      explanation: isCompliant
        ? `Numeral height ${estimatedTextHeightMm}mm meets mandatory minimum ${requiredMin}mm for ${tier} tier (${netQtyValue}${netQtyUnit}).`
        : `Non-Compliant: Numeral height ${estimatedTextHeightMm}mm is below required ${requiredMin}mm for ${tier} tier under Rule 8 Table 1.`,
    };
  }

  // General Declarations (Rule 7(3)):
  // Standard minimum height = 1.0 mm (Embossed/molded/blown = 2.0 mm)
  const requiredMin = isEmbossedOrMolded ? 2.0 : 1.0;
  const isCompliant = estimatedTextHeightMm >= requiredMin;

  return {
    measuredHeightMm: estimatedTextHeightMm,
    requiredMinHeightMm: requiredMin,
    isEmbossedOrMolded,
    isQuantityNumeral: false,
    isCompliant,
    ruleReference: 'Rule 7(3) - Legal Metrology (PC) Rules, 2011 (General Font Readability)',
    explanation: isCompliant
      ? `Text height ${estimatedTextHeightMm}mm complies with Rule 7(3) statutory minimum (${requiredMin}mm).`
      : `Font violation: Text height ${estimatedTextHeightMm}mm is under the 1.0mm statutory minimum under Rule 7(3).`,
  };
}

/**
 * Computes Principal Display Panel (PDP) Dimensions & Exclusion Zones
 */
export function calculatePDPInfo(
  packageShape: PackageShape = 'RECTANGULAR',
  category: ProductCategory = 'FOOD',
  dimensions?: { height: number; width?: number; depth?: number; diameter?: number }
): PDPInfo {
  const height = dimensions?.height || CATEGORY_DEFAULT_PACKAGE_HEIGHT_MM[category] || 220;
  const width = dimensions?.width || 140;

  if (packageShape === 'RECTANGULAR') {
    const totalSurfaceArea = 2 * (height * width + height * (dimensions?.depth || 40) + width * (dimensions?.depth || 40)) / 100;
    const pdpArea = (height * width) / 100; // in sq cm
    return {
      packageShape: 'RECTANGULAR',
      packageDimensionsMm: { height, width, depth: dimensions?.depth || 40 },
      totalSurfaceAreaSqCm: Number(totalSurfaceArea.toFixed(1)),
      pdpAreaSqCm: Number(pdpArea.toFixed(1)),
      pdpAreaPercentage: 100, // 100% of front face
      pdpBoundingBox: { x: 5, y: 8, width: 90, height: 84 }, // Excluding 8% top/bottom sealing crimps
      exclusionZonesDescription: 'Top and bottom 8% seal margins excluded. Full front face (100%) constitutes the Principal Display Panel.',
      isPdpCompliant: true,
      ruleReference: 'Rule 2(h) & Rule 7 - Legal Metrology (PC) Rules, 2011',
    };
  } else if (packageShape === 'CYLINDRICAL') {
    const diameter = dimensions?.diameter || 65;
    const totalSurfaceArea = (Math.PI * diameter * height + 2 * Math.PI * Math.pow(diameter / 2, 2)) / 100;
    const pdpArea = (0.4 * Math.PI * diameter * height) / 100; // 40% of curved surface
    return {
      packageShape: 'CYLINDRICAL',
      packageDimensionsMm: { height, diameter },
      totalSurfaceAreaSqCm: Number(totalSurfaceArea.toFixed(1)),
      pdpAreaSqCm: Number(pdpArea.toFixed(1)),
      pdpAreaPercentage: 40,
      pdpBoundingBox: { x: 10, y: 12, width: 80, height: 76 }, // Exclude neck, shoulder, and base rim
      exclusionZonesDescription: 'Bottle neck, shoulders, can flanges and base rims excluded. Central 40% curved area constitutes PDP.',
      isPdpCompliant: true,
      ruleReference: 'Rule 2(h)(ii) - Legal Metrology (PC) Rules, 2011 (Cylindrical Container PDP)',
    };
  } else {
    // OTHER / POUCH / FLEXIBLE
    const totalSurfaceArea = (2 * height * width) / 100;
    const pdpArea = (0.4 * totalSurfaceArea);
    return {
      packageShape: 'OTHER',
      packageDimensionsMm: { height, width },
      totalSurfaceAreaSqCm: Number(totalSurfaceArea.toFixed(1)),
      pdpAreaSqCm: Number(pdpArea.toFixed(1)),
      pdpAreaPercentage: 40,
      pdpBoundingBox: { x: 8, y: 8, width: 84, height: 84 },
      exclusionZonesDescription: 'Heat seal margins and corner gussets excluded. 40% of total package surface constitutes PDP.',
      isPdpCompliant: true,
      ruleReference: 'Rule 2(h)(iii) - Legal Metrology (PC) Rules, 2011',
    };
  }
}

/**
 * Checks whether a declaration bounding box falls within the Principal Display Panel
 */
export function evaluatePDPPlacement(
  box: BoundingBox,
  pdpInfo: PDPInfo
): PDPPlacementInfo {
  const { pdpBoundingBox } = pdpInfo;

  const inX = box.x >= pdpBoundingBox.x - 2 && (box.x + box.width) <= (pdpBoundingBox.x + pdpBoundingBox.width + 2);
  const inY = box.y >= pdpBoundingBox.y - 2 && (box.y + box.height) <= (pdpBoundingBox.y + pdpBoundingBox.height + 2);

  const isInside = inX && inY;

  if (isInside) {
    return {
      isInsidePDP: true,
      locationDescription: `Positioned within Principal Display Panel (${Math.round(box.y)}% Y-axis, ${Math.round(box.x)}% X-axis).`,
      isCompliant: true,
      ruleReference: pdpInfo.ruleReference,
    };
  }

  // Determine why it violated
  let reason = 'Placed outside the statutory Principal Display Panel area';
  if (box.y < pdpBoundingBox.y) {
    reason = 'Placed on top sealing margin / flange (outside PDP exclusion zone)';
  } else if ((box.y + box.height) > (pdpBoundingBox.y + pdpBoundingBox.height)) {
    reason = 'Placed on bottom crimp / base rim (outside PDP exclusion zone)';
  }

  return {
    isInsidePDP: false,
    locationDescription: reason,
    isCompliant: false,
    ruleReference: pdpInfo.ruleReference,
  };
}

/**
 * Normalizes units and calculates Unit Sale Price with mathematical verification
 */
export function calculatePricingIntelligence(
  mrp: number,
  netQtyValue: number,
  netQtyUnit: string,
  printedUSPStr?: string,
  tolerancePercent: number = 1.0
): PricingIntelligence {
  const cleanUnit = (netQtyUnit || 'g').trim().toLowerCase();
  
  // Standardize unit
  let standardUnit = 'g';
  let standardizedQuantity = netQtyValue;
  let baseUnit = 'g';

  if (cleanUnit === 'kg' || cleanUnit === 'kilogram' || cleanUnit === 'kgs') {
    standardUnit = 'g';
    standardizedQuantity = netQtyValue * 1000;
    baseUnit = 'g';
  } else if (cleanUnit === 'l' || cleanUnit === 'litre' || cleanUnit === 'liter' || cleanUnit === 'ltr') {
    standardUnit = 'ml';
    standardizedQuantity = netQtyValue * 1000;
    baseUnit = 'ml';
  } else if (cleanUnit === 'ml' || cleanUnit === 'millilitre' || cleanUnit === 'milliliter') {
    standardUnit = 'ml';
    standardizedQuantity = netQtyValue;
    baseUnit = 'ml';
  } else if (cleanUnit === 'pcs' || cleanUnit === 'piece' || cleanUnit === 'units' || cleanUnit === 'n' || cleanUnit === 'nos') {
    standardUnit = 'nos';
    standardizedQuantity = netQtyValue;
    baseUnit = 'nos';
  } else {
    standardUnit = 'g';
    standardizedQuantity = netQtyValue;
    baseUnit = 'g';
  }

  // Parse printed USP if present
  let hasPrintedUSP = false;
  let printedUSPAmount: number | undefined = undefined;
  let printedUSPUnit: string | undefined = undefined;

  if (printedUSPStr && printedUSPStr.trim() !== '' && printedUSPStr.toLowerCase() !== 'not detected' && printedUSPStr.toLowerCase() !== 'missing' && !printedUSPStr.toLowerCase().includes('exempt')) {
    hasPrintedUSP = true;
    const numberMatch = printedUSPStr.replace(/,/g, '').match(/([0-9]+(?:\.[0-9]+)?)/);
    if (numberMatch) {
      printedUSPAmount = parseFloat(numberMatch[1]);
    }
    if (printedUSPStr.includes('/g') || printedUSPStr.includes('per g') || printedUSPStr.includes('per gram')) {
      printedUSPUnit = 'g';
    } else if (printedUSPStr.includes('/kg') || printedUSPStr.includes('per kg')) {
      printedUSPUnit = 'kg';
    } else if (printedUSPStr.includes('/ml') || printedUSPStr.includes('per ml')) {
      printedUSPUnit = 'ml';
    } else if (printedUSPStr.includes('/l') || printedUSPStr.includes('per l') || printedUSPStr.includes('per litre')) {
      printedUSPUnit = 'l';
    } else if (printedUSPStr.includes('/nos') || printedUSPStr.includes('per nos') || printedUSPStr.includes('piece')) {
      printedUSPUnit = 'nos';
    } else {
      printedUSPUnit = baseUnit;
    }
  }

  // Calculate legal mathematical USP
  let calculatedUSPAmount = 0;
  let calculatedUSPUnit = baseUnit;

  // Non-Food / Stationery / Hardware exemptions or missing values
  const isExemptUnit = cleanUnit.includes('page') || cleanUnit.includes('sheet') || cleanUnit === 'unit' || (printedUSPStr && printedUSPStr.toLowerCase().includes('exempt'));

  if (mrp <= 0 || netQtyValue <= 0) {
    return {
      mrpAmount: mrp,
      mrpCurrency: '₹',
      netQuantityValue: netQtyValue,
      netQuantityUnit: netQtyUnit,
      standardizedQuantity: netQtyValue,
      standardUnit: netQtyUnit,
      hasPrintedUSP: false,
      calculatedUSPAmount: 0,
      calculatedUSPUnit: netQtyUnit || 'g',
      isDiscrepancy: false,
      differenceAmount: 0,
      differencePercentage: 0,
      discrepancyType: 'NOT_APPLICABLE',
      statusDescription: 'Cannot calculate Unit Sale Price: MRP or Net Quantity not detected in this image.',
      ruleReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011',
    };
  }

  if (isExemptUnit) {
    return {
      mrpAmount: mrp,
      mrpCurrency: '₹',
      netQuantityValue: netQtyValue,
      netQuantityUnit: netQtyUnit,
      standardizedQuantity: netQtyValue,
      standardUnit: netQtyUnit,
      hasPrintedUSP: false,
      calculatedUSPAmount: mrp,
      calculatedUSPUnit: netQtyUnit,
      isDiscrepancy: false,
      differenceAmount: 0,
      differencePercentage: 0,
      discrepancyType: 'NONE',
      statusDescription: 'Statutory USP calculation exempt under Rule 6(1)(e) (Books/Stationery/Single-Unit Hardware).',
      ruleReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011 [Exemption Clause]',
    };
  }

  if (standardizedQuantity > 0) {
    if (cleanUnit === 'kg') {
      calculatedUSPAmount = Number((mrp / netQtyValue).toFixed(2));
      calculatedUSPUnit = 'kg';
    } else if (cleanUnit === 'l' || cleanUnit === 'litre') {
      calculatedUSPAmount = Number((mrp / netQtyValue).toFixed(2));
      calculatedUSPUnit = 'l';
    } else if (cleanUnit === 'nos' || cleanUnit === 'pcs' || cleanUnit === 'tablets') {
      calculatedUSPAmount = Number((mrp / netQtyValue).toFixed(2));
      calculatedUSPUnit = 'nos';
    } else {
      calculatedUSPAmount = Number((mrp / standardizedQuantity).toFixed(3));
      calculatedUSPUnit = baseUnit;
    }
  }

  // Compare printed vs calculated
  let isDiscrepancy = false;
  let differenceAmount = 0;
  let differencePercentage = 0;
  let discrepancyType: 'NONE' | 'OVERCHARGING' | 'UNDERSTATING' | 'MISSING_USP' | 'INVALID_FORMAT' | 'NOT_APPLICABLE' = 'NONE';
  let statusDescription = 'Unit Sale Price matches statutory legal requirement.';

  if (!hasPrintedUSP) {
    isDiscrepancy = true;
    discrepancyType = 'MISSING_USP';
    statusDescription = `Mandatory Unit Sale Price not printed on package. Legal calculated price: ₹${calculatedUSPAmount}/${calculatedUSPUnit}.`;
  } else if (printedUSPAmount !== undefined) {
    let comparableCalculatedAmount = calculatedUSPAmount;
    if (printedUSPUnit === 'kg' && calculatedUSPUnit === 'g') {
      comparableCalculatedAmount = calculatedUSPAmount * 1000;
    } else if (printedUSPUnit === 'g' && calculatedUSPUnit === 'kg') {
      comparableCalculatedAmount = calculatedUSPAmount / 1000;
    }

    differenceAmount = Number((printedUSPAmount - comparableCalculatedAmount).toFixed(2));
    const percentDiff = Math.abs((differenceAmount / (comparableCalculatedAmount || 1)) * 100);
    differencePercentage = Math.round(percentDiff);

    if (percentDiff > tolerancePercent) {
      isDiscrepancy = true;
      if (differenceAmount > 0) {
        discrepancyType = 'OVERCHARGING';
        statusDescription = `Printed USP (₹${printedUSPAmount}/${printedUSPUnit}) is ${differencePercentage}% higher than the legal price (₹${comparableCalculatedAmount.toFixed(2)}/${printedUSPUnit}). Potential consumer overcharging.`;
      } else {
        discrepancyType = 'UNDERSTATING';
        statusDescription = `Printed USP is ${differencePercentage}% lower than calculated value. Mathematical declaration discrepancy.`;
      }
    }
  }

  return {
    mrpAmount: mrp,
    mrpCurrency: '₹',
    netQuantityValue: netQtyValue,
    netQuantityUnit: cleanUnit,
    standardizedQuantity,
    standardUnit,
    hasPrintedUSP,
    printedUSPAmount,
    printedUSPUnit,
    printedUSPText: printedUSPStr,
    calculatedUSPAmount,
    calculatedUSPUnit,
    isDiscrepancy,
    differenceAmount,
    differencePercentage,
    discrepancyType,
    statusDescription,
    ruleReference: 'Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011'
  };
}

/**
 * Analyzes compliance across all dimensions: Presence, USP Math, Font Size & PDP Placement
 */
export function analyzeCompliance(
  declarations: MandatoryDeclaration[],
  pricing: PricingIntelligence,
  category: ProductCategory = 'FOOD',
  packageShape: PackageShape = 'RECTANGULAR',
  boundingBoxes: BoundingBox[] = []
): {
  verifiedCount: number;
  totalCount: number;
  compliancePercentage: number;
  overallStatus: InspectionOverallStatus;
  findings: InspectionFinding[];
  pdpInfo: PDPInfo;
  fontReadabilitySummary: {
    totalMeasured: number;
    compliantCount: number;
    failedCount: number;
    overallFontCompliant: boolean;
  };
} {
  const findings: InspectionFinding[] = [];
  const totalCount = declarations.length;
  let passCount = 0;
  let notDetectedCount = 0;

  // Calculate PDP Info
  const pdpInfo = calculatePDPInfo(packageShape, category);

  // Evaluate Font Size & PDP for each declaration and bounding box
  let fontCompliantCount = 0;
  let fontFailedCount = 0;

  declarations.forEach(decl => {
    // Only check font / PDP if the declaration was actually detected
    if (decl.status === 'PASS') {
      passCount++;
      const box = boundingBoxes.find(b => b.declarationKey === decl.key);
      const boxHeightPercent = box ? box.height : 5.0;

      // Font check
      const fontInfo = evaluateFontCompliance(
        decl.key,
        boxHeightPercent,
        pdpInfo.packageDimensionsMm?.height || 220,
        pricing.netQuantityValue,
        pricing.netQuantityUnit
      );
      decl.fontCompliance = fontInfo;
      if (box) box.fontCompliance = fontInfo;

      if (fontInfo.isCompliant) fontCompliantCount++;
      else fontFailedCount++;

      // PDP Placement check
      if (box) {
        const pdpPlacement = evaluatePDPPlacement(box, pdpInfo);
        decl.pdpPlacement = pdpPlacement;
        box.isInsidePDP = pdpPlacement.isInsidePDP;

        if (!pdpPlacement.isInsidePDP) {
          findings.push({
            id: `finding-pdp-${decl.key}`,
            severity: 'WARNING',
            title: `Placement Note: ${decl.name} Outside PDP`,
            description: `${decl.name} is positioned on ${pdpPlacement.locationDescription}.`,
            legalActClause: pdpInfo.ruleReference,
            declarationKey: decl.key,
          });
        }
      }

      findings.push({
        id: `finding-${decl.key}`,
        severity: 'SUCCESS',
        title: `${decl.name} Verified`,
        description: `Verified from package image: "${decl.extractedValue}" (Confidence: ${decl.confidence}%)`,
        legalActClause: `Compliant with ${decl.legalReference}`,
        declarationKey: decl.key
      });
    } else if (decl.status === 'NOT_DETECTED') {
      notDetectedCount++;
      findings.push({
        id: `finding-missing-${decl.key}`,
        severity: 'INFO',
        title: `${decl.name}: Not Detected in Image`,
        description: `This declaration was not readable from the visible side of the packaging. If printed on other sides, please upload remaining sides.`,
        legalActClause: decl.legalReference,
        declarationKey: decl.key
      });
    } else if (decl.status === 'FAIL') {
      findings.push({
        id: `finding-violation-${decl.key}`,
        severity: 'CRITICAL',
        title: `Statutory Violation: ${decl.name}`,
        description: decl.explanation || `Mandatory declaration for ${decl.name} violated statutory standard.`,
        legalActClause: decl.legalReference,
        declarationKey: decl.key
      });
    } else if (decl.status === 'EXEMPT') {
      passCount++;
    }
  });

  const fontReadabilitySummary = {
    totalMeasured: fontCompliantCount + fontFailedCount,
    compliantCount: fontCompliantCount,
    failedCount: fontFailedCount,
    overallFontCompliant: fontFailedCount === 0,
  };

  // Pricing analysis for Food (Only if both MRP and Quantity were detected)
  if (category === 'FOOD' && pricing.mrpAmount > 0 && pricing.netQuantityValue > 0) {
    if (pricing.isDiscrepancy) {
      if (pricing.discrepancyType === 'OVERCHARGING') {
        findings.push({
          id: 'finding-pricing-mismatch',
          severity: 'CRITICAL',
          title: 'Pricing Discrepancy & Overcharging Detected',
          description: `Printed USP (${pricing.printedUSPText || 'N/A'}) is mathematically inconsistent with MRP (₹${pricing.mrpAmount}) and Net Quantity (${pricing.netQuantityValue}${pricing.netQuantityUnit}). True rate is ₹${pricing.calculatedUSPAmount.toFixed(2)}/${pricing.calculatedUSPUnit} (Consumer Overcharge: +${pricing.differencePercentage}%).`,
          legalActClause: 'Section 36(1) of Legal Metrology Act, 2009 & Rule 6(1)(e) of PCR 2011',
          declarationKey: 'unit_sale_price'
        });
      }
    } else if (pricing.hasPrintedUSP) {
      findings.push({
        id: 'finding-pricing-ok',
        severity: 'SUCCESS',
        title: 'Unit Sale Price Mathematically Verified',
        description: `Printed USP matches calculated MRP/Quantity ratio perfectly.`,
        legalActClause: 'Rule 6(1)(e) Compliant',
        declarationKey: 'unit_sale_price'
      });
    }
  }

  const compliancePercentage = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  // Determine overall status
  let overallStatus: InspectionOverallStatus = 'COMPLIANT';
  const hasCritical = findings.some(f => f.severity === 'CRITICAL');

  if (hasCritical) {
    overallStatus = 'CRITICAL_NON_COMPLIANT';
  } else if (passCount < 3) {
    overallStatus = 'INSUFFICIENT_EVIDENCE';
  } else if (notDetectedCount > 0) {
    overallStatus = 'PARTIALLY_VERIFIED';
  } else {
    overallStatus = 'COMPLIANT';
  }

  return {
    verifiedCount: passCount,
    totalCount,
    compliancePercentage,
    overallStatus,
    findings,
    pdpInfo,
    fontReadabilitySummary
  };
}