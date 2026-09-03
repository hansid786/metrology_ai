import jsPDF from 'jspdf';
import { SavedInspection } from '../types/inspection';

export interface EDAAKHILPetitionPayload {
  complainantName: string;
  complainantPhone: string;
  complainantAddress: string;
  oppositePartyName: string;
  oppositePartyAddress: string;
  productName: string;
  printedMRP: number;
  chargedPrice: number;
  overchargeAmount: number;
  claimedCompensation: number;
  inspection: SavedInspection;
}

export function generateEDaakhilPetitionText(p: EDAAKHILPetitionPayload): string {
  const overchargeDiff = Math.max(0, p.chargedPrice - p.printedMRP);
  const totalClaim = overchargeDiff + (p.claimedCompensation || 5000);

  return `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
AT: ${p.oppositePartyAddress.split(',').pop()?.trim() || 'NEW DELHI'}

CONSUMER COMPLAINT NO. ________ / 2026

IN THE MATTER OF:
${p.complainantName.toUpperCase()}
R/o: ${p.complainantAddress}
Contact: ${p.complainantPhone}
... COMPLAINANT

VERSUS

1. ${p.oppositePartyName.toUpperCase()}
Address: ${p.oppositePartyAddress}
... OPPOSITE PARTY NO. 1

2. ${p.inspection.metadata.manufacturer?.toUpperCase() || 'MANUFACTURER / PACKER'}
... OPPOSITE PARTY NO. 2

--------------------------------------------------------------------------------
COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019
READ WITH SECTION 36(1) OF THE LEGAL METROLOGY ACT, 2009
--------------------------------------------------------------------------------

MOST RESPECTFULLY SHOWETH:
1. That the Complainant is a consumer within the meaning of Section 2(7) of the Consumer Protection Act, 2019.
2. That on ${new Date(p.inspection.savedAt).toLocaleDateString('en-IN')}, the Complainant purchased "${p.productName}" from Opposite Party No. 1.
3. That the Maximum Retail Price (MRP) printed on the packaging commodity is ₹ ${p.printedMRP.toFixed(2)} (inclusive of all taxes).
4. That Opposite Party No. 1 unlawfully charged ₹ ${p.chargedPrice.toFixed(2)}, resulting in an illegal overcharge of ₹ ${overchargeDiff.toFixed(2)} (${p.inspection.result.pricing.differencePercentage}% excess).
5. That this constitutes Unfair Trade Practice under Section 2(47) of the Consumer Protection Act, 2019 and a direct violation of Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011 punishable under Section 36(1) of the Legal Metrology Act, 2009.

PRAYER:
It is therefore respectfully prayed that this Hon'ble Commission may be pleased to:
a) Direct Opposite Party No. 1 to refund the excess charged amount of ₹ ${overchargeDiff.toFixed(2)}.
b) Award compensation of ₹ ${p.claimedCompensation || 5000} for mental agony, harassment, and litigation costs.
c) Impose punitive damages under Section 39 of the Consumer Protection Act, 2019.

VERIFICATION:
Verified at ${p.oppositePartyAddress.split(',').pop()?.trim() || 'New Delhi'} on this ${new Date().toLocaleDateString('en-IN')} that the contents are true to my knowledge.

(COMPLAINANT)
`;
}

export function downloadEDaakhilPetitionPDF(p: EDAAKHILPetitionPayload): void {
  const doc = new jsPDF();
  const text = generateEDaakhilPetitionText(p);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 30, 60);
  doc.text('E-DAAKHIL STATUTORY CONSUMER COURT PETITION', 105, 16, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Under Section 35 Consumer Protection Act, 2019 & Rule 6(1)(e) Legal Metrology Rules', 105, 22, { align: 'center' });

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 25, 196, 25);

  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.setFont('courier', 'normal');

  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 14, 32);

  doc.save(`eDaakhil_Petition_${p.inspection.id}.pdf`);
}
