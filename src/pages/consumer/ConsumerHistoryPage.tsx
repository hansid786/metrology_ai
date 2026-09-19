import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, ChevronRight, CheckCircle2, AlertTriangle, AlertOctagon, Sparkles } from 'lucide-react';
import { persistenceService } from '../../services/persistenceService';
import { generateLegalInspectionReportPDF } from '../../utils/pdfGenerator';
import { SavedInspection } from '../../types/inspection';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

export const ConsumerHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [scans, setScans] = useState<SavedInspection[]>([]);

  useEffect(() => {
    setScans(persistenceService.getConsumerInspections());
  }, []);

  const handleDownloadSlip = (insp: SavedInspection, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = generateLegalInspectionReportPDF(insp.result);
    doc.save(`Consumer_Verification_Slip_${insp.metadata.inspectionId}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto page-enter">
      {/* Top Banner */}
      <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-1 border border-emerald-200/80">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'hi' ? 'स्थानीय सत्यापन रिकॉर्ड' : 'Device Verification Vault'}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {lang === 'hi' ? 'स्कैन किए गए उत्पादों का इतिहास' : 'My Scanned Products History'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {lang === 'hi' ? 'आपके डिवाइस पर सत्यापित सभी पैकेज्ड वस्तुओं के रिकॉर्ड' : 'Records of all packaged commodities verified on your device'}
          </p>
        </div>

        <button
          onClick={() => navigate('/consumer/scan')}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer btn-press shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'hi' ? 'नया उत्पाद स्कैन करें' : 'Scan New Item'}</span>
        </button>
      </div>

      {scans.length === 0 ? (
        <EmptyState
          title={lang === 'hi' ? 'अभी तक कोई उत्पाद स्कैन नहीं किया गया' : 'No products scanned yet'}
          description={lang === 'hi' ? 'मूल्य एवं गुणवत्ता अनुपालन की जांच के लिए किराना, खाद्य पैकेट या इलेक्ट्रॉनिक उत्पाद स्कैन करें!' : 'Scan your first grocery, food packet, or electronic product to check price and quality compliance!'}
          actionText={lang === 'hi' ? 'अब एक उत्पाद स्कैन करें' : 'Scan a Product Now'}
          onAction={() => navigate('/consumer/scan')}
        />
      ) : (
        <div className="space-y-3 stagger">
          {scans.map(item => {
            const isCompliant = item.result.overallStatus === 'COMPLIANT';
            const isOvercharge = item.result.pricing.isDiscrepancy;

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/consumer/result/${item.id}`)}
                className="glass-card p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer card-hover"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isCompliant ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    isOvercharge ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {isCompliant && <CheckCircle2 className="w-5 h-5" />}
                    {isOvercharge && <AlertOctagon className="w-5 h-5" />}
                    {!isCompliant && !isOvercharge && <AlertTriangle className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      {item.metadata.productName}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5 flex-wrap">
                      <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                        ₹{item.result.pricing.mrpAmount.toFixed(2)}
                      </span>
                      <span>•</span>
                      <span>{item.result.pricing.netQuantityValue} {item.result.pricing.netQuantityUnit}</span>
                      <span>•</span>
                      <span>{new Date(item.metadata.dateTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDownloadSlip(item, e)}
                    className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200/80 transition-colors btn-press cursor-pointer"
                    title="Download Slip"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
