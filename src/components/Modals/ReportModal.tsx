import React from 'react';
import { X, Download, Printer, ShieldCheck, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { InspectionResult } from '../../types/inspection';
import { downloadInspectionReportPDF } from '../../utils/pdfGenerator';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: InspectionResult;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  inspection,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    downloadInspectionReportPDF(inspection);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCompliant = inspection.overallStatus === 'COMPLIANT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white tracking-tight">Legal Inspection Report Preview</h2>
                <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-bold">
                  AI Draft
                </span>
              </div>
              <p className="text-xs text-slate-400">Section 36 Compliance Audit Record • Ministry of Consumer Affairs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Download Official PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100/70">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-3xl mx-auto space-y-6 print:shadow-none print:border-none print:p-0">
            {/* Government Official Header */}
            <div className="text-center border-b border-slate-200 pb-5 space-y-1">
              <div className="flex justify-center mb-1">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-serif font-black flex items-center justify-center border-2 border-amber-500 shadow-sm text-sm">
                  GOI
                </div>
              </div>
              <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Government of India • Ministry of Consumer Affairs, Food &amp; Public Distribution</p>
              <h1 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Legal Metrology Compliance Inspection Audit</h1>
              <p className="text-xs text-slate-500 font-medium">Department of Consumer Affairs • Legal Metrology (Packaged Commodities) Rules, 2011</p>
              <div className="pt-1">
                <span className="inline-block text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full">
                  AI-GENERATED PRELIMINARY INSPECTION DRAFT
                </span>
              </div>
            </div>

            {/* Inspection Meta Box */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="space-y-1">
                <p><span className="font-semibold text-slate-700">Inspection ID:</span> <span className="font-mono text-slate-900 font-bold">{inspection.inspectionId}</span></p>
                <p><span className="font-semibold text-slate-700">Timestamp:</span> {new Date(inspection.timestamp).toLocaleString('en-IN')}</p>
                <p><span className="font-semibold text-slate-700">Product:</span> {inspection.product.name}</p>
                <p><span className="font-semibold text-slate-700">Category:</span> {inspection.product.category}</p>
              </div>
              <div className="space-y-1 border-l border-slate-200 pl-4">
                <p><span className="font-semibold text-slate-700">Inspector:</span> {inspection.inspector.name} (<span className="font-mono">{inspection.inspector.id}</span>)</p>
                <p><span className="font-semibold text-slate-700">Designation:</span> {inspection.inspector.designation}</p>
                <p><span className="font-semibold text-slate-700">Jurisdiction:</span> {inspection.inspector.jurisdiction}</p>
                <p><span className="font-semibold text-slate-700">OCR Engine:</span> {inspection.ocrMetadata.engine}</p>
              </div>
            </div>

            {/* Overall Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isCompliant 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center gap-3">
                {isCompliant ? (
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-sm">
                    {isCompliant ? 'INSPECTION STATUS: COMPLIANT' : 'INSPECTION STATUS: ATTENTION REQUIRED'}
                  </h3>
                  <p className="text-xs opacity-90">
                    {inspection.verifiedCount} of {inspection.totalCount} Mandatory Declarations Verified ({inspection.compliancePercentage}% Compliance Score)
                  </p>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-xl">
                {inspection.compliancePercentage}%
              </div>
            </div>

            {/* Pricing Intelligence Mathematical Audit */}
            <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Pricing Intelligence &amp; Unit Rate Verification (Rule 6(1)(e))
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  inspection.pricing.isDiscrepancy 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {inspection.pricing.isDiscrepancy ? 'MISMATCH DETECTED' : 'MATHEMATICALLY VERIFIED'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Declared MRP</div>
                  <div className="text-base font-bold text-white mt-0.5">₹{inspection.pricing.mrpAmount.toFixed(2)}</div>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Quantity</div>
                  <div className="text-base font-bold text-white mt-0.5">{inspection.pricing.netQuantityValue} {inspection.pricing.netQuantityUnit}</div>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Printed USP</div>
                  <div className={`text-base font-bold mt-0.5 ${inspection.pricing.isDiscrepancy ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {inspection.pricing.printedUSPText || 'Not Detected'}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Calculated USP</div>
                  <div className="text-base font-bold text-blue-400 mt-0.5">
                    ₹{inspection.pricing.calculatedUSPAmount.toFixed(2)} / {inspection.pricing.calculatedUSPUnit}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="font-semibold text-white">Mathematical Audit:</span> {inspection.pricing.statusDescription}
              </p>
            </div>

            {/* 8 Mandatory Declarations Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">8 Mandatory Declarations Audit Matrix</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Declaration</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Extracted Value</th>
                      <th className="p-2.5">Statutory Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inspection.declarations.map((decl, idx) => (
                      <tr key={decl.id} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{decl.name}</td>
                        <td className="p-2.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            decl.status === 'PASS' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : decl.status === 'FAIL' 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {decl.status === 'PASS' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                            {decl.status}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono text-slate-700 max-w-[220px] truncate" title={decl.extractedValue}>
                          {decl.extractedValue}
                        </td>
                        <td className="p-2.5 text-slate-500 text-[11px]">{decl.legalReference.split('-')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Findings & Legal Notice Recommendation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Enforcement Findings &amp; Next Action</h4>
              <div className="space-y-2">
                {inspection.findings.map((f) => (
                  <div key={f.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className={f.severity === 'CRITICAL' ? 'text-rose-600' : f.severity === 'WARNING' ? 'text-amber-600' : 'text-emerald-600'}>
                        ●
                      </span>
                      <span>{f.title}</span>
                    </div>
                    <p className="text-slate-600">{f.description}</p>
                    <p className="text-[11px] text-slate-400 italic">Statutory Citation: {f.legalActClause}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspector Digital Attestation Footer */}
            <div className="border-t border-slate-200 pt-6 flex items-center justify-between text-xs text-slate-500">
              <div>
                <p className="font-semibold text-slate-800">Verification Hash:</p>
                <p className="font-mono text-[11px] text-slate-500">89f4b391a27e990c73e904b771</p>
                <p className="text-[10px] text-slate-400 mt-1">MetrologyLens AI Inspection Draft</p>
              </div>
              <div className="text-right border-t-2 border-slate-800 pt-2 min-w-[180px]">
                <p className="font-bold text-slate-900">{inspection.inspector.name}</p>
                <p className="text-[11px] text-slate-600">{inspection.inspector.designation}</p>
                <p className="text-[10px] font-mono text-slate-400">ID: {inspection.inspector.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
