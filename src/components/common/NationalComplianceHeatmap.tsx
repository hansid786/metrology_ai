import React, { useState } from 'react';
import { MapPin, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, Building, ArrowUpRight } from 'lucide-react';

interface StateComplianceData {
  state: string;
  code: string;
  totalInspections: number;
  complianceRate: number;
  topViolation: string;
  seizureCount: number;
  activeNotices: number;
}

const STATE_DATA: StateComplianceData[] = [
  { state: 'NCT of Delhi', code: 'DL', totalInspections: 1420, complianceRate: 78, topViolation: 'USP Missing / Overcharging', seizureCount: 84, activeNotices: 112 },
  { state: 'Maharashtra', code: 'MH', totalInspections: 2150, complianceRate: 84, topViolation: 'FSSAI License Illegible', seizureCount: 126, activeNotices: 154 },
  { state: 'Uttar Pradesh', code: 'UP', totalInspections: 1890, complianceRate: 71, topViolation: 'MRP Tampering / Dual Pricing', seizureCount: 168, activeNotices: 210 },
  { state: 'Karnataka', code: 'KA', totalInspections: 1640, complianceRate: 88, topViolation: 'Electronics BIS Mark Missing', seizureCount: 42, activeNotices: 68 },
  { state: 'Gujarat', code: 'GJ', totalInspections: 1510, complianceRate: 86, topViolation: 'Net Quantity Discrepancy', seizureCount: 56, activeNotices: 82 },
  { state: 'Tamil Nadu', code: 'TN', totalInspections: 1380, complianceRate: 89, topViolation: 'Consumer Helpline Missing', seizureCount: 38, activeNotices: 54 },
  { state: 'West Bengal', code: 'WB', totalInspections: 1120, complianceRate: 74, topViolation: 'Non-Standard Units Declared', seizureCount: 92, activeNotices: 118 },
  { state: 'Rajasthan', code: 'RJ', totalInspections: 980, complianceRate: 76, topViolation: 'Best Before Date Missing', seizureCount: 64, activeNotices: 88 },
];

export const NationalComplianceHeatmap: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateComplianceData>(STATE_DATA[0]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">National State Packaging Compliance Heatmap</h3>
            <p className="text-xs text-slate-400 font-medium">
              Real-time enforcement intelligence across Indian State Directorates (PCR 2011)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
            8 States Monitored
          </span>
        </div>
      </div>

      {/* Grid of State Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATE_DATA.map((item) => {
          const isSelected = selectedState.code === item.code;
          const isHighRisk = item.complianceRate < 75;
          const isModerate = item.complianceRate >= 75 && item.complianceRate < 85;

          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setSelectedState(item)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-blue-950/80 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">{item.state}</span>
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                  isHighRisk ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  isModerate ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {item.complianceRate}%
                </span>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{item.totalInspections} Inspections</span>
                <span className="text-rose-400 font-bold">{item.seizureCount} Seizures</span>
              </div>

              {/* Progress bar */}
              <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isHighRisk ? 'bg-rose-500' : isModerate ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${item.complianceRate}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected State Deep-Dive Panel */}
      <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-black text-white">{selectedState.state} Directorate Intelligence</h4>
          </div>
          <span className="text-xs font-bold text-slate-400">Code: {selectedState.code}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Top Statutory Contravention</span>
            <div className="text-sm font-black text-rose-300 mt-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{selectedState.topViolation}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Section 36(1) Notices</span>
            <div className="text-base font-mono font-black text-amber-300 mt-1">
              {selectedState.activeNotices} Legal Notices Issued
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Section 15 Seizures (Panchnama)</span>
            <div className="text-base font-mono font-black text-cyan-300 mt-1">
              {selectedState.seizureCount} Confiscated Lots
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
