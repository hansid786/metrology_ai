import { extractEvidenceDeclarations } from './evidenceExtractor';
import { calculatePricingIntelligence, analyzeCompliance } from './complianceEngine';
import { aggregateMultiSideScans } from './multiSideAggregator';
import { assessImageQuality } from '../utils/imageQuality';
import { InspectionResult, MandatoryDeclaration } from '../types/inspection';

export interface QATestCaseResult {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  expected: string;
  actual: string;
  durationMs: number;
  details: string;
}

export interface QASuiteReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRatePercent: number;
  durationTotalMs: number;
  results: QATestCaseResult[];
}

/**
 * Runs 15 Automated Accuracy & Hallucination-Resistance Verification Tests
 */
export async function runPipelineQASuite(): Promise<QASuiteReport> {
  const startTime = Date.now();
  const results: QATestCaseResult[] = [];

  // TEST 1: Exact MRP Parsing
  {
    const t0 = Date.now();
    const raw = 'CRUNCHY CHIPS\nMRP ₹149.00 (INCL. OF ALL TAXES)\nNet Qty: 200g';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const passed = ext.mrpAmount === 149.0;
    results.push({
      id: 'QA-01',
      name: 'Exact MRP Parsing',
      category: 'Pricing Accuracy',
      passed,
      expected: '149.00',
      actual: ext.mrpAmount?.toString() || 'null',
      durationMs: Date.now() - t0,
      details: 'Extracts exact MRP numeric value from "MRP ₹149.00".'
    });
  }

  // TEST 2: Negative Lookahead — PIN Code Rejection
  {
    const t0 = Date.now();
    const raw = 'Manufactured by Apex Foods, Okhla Phase-III, New Delhi - 110020.\nBest Before: 6 Months';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const passed = ext.mrpAmount === null;
    results.push({
      id: 'QA-02',
      name: 'Negative Lookahead: PIN Code as MRP',
      category: 'Hallucination Prevention',
      passed,
      expected: 'Not Detected (null)',
      actual: ext.mrpAmount !== null ? `False Match: ${ext.mrpAmount}` : 'Not Detected (null)',
      durationMs: Date.now() - t0,
      details: 'Ensures 6-digit PIN code 110020 is never misidentified as an MRP amount.'
    });
  }

  // TEST 3: Negative Lookahead — 1800 Customer Helpline
  {
    const t0 = Date.now();
    const raw = 'For feedback or queries call toll-free: 1800 112 990 or email care@apex.in';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const passed = ext.mrpAmount === null;
    results.push({
      id: 'QA-03',
      name: 'Negative Lookahead: Toll-Free Helpline as MRP',
      category: 'Hallucination Prevention',
      passed,
      expected: 'Not Detected (null)',
      actual: ext.mrpAmount !== null ? `False Match: ${ext.mrpAmount}` : 'Not Detected (null)',
      durationMs: Date.now() - t0,
      details: 'Ensures 1800-series helpline number is not extracted as pricing.'
    });
  }

  // TEST 4: Net Quantity & Unit Extraction
  {
    const t0 = Date.now();
    const raw = 'Pure Mustard Oil\nNet Quantity: 500 ml\nMRP ₹110.00';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const passed = ext.netQuantityValue === 500 && ext.netQuantityUnit === 'ml';
    results.push({
      id: 'QA-04',
      name: 'Net Quantity & Liquid Unit Extraction',
      category: 'Quantity Verification',
      passed,
      expected: '500 ml',
      actual: `${ext.netQuantityValue} ${ext.netQuantityUnit}`,
      durationMs: Date.now() - t0,
      details: 'Extracts exact volume value and standardized metric unit (ml).'
    });
  }

  // TEST 5: Commercial Entity Separation (Manufacturer vs Marketer)
  {
    const t0 = Date.now();
    const raw = 'Manufactured by: ABC Agro Industries Pvt. Ltd., Pune - 411001\nMarketed by: Super Global Brands LLP, Mumbai - 400001';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const hasMfg = ext.entityRoles.manufacturer?.includes('ABC Agro');
    const hasMkt = ext.entityRoles.marketer?.includes('Super Global');
    const passed = Boolean(hasMfg && hasMkt);
    results.push({
      id: 'QA-05',
      name: 'Entity Separation (Mfg vs Marketer)',
      category: 'Entity Integrity',
      passed,
      expected: 'Mfg: ABC Agro | Marketer: Super Global',
      actual: `Mfg: ${ext.entityRoles.manufacturer?.slice(0, 20)} | Mkt: ${ext.entityRoles.marketer?.slice(0, 20)}`,
      durationMs: Date.now() - t0,
      details: 'Preserves separate legal accountability for manufacturer and marketing entity.'
    });
  }

  // TEST 6: Date Separation (MFD vs Best Before vs Expiry)
  {
    const t0 = Date.now();
    const raw = 'Date of Mfg: 01/02/2026\nBest Before: 9 Months from packaging\nBatch No: B-89402';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const passed = Boolean(ext.manufacturingDates.mfgDate && ext.manufacturingDates.bestBefore);
    results.push({
      id: 'QA-06',
      name: 'Date Classification (MFD & Best Before)',
      category: 'Date Integrity',
      passed,
      expected: 'MFD & Best Before classified distinctly',
      actual: `MFD: ${ext.manufacturingDates.mfgDate} | BB: ${ext.manufacturingDates.bestBefore}`,
      durationMs: Date.now() - t0,
      details: 'Correctly classifies packaging date vs consumer expiry timeline.'
    });
  }

  // TEST 7: Zero-Guesswork on Missing Fields
  {
    const t0 = Date.now();
    const raw = 'Pure Basmati Rice Brand Front Display\nPremium Aged Grain';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const passed = ext.mrpAmount === null && ext.netQuantityValue === null && ext.declarations.find(d => d.key === 'mrp')?.status === 'NOT_DETECTED';
    results.push({
      id: 'QA-07',
      name: 'Zero-Guesswork on Blank Image Text',
      category: 'Hallucination Prevention',
      passed,
      expected: 'All missing fields marked Not Detected',
      actual: passed ? 'All missing fields verified Not Detected' : 'Guessed synthetic values',
      durationMs: Date.now() - t0,
      details: 'Ensures no placeholder or default values are invented when fields are unreadable.'
    });
  }

  // TEST 8: USP Overcharging Detection
  {
    const t0 = Date.now();
    const pricing = calculatePricingIntelligence(50, 250, 'g', '₹ 0.31 / g');
    const passed = pricing.isDiscrepancy && pricing.discrepancyType === 'OVERCHARGING' && pricing.differencePercentage > 20;
    results.push({
      id: 'QA-08',
      name: 'USP Mathematical Overcharging Audit',
      category: 'Compliance Intelligence',
      passed,
      expected: 'OVERCHARGING discrepancy detected (+25% difference)',
      actual: `${pricing.discrepancyType} (${pricing.differencePercentage}%)`,
      durationMs: Date.now() - t0,
      details: 'Detects overcharging when printed USP ₹0.31/g exceeds legal rate ₹0.20/g.'
    });
  }

  // TEST 9: FSSAI 14-Digit License Detection
  {
    const t0 = Date.now();
    const raw = 'fssai Lic. No. 10018011000234\nPacked by Fresh Agro';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const passed = ext.detectedLicenseNumbers.fssai === '10018011000234';
    results.push({
      id: 'QA-09',
      name: '14-Digit FSSAI License Validation',
      category: 'Licensing Verification',
      passed,
      expected: '10018011000234',
      actual: ext.detectedLicenseNumbers.fssai || 'null',
      durationMs: Date.now() - t0,
      details: 'Validates 14-digit FSSAI statutory license number.'
    });
  }

  // TEST 10: BIS Safety Mark for Electronics
  {
    const t0 = Date.now();
    const raw = 'VoltMax Power Core 20000mAh\nBIS R-84001928 ISI Marked\nInput: 5V/3A';
    const ext = extractEvidenceDeclarations(raw, [], null, 'ELECTRONICS');
    const passed = Boolean(ext.detectedLicenseNumbers.bis?.includes('R-84001928'));
    results.push({
      id: 'QA-10',
      name: 'BIS Safety Registration for Electronics',
      category: 'Licensing Verification',
      passed,
      expected: 'R-84001928',
      actual: ext.detectedLicenseNumbers.bis || 'null',
      durationMs: Date.now() - t0,
      details: 'Validates BIS compulsory registration order safety mark on electronics.'
    });
  }

  // TEST 11: Multilingual Hindi + English Text
  {
    const t0 = Date.now();
    const raw = 'शुद्ध गाय का घी / Pure Cow Ghee\nअधिकतम खुदरा मूल्य MRP ₹ 290.00\nशुद्ध मात्रा Net Qty: 500 ml';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const passed = ext.mrpAmount === 290.0 && ext.netQuantityValue === 500;
    results.push({
      id: 'QA-11',
      name: 'Multilingual Hindi + English Parsing',
      category: 'Multilingual NLP',
      passed,
      expected: 'MRP: 290 | Qty: 500 ml',
      actual: `MRP: ${ext.mrpAmount} | Qty: ${ext.netQuantityValue} ${ext.netQuantityUnit}`,
      durationMs: Date.now() - t0,
      details: 'Accurately parses bilingual Indian packaging declarations.'
    });
  }

  // TEST 12: Stationery & Book Exemption Handling
  {
    const t0 = Date.now();
    const pricing = calculatePricingIntelligence(80, 172, 'Pages', undefined);
    const passed = pricing.discrepancyType === 'NONE' && pricing.statusDescription.includes('exempt');
    results.push({
      id: 'QA-12',
      name: 'Stationery Rule 6(1)(e) USP Exemption',
      category: 'Compliance Intelligence',
      passed,
      expected: 'Exempt under Rule 6(1)(e)',
      actual: pricing.statusDescription,
      durationMs: Date.now() - t0,
      details: 'Correctly recognizes non-food commodities as USP exempt.'
    });
  }

  // TEST 13: Compliance Status — INSUFFICIENT_EVIDENCE
  {
    const t0 = Date.now();
    const decls: MandatoryDeclaration[] = [
      { id: '1', key: 'mrp', name: 'MRP', legalReference: 'Rule 6(1)(e)', status: 'PASS', extractedValue: '₹50', confidence: 95, explanation: '' },
      { id: '2', key: 'net_quantity', name: 'Net Qty', legalReference: 'Rule 6(1)(b)', status: 'NOT_DETECTED', extractedValue: 'Not Detected', confidence: 0, explanation: '' },
      { id: '3', key: 'mfg', name: 'Mfg', legalReference: 'Rule 6(1)(d)', status: 'NOT_DETECTED', extractedValue: 'Not Detected', confidence: 0, explanation: '' },
      { id: '4', key: 'care', name: 'Care', legalReference: 'Rule 6(1)(f)', status: 'NOT_DETECTED', extractedValue: 'Not Detected', confidence: 0, explanation: '' },
    ];
    const pricing = calculatePricingIntelligence(50, 0, 'g');
    const comp = analyzeCompliance(decls, pricing, 'FOOD');
    const passed = comp.overallStatus === 'INSUFFICIENT_EVIDENCE';
    results.push({
      id: 'QA-13',
      name: 'Insufficient Evidence Determination',
      category: 'Compliance Intelligence',
      passed,
      expected: 'INSUFFICIENT_EVIDENCE',
      actual: comp.overallStatus,
      durationMs: Date.now() - t0,
      details: 'Designates single-side partial scans as INSUFFICIENT_EVIDENCE instead of passing.'
    });
  }

  // TEST 14: Multi-Side Packaging Evidence Aggregation
  {
    const t0 = Date.now();
    const mockBase: InspectionResult = {
      inspectionId: 'INS-MULTI-01',
      timestamp: new Date().toISOString(),
      inspector: { id: 'TEST', name: 'Tester', designation: 'QA', jurisdiction: 'Delhi' },
      product: { name: 'Snack Pack', brand: 'SnackCo', category: 'FOOD', imageUrl: '' },
      declarations: [
        { id: '1', key: 'mrp', name: 'MRP', legalReference: 'Rule 6(1)(e)', status: 'PASS', extractedValue: '₹ 40.00', confidence: 95, explanation: '' },
        { id: '2', key: 'manufacturer_details', name: 'Mfg', legalReference: 'Rule 6(1)(d)', status: 'NOT_DETECTED', extractedValue: 'Not Detected', confidence: 0, explanation: '' }
      ],
      verifiedCount: 1, totalCount: 2, compliancePercentage: 50, overallStatus: 'PARTIALLY_VERIFIED',
      pricing: calculatePricingIntelligence(40, 100, 'g'),
      findings: [], boundingBoxes: [],
      ocrMetadata: { engine: 'Tesseract', processingTimeMs: 100, tokensDetected: 20, averageConfidence: 90 }
    };

    const mockBack: InspectionResult = {
      ...mockBase,
      declarations: [
        { id: '1', key: 'mrp', name: 'MRP', legalReference: 'Rule 6(1)(e)', status: 'NOT_DETECTED', extractedValue: 'Not Detected', confidence: 0, explanation: '' },
        { id: '2', key: 'manufacturer_details', name: 'Mfg', legalReference: 'Rule 6(1)(d)', status: 'PASS', extractedValue: 'SnackCo Pvt Ltd, Noida', confidence: 95, explanation: '' }
      ]
    };

    const aggregated = aggregateMultiSideScans(mockBase, [{ sideTag: 'BACK', imageUrl: '', result: mockBack }]);
    const hasBoth = aggregated.declarations.find(d => d.key === 'mrp')?.status === 'PASS' &&
      aggregated.declarations.find(d => d.key === 'manufacturer_details')?.status === 'PASS';
    const passed = Boolean(hasBoth && aggregated.multiSideCoverage?.totalSidesAnalyzed === 2);
    results.push({
      id: 'QA-14',
      name: 'Multi-Side Packaging Aggregation',
      category: 'Multi-Side Inspection',
      passed,
      expected: 'MRP from Front + Mfg from Back merged (2 sides)',
      actual: `Merged: ${hasBoth ? 'Yes' : 'No'} | Sides: ${aggregated.multiSideCoverage?.totalSidesAnalyzed}`,
      durationMs: Date.now() - t0,
      details: 'Reconciles declarations across multiple sides of the same package.'
    });
  }

  // TEST 15: Image Quality Assessment Thresholds
  {
    const t0 = Date.now();
    // Simulate blank/empty image input
    const q = await assessImageQuality('');
    const passed = !q.isAcceptable && q.issues.length > 0;
    results.push({
      id: 'QA-15',
      name: 'Image Quality Gatekeeper Rejection',
      category: 'Quality Gate',
      passed,
      expected: 'isAcceptable: false on invalid/empty image',
      actual: `isAcceptable: ${q.isAcceptable}`,
      durationMs: Date.now() - t0,
      details: 'Prevents optical OCR on invalid or unreadable image files.'
    });
  }

  // TEST 16: Ingredient Safety & Harmful Additives Analysis
  {
    const t0 = Date.now();
    const raw = 'CRUNCHY NOODLES\nIngredients: Refined Wheat Flour, Palm Oil, Salt, Tartrazine (INS 102), Flavor Enhancer (INS 621), Preservative (INS 320).\nAllergen: Contains Gluten, Soy.';
    const ext = extractEvidenceDeclarations(raw, [], null, 'FOOD');
    const ing = ext.ingredientAnalysis;
    const hasPalmOil = ing?.harmfulIngredients.some(h => h.name.toLowerCase().includes('palm'));
    const hasTartrazine = ing?.harmfulIngredients.some(h => h.name.toLowerCase().includes('tartrazine'));
    const hasBHA = ing?.harmfulIngredients.some(h => h.name.toLowerCase().includes('bha'));
    const hasMSG = ing?.cautionIngredients.some(c => c.name.toLowerCase().includes('msg') || c.name.toLowerCase().includes('glutamate'));
    const passed = Boolean(hasPalmOil && hasTartrazine && hasBHA && hasMSG && (ing?.healthSafetyScore ?? 100) < 50);

    results.push({
      id: 'QA-16',
      name: 'Harmful Food Ingredients & Additives Audit',
      category: 'Ingredient Health Safety',
      passed,
      expected: 'Detected Palm Oil, Tartrazine INS 102, BHA INS 320, MSG INS 621 (Score < 50)',
      actual: `Harmful: ${ing?.harmfulCount} | Score: ${ing?.healthSafetyScore}/100 (${ing?.healthRating})`,
      durationMs: Date.now() - t0,
      details: 'Identifies toxic chemical dyes, saturated palm fat, synthetic preservatives, and allergens.'
    });
  }

  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const successRatePercent = Math.round((passedTests / totalTests) * 100);

  return {
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRatePercent,
    durationTotalMs: Date.now() - startTime,
    results
  };
}
