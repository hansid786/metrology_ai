import { extractEvidenceDeclarations } from '../src/services/evidenceExtractor';
import { calculatePricingIntelligence, analyzeCompliance } from '../src/services/complianceEngine';
import { calculate3WayTruthConsensus } from '../src/services/consensusEngine';

console.log('================================================================');
console.log('METROLOGYLENS AI — EVIDENCE-FIRST SCANNER PIPELINE TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} — ${detail || 'Condition not met'}`);
  }
}

// ─── TEST 1: Food Packet (Haldiram / Lay's Potato Chips) ─────────────────────
console.log('\n--- TEST 1: Food Packaging Label (Full Statutory Evidence) ---');
const foodGeminiData = {
  productName: 'Crunchy Potato Chips',
  brandName: "Lay's",
  genericProductName: 'Potato Chips',
  mrp: 20.0,
  netQuantityValue: 50,
  netQuantityUnit: 'g',
  printedUSP: '₹ 0.40 / g',
  mfgDate: '12/2024',
  expiryDate: '06/2025',
  bestBefore: 'Best Before 6 Months from Mfg',
  manufacturer: 'PepsiCo India Holdings Pvt Ltd, Village Channo, Sangrur - 148026',
  countryOfOrigin: 'India',
  customerCare: '1800-22-4020, consumer.feedback@pepsico.com',
  fssaiLicense: '10014064000435',
  rawText: [
    "Lay's Classic Salted Potato Chips",
    'Mfd by: PepsiCo India Holdings Pvt Ltd, Village Channo, Sangrur - 148026',
    'FSSAI Lic. No. 10014064000435',
    'Net Weight: 50 g',
    'MRP Rs. 20.00 (incl. of all taxes)',
    'USP: Rs. 0.40/g',
    'MFD: 12/2024 | EXP: 06/2025',
    'Country of Origin: India',
    'Consumer Helpline: 1800-22-4020'
  ],
  evidence: {
    mrp: 'MRP Rs. 20.00 (incl. of all taxes)',
    netQuantity: 'Net Weight: 50 g',
    mfgDate: 'MFD: 12/2024',
    expiryDate: 'EXP: 06/2025',
    manufacturer: 'PepsiCo India Holdings Pvt Ltd, Village Channo, Sangrur - 148026'
  }
};

const foodResult = extractEvidenceDeclarations(
  foodGeminiData.rawText.join('\n'),
  [],
  foodGeminiData,
  'FOOD',
  'chips_packet.jpg'
);

assert(foodResult.mrpAmount === 20.0, 'MRP correctly extracted as ₹20.00');
assert(foodResult.netQuantityValue === 50 && foodResult.netQuantityUnit === 'g', 'Net Qty correctly extracted as 50 g');
assert(foodResult.manufacturingDates.mfgDate === '12/2024', 'Mfg Date correctly extracted as 12/2024');
assert(foodResult.manufacturingDates.expiryDate === '06/2025', 'Expiry Date correctly extracted as 06/2025');
assert(foodResult.detectedLicenseNumbers.fssai === '10014064000435', 'FSSAI License 14-digit number verified');
assert(foodResult.declarations.find(d => d.key === 'mrp')?.confidence === 95, 'Grounded MRP has HIGH confidence (95%)');

// ─── TEST 2: Anti-Hallucination Guard (Ungrounded Gemini Candidate) ───────────
console.log('\n--- TEST 2: Anti-Hallucination Guard (Ungrounded MRP Rejection) ---');
const hallucinatedGeminiData = {
  productName: 'Unknown Biscuit',
  brandName: 'BrandX',
  mrp: 999.0, // Hallucinated value not present in image text
  netQuantityValue: 100,
  netQuantityUnit: 'g',
  rawText: [
    'BrandX Delicious Glucose Biscuits',
    'Net Weight: 100 g',
    'Ingredients: Wheat Flour, Sugar',
    'Customer Care: 1800-111-222'
  ],
  evidence: {
    netQuantity: 'Net Weight: 100 g'
  }
};

const hallucinationResult = extractEvidenceDeclarations(
  hallucinatedGeminiData.rawText.join('\n'),
  [],
  hallucinatedGeminiData,
  'FOOD',
  'biscuit_no_mrp.jpg'
);

