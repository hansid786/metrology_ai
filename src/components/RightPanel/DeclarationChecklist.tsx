import React from 'react';
import { MandatoryDeclaration } from '../../types/inspection';
import { CheckCircle2, XCircle, AlertTriangle, Target, ShieldCheck } from 'lucide-react';

interface DeclarationChecklistProps {
  declarations: MandatoryDeclaration[];
  selectedKey: string | null;
  onSelectKey: (key: string | null) => void;
}

export const DeclarationChecklist: React.FC<DeclarationChecklistProps> = ({
  declarations,
  selectedKey,
  onSelectKey,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">8 Mandatory Statutory Declarations Matrix</h3>
            <span className="text-[10px] font-extrabold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200">
              Rule 6(1) Standards
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Legal Metrology (Packaged Commodities) Rules, 2011 compliance checklist
          </p>
        </div>
        <div className="text-xs text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl flex items-center gap-2 font-bold shadow-2xs self-start sm:self-auto">
          <Target className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Click any row to locate on packaging</span>
        </div>
      </div>

      {/* Table Header on desktop */}
      <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-100/90 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">
        <div className="col-span-1">#</div>
        <div className="col-span-4">Statutory Declaration &amp; Legal Clause</div>
        <div className="col-span-4">Extracted Value on Package</div>
        <div className="col-span-2 text-center">Confidence</div>
        <div className="col-span-1 text-right">Status</div>
      </div>

      {/* Checklist Rows */}
      <div className="divide-y divide-slate-100">
        {declarations.map((item, index) => {
          const isSelected = selectedKey === item.key;

          return (
            <div
              key={item.id}
              onClick={() => onSelectKey(isSelected ? null : item.key)}
              className={`p-4 sm:px-5 cursor-pointer transition-all duration-150 flex flex-col md:grid md:grid-cols-12 gap-3 items-start md:items-center ${
                isSelected
                  ? 'bg-blue-50/90 border-l-4 border-l-blue-600 shadow-xs'
                  : 'hover:bg-slate-50/90 border-l-4 border-l-transparent'
              }`}
            >
              {/* # Index */}
              <div className="col-span-1 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-900 text-xs font-mono font-black flex items-center justify-center border border-slate-200">
                  {index + 1}
                </span>
                <span className="md:hidden text-xs font-bold text-slate-900">{item.name}</span>
              </div>

              {/* Declaration Details */}
              <div className="col-span-4 space-y-1 min-w-0">
                <div className="hidden md:block text-xs font-extrabold text-slate-900 tracking-tight">{item.name}</div>
                <div className="text-[11px] font-mono font-bold text-blue-700">{item.legalReference.split('-')[0].trim()}</div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{item.explanation}</p>
              </div>

              {/* Extracted Value */}
              <div className="col-span-4 w-full">
                <span className="inline-block font-mono text-xs text-slate-950 bg-white px-3 py-1.5 rounded-lg border border-slate-300 font-bold shadow-2xs max-w-full break-words whitespace-normal leading-relaxed">
                  {item.extractedValue}
                </span>
              </div>

              {/* Confidence */}
              <div className="col-span-2 text-center w-full md:w-auto">
                {item.status === 'EXEMPT' || item.status === 'NOT_APPLICABLE' ? (
                  <span className="inline-block text-[10px] text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full font-bold">
                    Statutory Exempt
                  </span>
                ) : item.confidence > 0 ? (
                  <span className="inline-block text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                    {item.confidence}% OCR
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-bold">—</span>
                )}
              </div>

              {/* Status Badge */}
              <div className="col-span-1 flex items-center justify-end w-full md:w-auto">
                {item.status === 'PASS' && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    PASS
                  </span>
                )}
                {item.status === 'FAIL' && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-950 border border-rose-300 flex items-center gap-1 shadow-2xs">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    FAIL
                  </span>
                )}
                {item.status === 'WARNING' && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1 shadow-2xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    WARN
                  </span>
                )}
                {item.status === 'EXEMPT' && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-slate-600" />
                    EXEMPT
                  </span>
                )}
                {item.status === 'NOT_APPLICABLE' && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 shadow-2xs">
                    N/A
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



