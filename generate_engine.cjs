const fs = require('fs');
const path = require('path');

const complianceEngineContent = `
import { 
  MandatoryDeclaration, 
  PricingIntelligence, 
  InspectionFinding, 
  InspectionOverallStatus,
  ComplianceStatus
} from '../types/inspection';

/**
 * Standard Legal Metrology 8 Mandatory Declarations metadata definitions
 * as per Legal Metrology (Packaged Commodities) Rules, 2011 (as amended)
 */
export const MANDATORY_DECLARATION_DEFINITIONS = [
  {
    key: 'mrp',
    name: 'Maximum Retail Price (MRP)',
    legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011',
    description: 'Must include "incl. of all taxes" and clear currency symbol (₹ / Rs.).'
  },
  {
    key: 'net_quantity',
    name: 'Net Quantity',
    legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011',
    description: 'Must be in standard SI units (g, kg, ml, l, pcs) with compliant font size.'
  },
  {
    key: 'unit_sale_price',
    name: 'Unit Sale Price (USP)',
    legalReference: 'Rule 6(1)(e) [Amendment 2021] - Mandatory for all retail packs',
    description: 'Unit sale price in ₹ per g/kg/ml/l/piece to enable transparent comparison.'
  },
  {
    key: 'expiry_date',
    name: 'Expiry / Best Before / Mfg Date',
    legalReference: 'Rule 6(1)(c) - Legal Metrology (PC) Rules, 2011',
    description: 'Month and Year of manufacture/packing or "Best Before" timeline.'
  },
  {
    key: 'country_of_origin',
    name: 'Country of Origin',
    legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011',
    description: 'Clear statement of origin (e.g., "Country of Origin: India").'
  },
  {
    key: 'manufacturer_details',
    name: 'Manufacturer / Packer Details',
    legalReference: 'Rule 6(1)(d) - Legal Metrology (PC) Rules, 2011',
    description: 'Complete name, address, and legal entity identifier of manufacturer/packer.'
  },
  {
    key: 'customer_care',
    name: 'Customer Care Details',
    legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011',
    description: 'Name/designation, address, telephone/helpline number, and email.'
  },
  {
    key: 'generic_name',
    name: 'Generic / Common Product Name',
    legalReference: 'Rule 6(1)(a) - Legal Metrology (PC) Rules, 2011',
    description: 'Generic name or common description of the commodity contained in package.'
  }
];

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
  } else if (cleanUnit === 'pcs' || cleanUnit === 'piece' || cleanUnit === 'units' || cleanUnit === 'n') {
    standardUnit = 'pcs';
    standardizedQuantity = netQtyValue;
    baseUnit = 'pcs';
  } else {
    standardUnit = 'g';
    standardizedQuantity = netQtyValue;
    baseUnit = 'g';
  }

  // Parse printed USP if present
  let hasPrintedUSP = false;
  let printedUSPAmount: number | undefined = undefined;
  let printedUSPUnit: string | undefined = undefined;

  if (printedUSPStr && printedUSPStr.trim() !== '' && printedUSPStr.toLowerCase() !== 'not detected' && printedUSPStr.toLowerCase() !== 'missing') {
    hasPrintedUSP = true;
    // Extract numeric amount e.g. "₹0.25/g", "0.25 / g", "Rs. 48/kg"
    const numberMatch = printedUSPStr.replace(/,/g, '').match(/([0-9]+(?:\.[0-9]+)?)/);
    if (numberMatch) {
      printedUSPAmount = parseFloat(numberMatch[1]);
    }
    // Extract unit e.g. "/g", "/kg", "/ml", "/l", "/piece"
    const unitMatch = printedUSPStr.match(/\/\s*([a-zA-Z]+)/);
    if (unitMatch) {
      printedUSPUnit = unitMatch[1].toLowerCase();
    } else {
      printedUSPUnit = baseUnit;
    }
  }

  // Determine standard unit sale price presentation as per Indian Legal Metrology Rules:
  // For pack <= 1kg / 1L: USP is in Rs. per g / ml.
  // For pack > 1kg / 1L: USP is in Rs. per kg / L.
  let calculatedUSPAmount = 0;
  let calculatedUSPUnit = baseUnit;

  if (printedUSPUnit && (printedUSPUnit === 'kg' || printedUSPUnit === 'l')) {
    // If printed USP was per kg / L, calculate accordingly
    const qtyInKgOrL = standardizedQuantity / 1000;
    calculatedUSPAmount = qtyInKgOrL > 0 ? mrp / qtyInKgOrL : 0;
    calculatedUSPUnit = printedUSPUnit;
  } else {
    // Default per base unit (e.g. per g, per ml, per pcs)
    calculatedUSPAmount = standardizedQuantity > 0 ? mrp / standardizedQuantity : 0;
    calculatedUSPUnit = baseUnit;
  }

  // Round to 2 or 4 decimal places for precision
  calculatedUSPAmount = Math.round(calculatedUSPAmount * 10000) / 10000;

  // Comparison & Discrepancy analysis
  let isDiscrepancy = false;
  let differenceAmount = 0;
  let differencePercentage = 0;
  let discrepancyType: PricingIntelligence['discrepancyType'] = 'NONE';
  let statusDescription = 'Unit Sale Price mathematically verified';

  if (!hasPrintedUSP) {
    isDiscrepancy = true;
    discrepancyType = 'MISSING_USP';
    statusDescription = 'Unit Sale Price (USP) not detected on product label (Mandatory under Rule 6(1)(e))';
  } else if (printedUSPAmount !== undefined) {
    // If units differ (e.g. printed per kg, calculated per g), normalize printed for fair comparison
    let normalizedPrinted = printedUSPAmount;
    if (printedUSPUnit === 'kg' && calculatedUSPUnit === 'g') {
      normalizedPrinted = printedUSPAmount / 1000;
    } else if (printedUSPUnit === 'g' && calculatedUSPUnit === 'kg') {
      normalizedPrinted = printedUSPAmount * 1000;
    } else if (printedUSPUnit === 'l' && calculatedUSPUnit === 'ml') {
      normalizedPrinted = printedUSPAmount / 1000;
    } else if (printedUSPUnit === 'ml' && calculatedUSPUnit === 'l') {
      normalizedPrinted = printedUSPAmount * 1000;
    }

    differenceAmount = Math.round((normalizedPrinted - calculatedUSPAmount) * 10000) / 10000;
    differencePercentage = calculatedUSPAmount > 0 
      ? Math.round(((normalizedPrinted - calculatedUSPAmount) / calculatedUSPAmount) * 1000) / 10 
      : 0;

    const absoluteDiff = Math.abs(differenceAmount);
    const toleranceValue = (tolerancePercent / 100) * calculatedUSPAmount;

    if (absoluteDiff > Math.max(0.005, toleranceValue)) {
      isDiscrepancy = true;
      if (differenceAmount > 0) {
        discrepancyType = 'OVERCHARGING';
        statusDescription = \`Potential Pricing Discrepancy: Printed USP (₹\${printedUSPAmount}/\${printedUSPUnit}) exceeds calculated unit rate by ₹\${Math.abs(differenceAmount).toFixed(2)} (\${differencePercentage > 0 ? '+' : ''}\${differencePercentage}%)\`;
      } else {
        discrepancyType = 'UNDERSTATING';
        statusDescription = \`Mathematical Mismatch: Printed USP (₹\${printedUSPAmount}/\${printedUSPUnit}) is lower than calculated rate by ₹\${Math.abs(differenceAmount).toFixed(2)} (\${differencePercentage}%)\`;
      }
    }
  }

  return {
    mrpAmount: mrp,
    mrpCurrency: '₹',
    netQuantityValue: netQtyValue,
    netQuantityUnit: netQtyUnit,
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
 * Computes overall compliance scorecard and generates legal enforcement findings
 */
export function analyzeCompliance(
  declarations: MandatoryDeclaration[],
  pricing: PricingIntelligence
): {
  verifiedCount: number;
  totalCount: number;
  compliancePercentage: number;
  overallStatus: InspectionOverallStatus;
  findings: InspectionFinding[];
} {
  const totalCount = declarations.length;
  const passCount = declarations.filter(d => d.status === 'PASS').length;
  const failCount = declarations.filter(d => d.status === 'FAIL').length;
  const warningCount = declarations.filter(d => d.status === 'WARNING').length;

  const compliancePercentage = totalCount > 0 
    ? Math.round((passCount / totalCount) * 1000) / 10 
    : 0;

  let overallStatus: InspectionOverallStatus = 'COMPLIANT';
  if (failCount > 0 || pricing.isDiscrepancy) {
    if (failCount >= 3 || pricing.discrepancyType === 'OVERCHARGING') {
      overallStatus = 'ATTENTION_REQUIRED';
    } else {
      overallStatus = 'ATTENTION_REQUIRED';
    }
  } else if (warningCount > 0) {
    overallStatus = 'ATTENTION_REQUIRED';
  } else {
    overallStatus = 'COMPLIANT';
  }

  // Generate actionable findings
  const findings: InspectionFinding[] = [];

  // Pricing intelligence findings
  if (pricing.isDiscrepancy) {
    if (pricing.discrepancyType === 'MISSING_USP') {
      findings.push({
        id: 'finding-pricing-missing',
        severity: 'CRITICAL',
        title: 'Missing Mandatory Unit Sale Price (USP)',
        description: 'Product packaging fails to declare Unit Sale Price as required by the 2021 Legal Metrology Amendment for retail packs.',
        legalActClause: 'Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011',
        declarationKey: 'unit_sale_price'
      });
    } else if (pricing.discrepancyType === 'OVERCHARGING') {
      findings.push({
        id: 'finding-pricing-mismatch',
        severity: 'CRITICAL',
        title: 'Pricing Discrepancy & Mathematical Distortion Detected',
        description: \`Printed USP (₹\${pricing.printedUSPAmount}/\${pricing.printedUSPUnit}) is mathematically inconsistent with MRP (₹\${pricing.mrpAmount}) and Net Quantity (\${pricing.netQuantityValue}\${pricing.netQuantityUnit}). True rate is ₹\${pricing.calculatedUSPAmount.toFixed(2)}/\${pricing.calculatedUSPUnit} (Difference: ₹\${Math.abs(pricing.differenceAmount).toFixed(2)}/\${pricing.calculatedUSPUnit}).\`,
        legalActClause: 'Section 36(1) of Legal Metrology Act, 2009 & Rule 6(1)(e) of PCR 2011',
        declarationKey: 'unit_sale_price'
      });
    } else if (pricing.discrepancyType === 'UNDERSTATING') {
      findings.push({
        id: 'finding-pricing-understate',
        severity: 'WARNING',
        title: 'Unit Sale Price Computation Mismatch',
        description: \`Printed USP does not match mathematical division of MRP by declared Net Quantity. Variance of \${pricing.differencePercentage}% detected.\`,
        legalActClause: 'Rule 6(1)(e) of PCR 2011',
        declarationKey: 'unit_sale_price'
      });
    }
  } else {
    findings.push({
      id: 'finding-pricing-ok',
      severity: 'SUCCESS',
      title: 'Unit Sale Price Mathematically Verified',
      description: \`Printed USP (₹\${pricing.printedUSPAmount}/\${pricing.printedUSPUnit}) matches calculated MRP/Quantity ratio perfectly.\`,
      legalActClause: 'Rule 6(1)(e) Compliant',
      declarationKey: 'unit_sale_price'
    });
  }

  // Mandatory declarations findings
  declarations.forEach(decl => {
    if (decl.status === 'FAIL' && decl.key !== 'unit_sale_price') {
      findings.push({
        id: \`finding-\${decl.key}\`,
        severity: 'CRITICAL',
        title: \`Non-Compliance: \${decl.name} Not Declared\`,
        description: decl.explanation || \`Mandatory declaration for \${decl.name} was not found on the scanned product surface.\`,
        legalActClause: decl.legalReference,
        declarationKey: decl.key
      });
    } else if (decl.status === 'WARNING' && decl.key !== 'unit_sale_price') {
      findings.push({
        id: \`finding-\${decl.key}\`,
        severity: 'WARNING',
        title: \`Notice: \${decl.name} Requires Clarification\`,
        description: decl.explanation,
        legalActClause: decl.legalReference,
        declarationKey: decl.key
      });
    } else if (decl.status === 'PASS' && decl.key !== 'unit_sale_price') {
      findings.push({
        id: \`finding-\${decl.key}\`,
        severity: 'SUCCESS',
        title: \`\${decl.name} Declaration Verified\`,
        description: \`Found: "\${decl.extractedValue}" (OCR Confidence: \${decl.confidence}%)\`,
        legalActClause: \`Compliant with \${decl.legalReference}\`,
        declarationKey: decl.key
      });
    }
  });

  return {
    verifiedCount: passCount,
    totalCount,
    compliancePercentage,
    overallStatus,
    findings
  };
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'services', 'complianceEngine.ts'), complianceEngineContent.trim(), 'utf8');
console.log('Created src/services/complianceEngine.ts');
