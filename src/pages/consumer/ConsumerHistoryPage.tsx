import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, ChevronRight, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { persistenceService } from '../../services/persistenceService';
import { generateLegalInspectionReportPDF } from '../../utils/pdfGenerator';
import { SavedInspection } from '../../types/inspection';
import { EmptyState } from '../../components/common/EmptyState';

export const ConsumerHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<SavedInspection[]>([]);

  useEffect(() => {
    setScans(persistenceService.getAll());
  }, []);

  const handleDownloadSlip = (insp: SavedInspection, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = generateLegalInspectionReportPDF(insp.result);
    doc.save(`Consumer_Verification_Slip_${insp.metadata.inspectionId}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">My Scanned Products History</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Records of all packaged commodities verified on your device</p>
        </div>

        <button
          onClick={() => navigate('/consumer/scan')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Scan New Item</span>
        </button>
      </div>

      {scans.length === 0 ? (
        <EmptyState
          title="No products scanned yet"
          description="Scan your first grocery, food packet, or electronic product to check price and quality compliance!"
          actionText="Scan a Product Now"
          onAction={() => navigate('/consumer/scan')}
        />
      ) : (
        <div className="space-y-3">
          {scans.map(item => {
            const isCompliant = item.result.overallStatus === 'COMPLIANT';
            const isOvercharge = item.result.pricing.isDiscrepancy;

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/consumer/result/${item.id}`)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompliant ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    isOvercharge ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {isCompliant && <CheckCircle2 className="w-5 h-5" />}
                    {isOvercharge && <AlertOctagon className="w-5 h-5" />}
                    {!isCompliant && !isOvercharge && <AlertTriangle className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {item.metadata.productName}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-0.5">
                      <span>₹ {item.result.pricing.mrpAmount.toFixed(2)}</span>
                      <span>•</span>
                      <span>{new Date(item.metadata.dateTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDownloadSlip(item, e)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
                    title="Download Slip"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