assert(hallucinationResult.mrpAmount === null, 'Ungrounded MRP 999 is correctly REJECTED');
assert(
  hallucinationResult.rejectedCandidates.some(r => r.field === 'MRP' && r.candidateText.includes('999')),
  'Rejected ungrounded MRP is logged in rejectedCandidates trace'
);
assert(hallucinationResult.netQuantityValue === 100, 'Valid Net Qty 100g with evidence is retained');

// ─── TEST 3: False Positive Guard (PIN / Helpline / Barcode Rejection) ────────
console.log('\n--- TEST 3: False Positive Guard (Helpline & PIN numbers not confused with MRP) ---');
const falsePositiveText = `
ABC Food Products Ltd
Okhla Industrial Area, New Delhi - 110020
Toll Free Helpline: 1800 120 9999
Barcode: 8901030383821
Best Before: 12 Months
Net Qty: 200 ml
`;

const falsePositiveResult = extractEvidenceDeclarations(
  falsePositiveText,
  [],
  null, // No Gemini, raw OCR only
  'FOOD',
  'bottle.jpg'
);

assert(falsePositiveResult.mrpAmount === null, 'Helpline 1800, PIN 110020 and Barcode are NOT misidentified as MRP');
assert(falsePositiveResult.netQuantityValue === 200 && falsePositiveResult.netQuantityUnit === 'ml', 'Net Qty 200 ml parsed accurately from raw OCR text');

// ─── TEST 4: Pharma Pack (Dolo 650 with Tablets count & Drug Lic) ────────────
console.log('\n--- TEST 4: Pharma Packaging (Tablets Unit, Batch, Drug License) ---');
const pharmaGeminiData = {
  productName: 'Dolo 650 Paracetamol Tablets IP',
  brandName: 'Dolo 650',
  genericProductName: 'Paracetamol Tablets 650mg',
  mrp: 34.50,
  netQuantityValue: 15,
  netQuantityUnit: 'Tablets',
  mfgDate: '01/2024',
  expiryDate: '12/2026',
  batchNo: 'B-94821',
  drugLicense: 'DL-2021-KA-0042',
  manufacturer: 'Micro Labs Limited, 92 Sipcot, Hosur - 635126',
  rawText: [
    'Dolo 650',
    'Paracetamol Tablets IP 650 mg',
    '15 Tablets',
    'M.R.P. Rs. 34.50 (Inclusive of all taxes)',
    'Batch No. B-94821',
    'MFG. 01/2024  EXP. 12/2026',
    'Mfg. Lic. No.: DL-2021-KA-0042',
    'Mfd in India by: Micro Labs Limited, 92 Sipcot, Hosur - 635126'
  ],
  evidence: {
    mrp: 'M.R.P. Rs. 34.50 (Inclusive of all taxes)',
    netQuantity: '15 Tablets',
    mfgDate: 'MFG. 01/2024',
    expiryDate: 'EXP. 12/2026',
    manufacturer: 'Micro Labs Limited, 92 Sipcot, Hosur - 635126'
  }
};

const pharmaResult = extractEvidenceDeclarations(
  pharmaGeminiData.rawText.join('\n'),
  [],
  pharmaGeminiData,
  'PHARMA',
  'dolo_strip.jpg'
);

assert(pharmaResult.mrpAmount === 34.50, 'Pharma MRP parsed as ₹34.50');
assert(pharmaResult.netQuantityValue === 15 && pharmaResult.netQuantityUnit === 'Tablets', 'Pharma Net Qty parsed as 15 Tablets');
assert(pharmaResult.detectedLicenseNumbers.drugLic === 'DL-2021-KA-0042', 'Drug License verified');
assert(pharmaResult.batchNumber === 'B-94821', 'Batch Number verified');

// ─── TEST 5: Insufficient Evidence / Blurry Image Gate ────────────────────────
console.log('\n--- TEST 5: Insufficient Evidence Gate ---');
const emptyResult = extractEvidenceDeclarations(
  '',
  [],
  null,
  'GENERAL',
  'blurry.jpg'
);

const emptyPricing = calculatePricingIntelligence(0, 0, 'g');
const emptyCompliance = analyzeCompliance(emptyResult.declarations, emptyPricing, 'GENERAL', 'RECTANGULAR', []);

assert(emptyResult.extractedEvidenceCount === 0, 'Zero declarations extracted from empty/blurry image');
assert(emptyResult.mrpAmount === null, 'No hallucinated MRP on empty image');

console.log(`\n================================================================`);
console.log(`TEST SUITE RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log(`================================================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
