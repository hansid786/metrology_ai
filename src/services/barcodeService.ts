import { INDIAN_PRODUCT_MASTER_DB, VerifiedProductRecord } from '../data/productMasterDB';

export interface BarcodeMatchResult {
  hasBarcode: boolean;
  rawCode?: string;
  format?: string;
  matchedProduct?: VerifiedProductRecord;
  confidence: number;
}

/**
 * Searches text or barcodes for standard Indian EAN-13 codes starting with 890 (GS1 India prefix).
 */
export function lookupBarcodeInText(ocrText: string): BarcodeMatchResult {
  if (!ocrText) return { hasBarcode: false, confidence: 0 };

  // 1. Look for explicit 13-digit Indian GS1 barcode (starts with 890)
  const ean13Match = ocrText.match(/\b(890\d{10})\b/);
  if (ean13Match && ean13Match[1]) {
    const code = ean13Match[1];
    const matched = INDIAN_PRODUCT_MASTER_DB[code];
    return {
      hasBarcode: true,
      rawCode: code,
      format: 'EAN-13 (GS1 India)',
      matchedProduct: matched,
      confidence: matched ? 99.5 : 85
    };
  }

  // 2. Look for other 12/13 digit numeric sequences
  const generalBarcodeMatch = ocrText.match(/\b(\d{12,13})\b/);
  if (generalBarcodeMatch && generalBarcodeMatch[1]) {
    const code = generalBarcodeMatch[1];
    const matched = INDIAN_PRODUCT_MASTER_DB[code];
    return {
      hasBarcode: true,
      rawCode: code,
      format: code.length === 12 ? 'UPC-A' : 'EAN-13',
      matchedProduct: matched,
      confidence: matched ? 99.0 : 75
    };
  }

  // 3. Fallback: Match by exact product title keyword in master DB
  const lowerText = ocrText.toLowerCase();
  for (const [code, rec] of Object.entries(INDIAN_PRODUCT_MASTER_DB)) {
    const nameKeywords = rec.name.toLowerCase().split(' ').filter(w => w.length > 3);
    const matchesCount = nameKeywords.filter(kw => lowerText.includes(kw)).length;
    if (matchesCount >= 2 && matchesCount / nameKeywords.length > 0.5) {
      return {
        hasBarcode: true,
        rawCode: code,
        format: 'GS1 Master Registry Match',
        matchedProduct: rec,
        confidence: 94
      };
    }
  }

  return { hasBarcode: false, confidence: 0 };
}
