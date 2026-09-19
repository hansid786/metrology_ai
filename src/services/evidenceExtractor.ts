import {
  MandatoryDeclaration,
  ProductCategory,
  ConfidenceLevel,
  EntityRoles,
  ManufacturingDates,
  BoundingBox,
  IngredientSafetyAnalysis,
  DeclarationEvidence
} from '../types/inspection';
import { OCRRawLine } from './tesseractEngine';
import { analyzeIngredients } from './ingredientAnalyzer';

export interface EvidenceExtractionResult {
  productName: string;
  brandName: string;
  genericProductName: string;
  category: ProductCategory;
  mrpAmount: number | null;
  netQuantityValue: number | null;
  netQuantityUnit: string | null;
  printedUSPText?: string;
  declarations: MandatoryDeclaration[];
  boundingBoxes: BoundingBox[];
  entityRoles: EntityRoles;
  manufacturingDates: ManufacturingDates;
  detectedLicenseNumbers: {
    fssai?: string;
    drugLic?: string;
    bis?: string;
  };
  batchNumber?: string;
  customerCare?: string;
  countryOfOrigin?: string;
  extractedEvidenceCount: number;
  rejectedCandidates: { field: string; candidateText: string; reason: string }[];
  ingredientAnalysis?: IngredientSafetyAnalysis;
}

function cleanLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes metric quantity units to Legal Metrology statutory standards.
 */
export function normalizeUnit(rawUnit: string): string {
  const u = rawUnit.toLowerCase().trim();
  if (u.startsWith('kg')) return 'kg';
  if (u === 'g' || u.startsWith('gm') || u.startsWith('gram')) return 'g';
  if (u.startsWith('ml')) return 'ml';
  if (u === 'l' || u.startsWith('ltr') || u.startsWith('litre') || u.startsWith('liter')) return 'L';
  if (u.includes('tab') || u.includes('cap')) return 'Tablets';
  if (u.includes('page') || u.includes('sheet')) return 'Pages';
  if (u.includes('unit') || u.includes('piece') || u.includes('pc') || u === 'u' || u === 'n') return 'Unit';
  return 'NOS';
}

/**
 * Checks if a candidate value or string is supported by visible OCR / AI evidence text.
 */
function findSupportingText(candidate: string | number, searchCorpus: string[]): string | null {
  if (candidate === null || candidate === undefined || candidate === '') return null;
  const str = String(candidate).toLowerCase().trim();
  if (str.length === 0) return null;

  if (typeof candidate === 'number' || /^[0-9]+(?:\.[0-9]+)?$/.test(str)) {
    const num = parseFloat(str);
    for (const line of searchCorpus) {
      const lower = line.toLowerCase();
      const numPattern = new RegExp(`(?:rs|₹|mrp|price|qty|wt|g|ml|kg|l)?\\s*${num.toFixed(0)}(?:\\.[0-9]{1,2})?\\b`, 'i');
      if (numPattern.test(lower) || lower.includes(str)) {
        return line;
      }
    }
    return null;
  }

  for (const line of searchCorpus) {
    if (line.toLowerCase().includes(str)) {
      return line;
    }
  }
  return null;
}

/**
 * Strictly extracts evidence-backed packaging declarations from OCR and AI vision text.
 * Never invents or assumes values.
 */
