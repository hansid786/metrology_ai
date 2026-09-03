import jsPDF from 'jspdf';
import { SavedInspection } from '../types/inspection';

export interface SeizureMemoPayload {
  memoNumber: string;
  inspection: SavedInspection;
  officerName: string;
  officerBadge: string;
  seizureLocation: string;
  seizedLotQuantity: number;
  compoundingFineEstimate: number;
  witness1Name: string;
  witness2Name: string;
}

export function generateSeizureMemoPDF(p: SeizureMemoPayload): void {
  const doc = new jsPDF();
  const insp = p.inspection;
  const pricing = insp.result.pricing;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GOVERNMENT OF INDIA • LEGAL METROLOGY ENFORCEMENT', 105, 11, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('FORM PC-1 / PC-2: DRAFT SEIZURE MEMO & INSPECTION RECORD', 105, 18, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(253, 224, 71); // Yellow 300
  doc.setFont('helvetica', 'bold');
  doc.text('[ DRAFT — SUBJECT TO OFFICER REVIEW & VERIFICATION ]', 105, 25, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.text('Under Section 15 & Section 36(1) of the Legal Metrology Act, 2009', 105, 31, { align: 'center' });

  // Docket Meta
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`SEIZURE MEMO NO: ${p.memoNumber}`, 14, 42);
  doc.text(`DATE & TIME: ${new Date(insp.savedAt).toLocaleString('en-IN')}`, 130, 42);

  doc.setDrawColor(203, 213, 225);
  doc.line(14, 46, 196, 46);

  // Section 1: Establishment & Officer Details
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138); // Blue 900
  doc.text('1. INSPECTING AUTHORITY & PREMISES DETAILS', 14, 51);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Inspecting Officer: ${p.officerName} (${p.officerBadge})`, 14, 58);
  doc.text(`Establishment Name: ${insp.metadata.establishmentName || 'Retail Mart'}`, 14, 64);
  doc.text(`Premises / Seizure Location: ${p.seizureLocation || insp.metadata.establishmentAddress || 'Market Area'}`, 14, 70);

  // Section 2: Commodity & Contravention Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text('2. SEIZED COMMODITY & STATUTORY CONTRAVENTIONS', 14, 80);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Commodity Name: ${insp.metadata.productName}`, 14, 87);
  doc.text(`Manufacturer: ${insp.metadata.manufacturer || 'Apex Foods Pvt Ltd'}`, 14, 93);
  doc.text(`Printed MRP: ₹ ${pricing.mrpAmount.toFixed(2)} | Net Quantity: ${pricing.netQuantityValue} ${pricing.netQuantityUnit}`, 14, 99);
  doc.text(`Seized Lot Quantity: ${p.seizedLotQuantity} Units / Packages`, 14, 105);

  const findingsText = insp.result.findings.map(f => `• ${f.title}: ${f.legalActClause}`).join('\n');
  doc.text(`Statutory Violations:\n${findingsText}`, 14, 113);

  // Section 3: Legal Warning & Compounding Fees
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(153, 27, 27); // Red 800
  doc.text('3. COMPOUNDING OF OFFENCE NOTICE (UNDER SECTION 48)', 14, 138);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`The person/establishment in-charge is hereby notified that the seized commodities contravene Section 36(1).`, 14, 145);
  doc.text(`Statutory Compounding Fee (1st Offence Estimate): ₹ ${p.compoundingFineEstimate.toLocaleString('en-IN')}`, 14, 151);

  // Section 4: Panchnama & Witness Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text('4. PANCHNAMA & ATTESTATION OF WITNESSES', 14, 163);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('The seizure was conducted in the presence of the following independent witnesses:', 14, 170);

  doc.rect(14, 176, 88, 30);
  doc.text(`Witness 1: ${p.witness1Name || 'Independent Local Witness'}`, 18, 184);
  doc.text('Signature: ______________________', 18, 198);

  doc.rect(108, 176, 88, 30);
  doc.text(`Witness 2: ${p.witness2Name || 'Market Association Member'}`, 112, 184);
  doc.text('Signature: ______________________', 112, 198);

  // Officer Seal
  doc.rect(14, 215, 182, 32);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL SEAL & SIGNATURE OF LEGAL METROLOGY OFFICER', 105, 223, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`${p.officerName} | LMO Zone-IV`, 105, 235, { align: 'center' });
  doc.text(`Digital Hash: ${insp.id.slice(0, 16)} • Section 65B Certified`, 105, 241, { align: 'center' });

  doc.save(`Seizure_Memo_Sec15_${p.memoNumber}.pdf`);
}
