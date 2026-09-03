import React from 'react';
import { InspectionResult } from '../../types/inspection';
import { CheckCircle2, AlertCircle, AlertTriangle, Scale, ArrowRight, FileText } from 'lucide-react';

interface InspectionFindingsProps {
  inspection: InspectionResult;
  onOpenReportModal: () => void;
}

export const InspectionFindings: React.FC<InspectionFindingsProps> = ({
  inspection,
  onOpenReportModal,
}) => {
  const isCompliant = inspection.overallStatus === 'COMPLIANT';

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden space-y-4 p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Inspection Findings &amp; Statutory Audit</h3>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              Legal Metrology Act, 2009
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Statutory observations and regulatory compliance notes
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 self-start sm:self-auto border ${
          isCompliant ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs' : 'bg-rose-100 text-rose-950 border-rose-300 shadow-2xs'
        }`}>
          {isCompliant ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
          <span>{isCompliant ? 'Status: Fully Compliant' : 'Status: Attention Required'}</span>
        </div>
      </div>

      {/* Findings List with Vibrant Tinted Cards */}
      <div className="space-y-3">
        {inspection.findings.map((f) => {
          let badgeColor = 'bg-gradient-to-r from-emerald-50 to-teal-50/70 text-emerald-950 border-emerald-200';
          let dotColor = 'text-emerald-600';
          let Icon = CheckCircle2;

          if (f.severity === 'CRITICAL') {
            badgeColor = 'bg-gradient-to-r from-rose-50 to-red-50/80 text-rose-950 border-rose-200';
            dotColor = 'text-rose-600';
            Icon = AlertCircle;
          } else if (f.severity === 'WARNING') {
            badgeColor = 'bg-gradient-to-r from-amber-50 to-yellow-50/80 text-amber-950 border-amber-200';
            dotColor = 'text-amber-600';
            Icon = AlertTriangle;
          }

          return (
            <div
              key={f.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all shadow-2xs ${badgeColor}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${dotColor}`} />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-xs font-extrabold tracking-tight">{f.title}</h4>
                  <span className="text-[10px] font-mono text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200 font-bold truncate">
                    {f.legalActClause.split('&')[0]}
                  </span>
                </div>
                <p className="text-xs opacity-95 leading-relaxed font-normal">{f.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enforcement Next Action Recommendation Banner */}
      <div className="p-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-400/30 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white tracking-tight">Recommended Regulatory Action</h4>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              {isCompliant
                ? 'Package satisfies Rule 6(1) standards. Cleared for unrestricted consumer retail sale.'
                : 'Issue statutory Notice under Section 36(1) of Legal Metrology Act, 2009 for non-compliance.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Official Inspection Draft</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};