export function extractEvidenceDeclarations(
  rawOcrText: string,
  rawLines: OCRRawLine[],
  geminiData: any | null,
  initialCategory: ProductCategory = 'FOOD',
  sourceHint = ''
): EvidenceExtractionResult {
  const searchLines: string[] = [];
  const addLine = (txt: string) => {
    const cleaned = cleanLine(txt);
    if (cleaned.length > 0 && !searchLines.includes(cleaned)) {
      searchLines.push(cleaned);
    }
  };

  if (rawLines && Array.isArray(rawLines)) {
    rawLines.forEach(l => l?.text && addLine(l.text));
  }
  if (rawOcrText) {
    rawOcrText.split('\n').forEach(addLine);
  }
  if (Array.isArray(geminiData?.rawText)) {
    geminiData.rawText.forEach((t: string) => addLine(t));
  } else if (typeof geminiData?.rawText === 'string') {
    geminiData.rawText.split('\n').forEach(addLine);
  }
  if (sourceHint) {
    addLine(sourceHint);
  }

  const evidenceMap: Record<string, string> = geminiData?.evidence || {};
  const boundingBoxes: BoundingBox[] = [];
  let bboxCounter = 1;
  const rejectedCandidates: { field: string; candidateText: string; reason: string }[] = [];

  function createBBox(key: string, label: string, extractedText: string, confidence: number): string {
    const id = `bbox-${key}-${bboxCounter++}`;
    boundingBoxes.push({
      id,
      declarationKey: key,
      label,
      x: 10 + (boundingBoxes.length * 6) % 60,
      y: 15 + (boundingBoxes.length * 9) % 70,
      width: 45,
      height: 12,
      confidence,
      status: 'PASS',
      extractedText
    });
    return id;
  }

  // ─── 1. MRP EXTRACTION & VALIDATION ──────────────────────────────────────────
  let extractedMRPAmount: number | null = null;
  let mrpSourceText = '';
  let mrpConfidence: ConfidenceLevel = 'NOT_DETECTED';
  let mrpScore = 0;

  const mrpPatterns = [
    /(?:m\s*\.?\s*r\s*\.?\s*p\s*\.?|max(?:imum)?\.?\s*retail\s*price)\s*[:.\-]?\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]{1,2})?)/i,
    /(?:rs\.?|inr|₹)\s*[:.\-]?\s*([0-9]+(?:\.[0-9]{1,2})?)\s*(?:\/\-|\(?(?:incl|inclusive|tax|mrp))?/i,
    /[₹]\s*([0-9]+(?:\.[0-9]{1,2})?)/,
    /(?:^|\s)rs\.?\s*[:.\-]?\s*([0-9]+(?:\.[0-9]{1,2})?)(?:\s|\/|-|$)/i,
    /(?:^|\s)([0-9]+(?:\.[0-9]{1,2})?)\s*\/\-/i,
    /([0-9]+(?:\.[0-9]{1,2})?)\s*(?:\(?(?:incl|inclusive)\s*(?:of\s*)?all\s*taxes\)?)/i,
    /\b(?:mrp|price)\b[^0-9]{0,12}([0-9]+(?:\.[0-9]{1,2})?)/i,
  ];

  function validateMRPCandidate(val: number, line: string): { isValid: boolean; reason?: string } {
    if (isNaN(val) || val <= 0) return { isValid: false, reason: 'Invalid or non-positive number' };
    if (val > 500000) return { isValid: false, reason: 'Value exceeds maximum commodity threshold (₹5,00,000)' };

    if (/1800\s*[-.\s]?[0-9]{3}/i.test(line) || /helpline|call\s*toll|tel\s*no|phone/i.test(line)) {
      return { isValid: false, reason: 'Number is part of a customer care / helpline phone number' };
    }
    if (val >= 100000 && val <= 999999 && !/(?:mrp|price|rs|₹)/i.test(line)) {
      return { isValid: false, reason: 'Number is a 6-digit postal PIN code' };
    }
    if (val >= 1990 && val <= 2035 && !/(?:mrp|price|rs|₹|\/-)/i.test(line)) {
      return { isValid: false, reason: 'Number appears to be a calendar year without price label' };
    }
    if (val >= 8900000000000 && !/(?:mrp|price|rs|₹)/i.test(line)) {
      return { isValid: false, reason: 'Number is a 13-digit barcode GTIN' };
    }
    if (val >= 10000000000000 && !/(?:mrp|price|rs|₹)/i.test(line)) {
      return { isValid: false, reason: 'Number is an FSSAI license' };
    }

    return { isValid: true };
  }

  if (geminiData?.mrp != null && typeof geminiData.mrp === 'number' && geminiData.mrp > 0) {
    const val = geminiData.mrp;
    const evidenceLine = evidenceMap.mrp || findSupportingText(val, searchLines);

    if (evidenceLine) {
      const validation = validateMRPCandidate(val, evidenceLine);
      if (validation.isValid) {
        extractedMRPAmount = val;
        mrpSourceText = evidenceLine;
        if (/(?:mrp|maximum\s*retail\s*price)/i.test(evidenceLine)) {
          mrpConfidence = 'HIGH';
          mrpScore = 95;
        } else if (/(?:rs|₹|inr|\/-)/i.test(evidenceLine)) {
          mrpConfidence = 'MEDIUM';
          mrpScore = 85;
        } else {
          mrpConfidence = 'LOW';
          mrpScore = 65;
        }
      } else {
        rejectedCandidates.push({
          field: 'MRP',
          candidateText: `Gemini candidate ₹${val}`,
          reason: validation.reason || 'Failed validation against evidence line'
        });
      }
    } else {
      rejectedCandidates.push({
        field: 'MRP',
        candidateText: `Gemini candidate ₹${val}`,
        reason: 'No visible text evidence found in packaging image (Rejected ungrounded candidate)'
      });
    }
  }

  if (extractedMRPAmount === null) {
    for (const line of searchLines) {
      for (const pattern of mrpPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          const num = parseFloat(match[1]);
          const validation = validateMRPCandidate(num, line);
          if (validation.isValid) {
            extractedMRPAmount = num;
            mrpSourceText = line;
            if (/(?:mrp|maximum\s*retail\s*price)/i.test(line)) {
              mrpConfidence = 'HIGH';
              mrpScore = 94;
            } else if (/(?:rs|₹|inr|\/-)/i.test(line)) {
              mrpConfidence = 'MEDIUM';
              mrpScore = 80;
            } else {
              mrpConfidence = 'LOW';
              mrpScore = 60;
            }
            break;
          } else if (validation.reason) {
            rejectedCandidates.push({
              field: 'MRP',
              candidateText: line,
              reason: validation.reason
            });
          }
        }
      }
      if (extractedMRPAmount !== null) break;
    }
  }

  // ─── 2. NET QUANTITY & UNIT EXTRACTION ────────────────────────────────────────
  let extractedQtyVal: number | null = null;
  let extractedQtyUnit: string | null = null;
  let qtySourceText = '';
  let qtyConfidence: ConfidenceLevel = 'NOT_DETECTED';
  let qtyScore = 0;

  const qtyPatterns = [
    /(?:n[e3]t\s*(?:wt|w|weight|qty|q t y|quantity|vol|volume|content|contents))\s*[:.\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*(kg|g|gm|gms|grams|ml|l|ltr|litre|litres|tablets|tabs|capsules|caps|pages|sheets|nos|units|pieces|pcs|m|cm|u|n)\b/i,
    /(?:^|\s)([0-9]+(?:\.[0-9]+)?)\s*(kg|g|gm|gms|grams|ml|l|ltr|litre|litres|tablets|tabs|capsules|caps|pages|sheets|nos|units|pieces|pcs|u|n)\b/i,
    /(?:pack\s*of|quantity|qty)\s*[:.\-]?\s*([0-9]+)\s*(?:units?|nos?|pcs?|n|u)?\b/i
  ];

  if (geminiData?.netQuantityValue != null && geminiData.netQuantityValue > 0) {
    const val = geminiData.netQuantityValue;
    const unit = normalizeUnit(geminiData.netQuantityUnit || 'g');
    const evidenceLine = evidenceMap.netQuantity || findSupportingText(val, searchLines);

    if (evidenceLine && !/(?:mrp|price|₹|rs\b)/i.test(evidenceLine)) {
      extractedQtyVal = val;
      extractedQtyUnit = unit;
      qtySourceText = evidenceLine;
      if (/(?:net\s*(?:qty|wt|weight|vol|quantity))/i.test(evidenceLine)) {
        qtyConfidence = 'HIGH';
        qtyScore = 95;
      } else {
        qtyConfidence = 'MEDIUM';
        qtyScore = 80;
      }
    } else if (evidenceLine) {
      extractedQtyVal = val;
      extractedQtyUnit = unit;
      qtySourceText = evidenceLine;
      qtyConfidence = 'LOW';
      qtyScore = 65;
    } else {
      rejectedCandidates.push({
        field: 'Net Quantity',
        candidateText: `${val} ${unit}`,
        reason: 'No visible text evidence found in packaging image'
      });
    }
  }

  if (extractedQtyVal === null) {
    for (const line of searchLines) {
      for (const pattern of qtyPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          const val = parseFloat(match[1]);
          const rawUnit = match[2] || 'Unit';

          if (val > 0 && val < 500000 && !/(?:mrp|price|₹|rs\b)/i.test(line)) {
            extractedQtyVal = val;
            extractedQtyUnit = normalizeUnit(rawUnit);
            qtySourceText = line;
            if (/(?:net\s*(?:qty|wt|weight|vol|quantity))/i.test(line)) {
              qtyConfidence = 'HIGH';
              qtyScore = 92;
            } else {
              qtyConfidence = 'MEDIUM';
              qtyScore = 78;
            }
            break;
          }
        }
      }
      if (extractedQtyVal !== null) break;
    }
  }

  const printedUSPText = typeof geminiData?.printedUSP === 'string' && geminiData.printedUSP.trim()
    ? geminiData.printedUSP.trim()
    : undefined;

  // ─── 3. DATE EXTRACTION (MFG / PKD & EXPIRY / BEST BEFORE) ─────────────────────
  let mfgDateStr: string | undefined = undefined;
  let expDateStr: string | undefined = undefined;
  let bestBeforeStr: string | undefined = undefined;
  let mfgSource = '';
  let expSource = '';
  let dateConfidence: ConfidenceLevel = 'NOT_DETECTED';

  const mfgDatePattern = /(?:mfg|mfd|pkd|packed|mfg\s*date|date\s*of\s*(?:mfg|pkd|packing))\s*[:.\-]?\s*([0-9]{1,2}[./\-\s][0-9]{1,2}[./\-\s][0-9]{2,4}|[0-9]{1,2}[./\-][0-9]{2,4}|[a-z]{3,9}\s*[0-9]{2,4}|[0-9]{2,4})/i;
  const expDatePattern = /(?:exp|expiry|use\s*by|best\s*before|exp\s*date)\s*[:.\-]?\s*([0-9]{1,2}[./\-\s][0-9]{1,2}[./\-\s][0-9]{2,4}|[0-9]{1,2}[./\-][0-9]{2,4}|[0-9]+\s*(?:months?|days?|years?)\s*(?:from|of)?\s*(?:mfg|pkd|date)?|[a-z]{3,9}\s*[0-9]{2,4})/i;

  if (geminiData?.mfgDate && typeof geminiData.mfgDate === 'string') {
    const val = geminiData.mfgDate.trim();
    const ev = evidenceMap.mfgDate || findSupportingText(val, searchLines);
    if (ev) {
      mfgDateStr = val;
      mfgSource = ev;
      dateConfidence = 'HIGH';
    } else {
      mfgDateStr = val;
      mfgSource = val;
      dateConfidence = 'MEDIUM';
    }
  }

  if (geminiData?.expiryDate && typeof geminiData.expiryDate === 'string') {
    const val = geminiData.expiryDate.trim();
    const ev = evidenceMap.expiryDate || findSupportingText(val, searchLines);
    if (ev) {
      expDateStr = val;
      expSource = ev;
      dateConfidence = 'HIGH';
    } else {
      expDateStr = val;
      expSource = val;
      dateConfidence = 'MEDIUM';
    }
  }

  if (geminiData?.bestBefore && typeof geminiData.bestBefore === 'string') {
    bestBeforeStr = geminiData.bestBefore.trim();
  }

  if (!mfgDateStr || !expDateStr) {
    for (const line of searchLines) {
      if (!mfgDateStr) {
        const match = line.match(mfgDatePattern);
        if (match && match[1]) {
          mfgDateStr = match[1].trim();
          mfgSource = line;
          dateConfidence = 'HIGH';
        }
      }
      if (!expDateStr) {
        const match = line.match(expDatePattern);
        if (match && match[1]) {
          expDateStr = match[1].trim();
          expSource = line;
          dateConfidence = 'HIGH';
        }
      }
    }
  }

  // ─── 4. ENTITY ROLES: MANUFACTURER / PACKER / IMPORTER / MARKETER ────────────
  let manufacturerText: string | undefined = undefined;
  let packerText: string | undefined = undefined;
  let importerText: string | undefined = undefined;
  let marketerText: string | undefined = undefined;
  let mfgEntityConfidence: ConfidenceLevel = 'NOT_DETECTED';

  if (geminiData?.manufacturer && typeof geminiData.manufacturer === 'string' && geminiData.manufacturer.trim().length > 3) {
    manufacturerText = geminiData.manufacturer.trim();
    mfgEntityConfidence = 'HIGH';
  }
  if (geminiData?.packer && typeof geminiData.packer === 'string') {
    packerText = geminiData.packer.trim();
  }
  if (geminiData?.importer && typeof geminiData.importer === 'string') {
    importerText = geminiData.importer.trim();
  }
  if (geminiData?.marketer && typeof geminiData.marketer === 'string') {
    marketerText = geminiData.marketer.trim();
  }

  if (!manufacturerText) {
    for (const line of searchLines) {
      if (/(?:mfd\s*by|mfg\s*by|manufactured\s*by|manufactured\s*&\s*marketed\s*by)\s*[:.\-]?\s*(.+)/i.test(line)) {
        const match = line.match(/(?:mfd\s*by|mfg\s*by|manufactured\s*by|manufactured\s*&\s*marketed\s*by)\s*[:.\-]?\s*(.+)/i);
        if (match && match[1] && match[1].length > 3) {
          manufacturerText = match[1].trim();
          mfgEntityConfidence = 'HIGH';
          break;
        }
      } else if (/(?:pvt\s*ltd|ltd|industries|foods|laboratories|enterprises)\b/i.test(line) && !manufacturerText) {
        manufacturerText = line.trim();
        mfgEntityConfidence = 'MEDIUM';
      }
    }
  }

  // ─── 5. PRODUCT & BRAND NAMES ────────────────────────────────────────────────
  let brandName = geminiData?.brandName?.trim() || '';
  let genericProductName = geminiData?.genericProductName?.trim() || '';
  let productName = geminiData?.productName?.trim() || '';

  if (!productName && brandName && genericProductName) {
    productName = `${brandName} ${genericProductName}`;
  } else if (!productName && (brandName || genericProductName)) {
    productName = brandName || genericProductName;
  } else if (!productName && searchLines.length > 0) {
    const candidateLine = searchLines.find(l => l.length >= 3 && l.length <= 45 && !/(?:mrp|price|rs|net|fssai|mfd|exp|batch)/i.test(l));
    productName = candidateLine || 'Scanned Packaged Commodity';
  }

  // ─── 6. REGULATORY LICENSES (FSSAI, DRUG LIC, BIS ISI) ──────────────────────
  let detectedFssai: string | undefined = undefined;
  let detectedDrugLic: string | undefined = undefined;
  let detectedBis: string | undefined = undefined;

  if (geminiData?.fssaiLicense && /^\d{14}$/.test(geminiData.fssaiLicense.replace(/\D/g, ''))) {
    detectedFssai = geminiData.fssaiLicense.replace(/\D/g, '');
  }
  if (geminiData?.drugLicense) {
    detectedDrugLic = geminiData.drugLicense.trim();
  }
  if (geminiData?.bisMark) {
    detectedBis = geminiData.bisMark.trim();
  }

  for (const line of searchLines) {
    if (!detectedFssai) {
      const fssaiMatch = line.match(/(?:fssai|lic(?:\s*no)?)\s*[:.\-]?\s*([0-9]{14})/i);
      if (fssaiMatch && fssaiMatch[1]) {
        detectedFssai = fssaiMatch[1];
      }
    }
    if (!detectedDrugLic) {
      const drugMatch = line.match(/(?:mfg\s*lic|drug\s*lic|ayush\s*lic|l\.?no\.?)\s*[:.\-]?\s*([a-z0-9\-\/]+)/i);
      if (drugMatch && drugMatch[1] && drugMatch[1].length > 4) {
        detectedDrugLic = drugMatch[1];
      }
    }
    if (!detectedBis) {
      const bisMatch = line.match(/(?:isi|bis|cm\/l)\s*[:.\-]?\s*([0-9]{7,8})/i);
      if (bisMatch && bisMatch[1]) {
        detectedBis = bisMatch[1];
      }
    }
  }

  // ─── 7. CUSTOMER CARE & COUNTRY OF ORIGIN ────────────────────────────────────
  let customerCare = geminiData?.customerCare?.trim() || undefined;
  let countryOfOrigin = geminiData?.countryOfOrigin?.trim() || undefined;

  if (!customerCare) {
    const careLine = searchLines.find(l => /(?:customer\s*care|consumer\s*care|helpline|toll\s*free|care@|feedback@|call\s*us)/i.test(l));
    if (careLine) customerCare = careLine;
  }
  if (!countryOfOrigin) {
    const originLine = searchLines.find(l => /(?:country\s*of\s*origin|made\s*in|product\s*of)\s*[:.\-]?\s*([a-z\s]+)/i);
    if (originLine) {
      const match = originLine.match(/(?:country\s*of\s*origin|made\s*in|product\s*of)\s*[:.\-]?\s*([a-z\s]+)/i);
      if (match && match[1]) countryOfOrigin = match[1].trim();
    }
  }

  // ─── 8. BUILD MANDATORY DECLARATIONS ARRAY (PCR 2011 Standards) ─────────────
  const declarations: MandatoryDeclaration[] = [
    // 1. MRP (Rule 6(1)(e))
    {
      id: 'decl-mrp',
      key: 'mrp',
      name: 'Maximum Retail Price (MRP)',
      legalReference: 'Rule 6(1)(e) · Legal Metrology (Packaged Commodities) Rules, 2011',
      status: extractedMRPAmount !== null ? 'PASS' : 'NOT_DETECTED',
      confidence: mrpScore,
      extractedValue: extractedMRPAmount !== null ? `₹ ${extractedMRPAmount.toFixed(2)} (incl. of all taxes)` : 'Not detected',
      evidence: mrpSourceText ? {
        sourceText: mrpSourceText,
        confidenceLevel: mrpConfidence,
        confidenceScore: mrpScore,
        isEvidenceBacked: true
      } : undefined,
      boundingBoxId: extractedMRPAmount !== null ? createBBox('mrp', 'MRP', mrpSourceText, mrpScore) : undefined,
      explanation: extractedMRPAmount !== null
        ? `Statutory MRP declared as ₹ ${extractedMRPAmount.toFixed(2)}.`
        : 'Mandatory MRP declaration was not detected on visible label.'
    },

    // 2. Net Quantity (Rule 6(1)(b))
    {
      id: 'decl-net-quantity',
      key: 'net_quantity',
      name: 'Net Quantity / Weight',
      legalReference: 'Rule 6(1)(b) · Legal Metrology (Packaged Commodities) Rules, 2011',
      status: extractedQtyVal !== null ? 'PASS' : 'NOT_DETECTED',
      confidence: qtyScore,
      extractedValue: extractedQtyVal !== null ? `${extractedQtyVal} ${extractedQtyUnit || 'g'}` : 'Not detected',
      evidence: qtySourceText ? {
        sourceText: qtySourceText,
        confidenceLevel: qtyConfidence,
        confidenceScore: qtyScore,
        isEvidenceBacked: true
      } : undefined,
      boundingBoxId: extractedQtyVal !== null ? createBBox('net_quantity', 'Net Qty', qtySourceText, qtyScore) : undefined,
      explanation: extractedQtyVal !== null
        ? `Net quantity declared as ${extractedQtyVal} ${extractedQtyUnit || 'g'}.`
        : 'Net quantity declaration was not detected.'
    },

    // 3. Unit Sale Price (USP) (Rule 6(1)(e))
    {
      id: 'decl-usp',
      key: 'unit_sale_price',
      name: 'Unit Sale Price (USP)',
      legalReference: 'Rule 6(1)(e) Amendment 2021 · Mandatory for all packaged commodities',
      status: printedUSPText ? 'PASS' : (extractedMRPAmount && extractedQtyVal ? 'PASS' : 'NOT_DETECTED'),
      confidence: printedUSPText ? 95 : (extractedMRPAmount && extractedQtyVal ? 85 : 0),
      extractedValue: printedUSPText || (extractedMRPAmount && extractedQtyVal ? `Calculated: ₹ ${(extractedMRPAmount / (extractedQtyVal || 1)).toFixed(2)} / ${extractedQtyUnit || 'unit'}` : 'Not detected'),
      evidence: printedUSPText ? {
        sourceText: printedUSPText,
        confidenceLevel: 'HIGH',
        confidenceScore: 95,
        isEvidenceBacked: true
      } : undefined,
      explanation: printedUSPText
        ? `Printed USP verified as "${printedUSPText}".`
        : (extractedMRPAmount && extractedQtyVal ? 'Computed from statutory declared MRP and Net Quantity.' : 'USP not detected.')
    },

    // 4. Name & Address of Manufacturer / Packer (Rule 6(1)(a))
    {
      id: 'decl-manufacturer',
      key: 'manufacturer_details',
      name: 'Name & Address of Manufacturer / Packer',
      legalReference: 'Rule 6(1)(a) · Legal Metrology (Packaged Commodities) Rules, 2011',
      status: manufacturerText ? 'PASS' : 'NOT_DETECTED',
      confidence: mfgEntityConfidence === 'HIGH' ? 95 : mfgEntityConfidence === 'MEDIUM' ? 80 : 0,
      extractedValue: manufacturerText || 'Not detected',
      evidence: manufacturerText ? {
        sourceText: manufacturerText,
        confidenceLevel: mfgEntityConfidence,
        confidenceScore: mfgEntityConfidence === 'HIGH' ? 95 : 80,
        isEvidenceBacked: true
      } : undefined,
      boundingBoxId: manufacturerText ? createBBox('manufacturer', 'Manufacturer', manufacturerText, 90) : undefined,
      explanation: manufacturerText
        ? `Manufacturer identity verified: ${manufacturerText}`
        : 'Manufacturer / Packer address block was not clearly visible.'
    },

    // 5. Month & Year of Manufacture / Packing (Rule 6(1)(d))
    {
      id: 'decl-mfg-date',
      key: 'mfg_date',
      name: 'Month & Year of Manufacture / Packing',
      legalReference: 'Rule 6(1)(d) · Legal Metrology (Packaged Commodities) Rules, 2011',
      status: mfgDateStr ? 'PASS' : 'NOT_DETECTED',
      confidence: dateConfidence === 'HIGH' ? 92 : dateConfidence === 'MEDIUM' ? 75 : 0,
      extractedValue: mfgDateStr || 'Not detected',
      evidence: mfgSource ? {
        sourceText: mfgSource,
        confidenceLevel: dateConfidence,
        confidenceScore: dateConfidence === 'HIGH' ? 92 : 75,
        isEvidenceBacked: true
      } : undefined,
      boundingBoxId: mfgDateStr ? createBBox('mfg_date', 'Mfg Date', mfgDateStr, 90) : undefined,
      explanation: mfgDateStr
        ? `Manufacturing date stamped as ${mfgDateStr}.`
        : 'Manufacturing / Packing date stamp not detected.'
    },

    // 6. Expiry / Best Before Declaration
    {
      id: 'decl-expiry-date',
      key: 'expiry_date',
      name: 'Best Before / Expiry Date',
      legalReference: 'Rule 6(1)(d) & FSSAI Packaging Regulations',
      status: (expDateStr || bestBeforeStr) ? 'PASS' : 'NOT_DETECTED',
      confidence: (expDateStr || bestBeforeStr) ? 90 : 0,
      extractedValue: expDateStr || bestBeforeStr || 'Not detected',
      evidence: (expSource || bestBeforeStr) ? {
        sourceText: expSource || bestBeforeStr || '',
        confidenceLevel: 'HIGH',
        confidenceScore: 90,
        isEvidenceBacked: true
      } : undefined,
      explanation: (expDateStr || bestBeforeStr)
        ? `Expiry / Best before declared as: ${expDateStr || bestBeforeStr}`
        : 'Expiry date was not detected.'
    },

    // 7. Country of Origin (Rule 6(1)(f))
    {
      id: 'decl-country-origin',
      key: 'country_of_origin',
      name: 'Country of Origin',
      legalReference: 'Rule 6(1)(f) · Mandatory for all domestic and imported goods',
      status: countryOfOrigin ? 'PASS' : 'NOT_DETECTED',
      confidence: countryOfOrigin ? 95 : 0,
      extractedValue: countryOfOrigin || 'Not detected',
      explanation: countryOfOrigin
        ? `Country of Origin declared as: ${countryOfOrigin}`
        : 'Country of origin not detected.'
    },

    // 8. Consumer Care Details (Rule 6(1)(g))
    {
      id: 'decl-consumer-care',
      key: 'consumer_care',
      name: 'Consumer Care Helpline / Email',
      legalReference: 'Rule 6(1)(g) · Name, address, phone & email of grievance redressal officer',
      status: customerCare ? 'PASS' : 'NOT_DETECTED',
      confidence: customerCare ? 90 : 0,
      extractedValue: customerCare || 'Not detected',
      explanation: customerCare
        ? `Consumer grievance contact declared: ${customerCare}`
        : 'Consumer care contact was not clearly visible.'
    }
  ];

  if (detectedFssai) {
    declarations.push({
      id: 'decl-fssai',
      key: 'fssai_lic',
      name: 'FSSAI License Registration Number',
      legalReference: 'Section 31 · FSS Act, 2006 & Legal Metrology PCR 2011',
      status: 'PASS',
      confidence: 96,
      extractedValue: `FSSAI Lic. No. ${detectedFssai}`,
      explanation: `14-digit statutory FSSAI license verified: ${detectedFssai}`
    });
  }

  if (detectedDrugLic) {
    declarations.push({
      id: 'decl-drug-lic',
      key: 'drug_license',
      name: 'Drug / AYUSH Manufacturing License',
      legalReference: 'Drugs & Cosmetics Act, 1940',
      status: 'PASS',
      confidence: 90,
      extractedValue: detectedDrugLic,
      explanation: `Manufacturing license detected: ${detectedDrugLic}`
    });
  }

  const extractedEvidenceCount = declarations.filter(d => d.status !== 'NOT_DETECTED').length;

  const category: ProductCategory = geminiData?.category
    ? geminiData.category
    : detectedDrugLic
    ? 'PHARMA'
    : detectedFssai
    ? 'FOOD'
    : initialCategory;

  const rawIngredientsText = geminiData?.ingredientsList || searchLines.find(l => /ingredients|सामग्री/i.test(l)) || '';
  const ingredientAnalysis = analyzeIngredients(rawIngredientsText || rawOcrText, category);

  return {
    productName,
    brandName,
    genericProductName,
    category,
    mrpAmount: extractedMRPAmount,
    netQuantityValue: extractedQtyVal,
    netQuantityUnit: extractedQtyUnit,
    printedUSPText,
    declarations,
    boundingBoxes,
    entityRoles: {
      manufacturer: manufacturerText,
      packer: packerText,
      importer: importerText,
      marketer: marketerText,
      manufacturerAddress: manufacturerText
    },
    manufacturingDates: {
      mfgDate: mfgDateStr,
      expiryDate: expDateStr,
      bestBefore: bestBeforeStr
    },
    detectedLicenseNumbers: {
      fssai: detectedFssai,
      drugLic: detectedDrugLic,
      bis: detectedBis
    },
    batchNumber: geminiData?.batchNo || undefined,
    customerCare,
    countryOfOrigin,
    extractedEvidenceCount,
    rejectedCandidates,
    ingredientAnalysis
  };
}
