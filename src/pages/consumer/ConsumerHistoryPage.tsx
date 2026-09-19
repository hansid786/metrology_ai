import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Plus, ChevronRight, CheckCircle2, AlertTriangle, AlertOctagon,
  Sparkles, History, ShieldCheck, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import { persistenceService } from '../../services/persistenceService';
import { generateLegalInspectionReportPDF } from '../../utils/pdfGenerator';
import { SavedInspection } from '../../types/inspection';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

export const ConsumerHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [scans, setScans] = useState<SavedInspection[]>([]);

  useEffect(() => {
    setScans(persistenceService.getConsumerInspections());
  }, []);

  const handleDownloadSlip = (insp: SavedInspection, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = generateLegalInspectionReportPDF(insp.result);
    doc.save(`Consumer_Verification_Slip_${insp.metadata.inspectionId}.pdf`);
  };

  const totalScans = scans.length;
  const compliantCount = scans.filter(s => s.result.overallStatus === 'COMPLIANT').length;
  const issueCount = totalScans - compliantCount;

  return (
    <div className="space-y-6 max-w-4xl mx-auto page-enter">
      {/* Colorful Gradient Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 border border-indigo-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-teal-200 text-xs font-black backdrop-blur-xs">
              <History className="w-3.5 h-3.5 text-teal-300" />
              <span>{lang === 'hi' ? 'सत्यापन इतिहास एवं लॉकर' : 'Citizen Verification History'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {lang === 'hi' ? 'स्कैन किए गए उत्पादों का रिकॉर्ड' : 'My Scanned Products History'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-medium">
              {lang === 'hi'
                ? 'आपके द्वारा सत्यापित सभी किराना, खाद्य और इलेक्ट्रॉनिक पैकेटों का कानूनी विश्लेषण रिकॉर्ड।'
                : 'Complete offline and cloud records of all packaged commodities analyzed on your device.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/consumer/scan')}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer btn-press shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'hi' ? 'नया उत्पाद स्कैन करें' : 'Scan New Item'}</span>
          </button>
        </div>

        {/* Colorful Stats Summary Badges */}
        {totalScans > 0 && (
          <div className="relative z-10 grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] uppercase font-black text-indigo-200 block">
                {lang === 'hi' ? 'कुल स्कैन' : 'Total Scanned'}
              </span>
              <span className="text-lg sm:text-2xl font-black text-white">{totalScans}</span>
            </div>

            <div className="bg-emerald-500/20 backdrop-blur-md rounded-2xl p-3 border border-emerald-400/30">
              <span className="text-[10px] uppercase font-black text-emerald-200 block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {lang === 'hi' ? 'पूर्णतः सही' : 'Compliant'}
              </span>
              <span className="text-lg sm:text-2xl font-black text-emerald-300">{compliantCount}</span>
            </div>

            <div className="bg-rose-500/20 backdrop-blur-md rounded-2xl p-3 border border-rose-400/30">
              <span className="text-[10px] uppercase font-black text-rose-200 block flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {lang === 'hi' ? 'विसंगति / ओवरचार्ज' : 'Discrepancies'}
              </span>
              <span className="text-lg sm:text-2xl font-black text-rose-300">{issueCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* History List */}
      {scans.length === 0 ? (
        <EmptyState
          title={lang === 'hi' ? 'अभी तक कोई उत्पाद स्कैन नहीं किया गया' : 'No products scanned yet'}
          description={lang === 'hi' ? 'मूल्य एवं गुणवत्ता अनुपालन की जांच के लिए किराना, खाद्य पैकेट या इलेक्ट्रॉनिक उत्पाद स्कैन करें!' : 'Scan your first grocery, food packet, or electronic product to check price and quality compliance!'}
          actionText={lang === 'hi' ? 'अब एक उत्पाद स्कैन करें' : 'Scan a Product Now'}
          onAction={() => navigate('/consumer/scan')}
        />
      ) : (
        <div className="space-y-3.5 stagger">
          {scans.map(item => {
            const isCompliant = item.result.overallStatus === 'COMPLIANT';
            const isOvercharge = item.result.pricing.isDiscrepancy;

            const cardBorderColor = isCompliant
              ? 'border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/40 via-white to-white'
              : isOvercharge
              ? 'border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-50/40 via-white to-white'
              : 'border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/40 via-white to-white';

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/consumer/result/${item.id}`)}
                className={`bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer card-hover border border-slate-200/90 shadow-xs ${cardBorderColor}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isCompliant ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
                    isOvercharge ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                    'bg-amber-100 text-amber-700 border border-amber-300'
                  }`}>
                    {isCompliant && <CheckCircle2 className="w-6 h-6" />}
                    {isOvercharge && <AlertOctagon className="w-6 h-6" />}
                    {!isCompliant && !isOvercharge && <AlertTriangle className="w-6 h-6" />}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {item.metadata.productName}
                      </h3>

                      {/* Status Chip */}
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        isCompliant
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isOvercharge
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {isCompliant
                          ? (lang === 'hi' ? 'मानक अनुसार (Compliant)' : '100% Compliant')
                          : isOvercharge
                          ? (lang === 'hi' ? 'ओवरचार्ज / विसंगति' : 'Price Discrepancy')
                          : (lang === 'hi' ? 'अपूर्ण घोषणा' : 'Incomplete')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium flex-wrap">
                      <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        ₹{item.result.pricing.mrpAmount.toFixed(2)}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{item.result.pricing.netQuantityValue} {item.result.pricing.netQuantityUnit}</span>
                      <span>•</span>
                      <span>{new Date(item.metadata.dateTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDownloadSlip(item, e)}
                    className="p-2.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-slate-200/90 transition-colors btn-press cursor-pointer bg-slate-50 shadow-2xs"
                    title={lang === 'hi' ? 'कानूनी पर्ची डाउनलोड करें' : 'Download Verification Slip'}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <ChevronRight className="w-4 h-4" />
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
