import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { InspectionResult } from '../../types/inspection';

interface ComplianceScorecardProps {
  inspection: InspectionResult;
  onOpenReportModal: () => void;
}

export const ComplianceScorecard: React.FC<ComplianceScorecardProps> = ({
  inspection,
  onOpenReportModal,
}) => {
  const isCompliant = inspection.overallStatus === 'COMPLIANT';
  const percentage = inspection.compliancePercentage;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const passedCount = inspection.declarations.filter((d) => d.status === 'PASS').length;
  const failedCount = inspection.declarations.filter((d) => d.status === 'FAIL').length;
  const warningCount = inspection.declarations.filter((d) => d.status === 'WARNING').length;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-5 sm:p-6 space-y-4">
      {/* Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">Legal Compliance Scorecard</span>
            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
              Rule 6(1) Standards
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
            {inspection.product.name}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Badge */}
          <div
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-xs border-2 ${
              isCompliant
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-950 border-rose-300'
            }`}
          >
            {isCompliant ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>FULLY COMPLIANT</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>ATTENTION REQUIRED</span>
              </>
            )}
          </div>

          {/* Legal Report Button */}
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Inspection PDF</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Gauge & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Ring Progress */}
        <div className="md:col-span-4 flex items-center justify-center p-1">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={`transition-all duration-1000 ease-out ${
                  percentage >= 100
                    ? 'text-emerald-500'
                    : percentage >= 75
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono tracking-tight text-slate-900 leading-none">
                {percentage}%
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase mt-1.5">
                {passedCount}/{inspection.totalCount} Verified
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Stat Cards with Richer Contrast */}
        <div className="md:col-span-8 grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 rounded-2xl text-center shadow-xs">
            <div className="flex items-center justify-center text-emerald-600 mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-950">{passedCount}</div>
            <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wider mt-0.5">Verified</div>
          </div>

          <div className="p-3.5 bg-gradient-to-br from-rose-50 to-red-50/60 border border-rose-200 rounded-2xl text-center shadow-xs">
            <div className="flex items-center justify-center text-rose-600 mb-1">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="text-xl font-black font-mono text-rose-950">{failedCount}</div>
            <div className="text-[10px] font-black text-rose-800 uppercase tracking-wider mt-0.5">Discrepancies</div>
          </div>

          <div className="p-3.5 bg-gradient-to-br from-amber-50 to-yellow-50/60 border border-amber-200 rounded-2xl text-center shadow-xs">
            <div className="flex items-center justify-center text-amber-600 mb-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xl font-black font-mono text-amber-950">{warningCount}</div>
            <div className="text-[10px] font-black text-amber-800 uppercase tracking-wider mt-0.5">Warnings</div>
          </div>
        </div>
      </div>
    </div>
  );
};


