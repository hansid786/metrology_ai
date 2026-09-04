import { describe, expect, it } from 'vitest';
import { extractEvidenceDeclarations } from './evidenceExtractor';

describe('packaging evidence extraction', () => {
  it('parses common OCR variants for MRP and net quantity', () => {
    const result = extractEvidenceDeclarations(
      'M.R.P. Rs 50/-\nNet Wt 250 g',
      [],
      null,
      'FOOD'
    );

    expect(result.mrpAmount).toBe(50);
    expect(result.netQuantityValue).toBe(250);
    expect(result.netQuantityUnit).toBe('g');
  });

  it('detects electronics from strong product signals even when FOOD is selected', () => {
    const result = extractEvidenceDeclarations(
      'POWER BANK\n20000 mAh\nUSB OUTPUT',
      [],
      null,
      'FOOD',
      'powerbank.jpg'
    );

    expect(result.category).toBe('ELECTRONICS');
  });

  it('does not fabricate declarations that are absent from the image', () => {
    const result = extractEvidenceDeclarations('MRP Rs 50/-', [], null, 'FOOD');
    const origin = result.declarations.find(declaration => declaration.key === 'country_of_origin');
    const customerCare = result.declarations.find(declaration => declaration.key === 'customer_care');

    expect(origin?.status).toBe('NOT_DETECTED');
    expect(customerCare?.status).toBe('NOT_DETECTED');
  });
});