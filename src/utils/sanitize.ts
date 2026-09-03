/**
 * MetrologyLens Data Sanitization Utility
 * Cleans noisy OCR artifacts, strips leading/trailing symbols,
 * and ensures clean, professional product names across History & Dockets.
 */

export function sanitizeProductName(rawName?: string | null, fallbackId?: string): string {
  if (!rawName) {
    const idSuffix = fallbackId ? fallbackId.replace(/^SCAN-CITIZEN-|^INS-GOI-/, '') : Math.floor(1000 + Math.random() * 9000);
    return `Scanned Retail Commodity #${idSuffix}`;
  }

  // 1. Remove file extensions and raw camera_scan timestamps
  let clean = rawName
    .replace(/\.[a-zA-Z0-9]{2,5}$/i, '')
    .replace(/^camera_scan_\d+/i, '')
    .replace(/^image_\d+/i, '')
    .replace(/^scan_\d+/i, '')
    .replace(/[-_]/g, ' ')
    .trim();

  // 2. Remove leading/trailing non-alphanumeric noise (e.g., "> i - ", "- ) - 3", "I fs - ")
  clean = clean.replace(/^[>\-\):\(\]\[~₹\|\/\s\.\,]+/, '');
  clean = clean.replace(/[>\-\):\(\]\[~₹\|\/\s\.\,]+$/, '');
  clean = clean.replace(/\s+/g, ' ').trim();

  // 3. Count alphabetic characters
  const lettersOnly = clean.replace(/[^a-zA-Z]/g, '');
  
  // 4. If string is too short, mostly random symbols or garbage noise (e.g. "> i - ₹36", "- ) - 3")
  if (lettersOnly.length < 3 || clean.length < 3 || /^[\d\s₹\.\,\-\/\>]+$/.test(clean)) {
    const idSuffix = fallbackId ? fallbackId.replace(/^SCAN-CITIZEN-|^INS-GOI-/, '') : Math.floor(1000 + Math.random() * 9000);
    return `Scanned Retail Commodity #${idSuffix}`;
  }

  // 5. Capitalize first letter of words for clean display
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
