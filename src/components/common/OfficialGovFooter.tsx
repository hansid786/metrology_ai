import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

export const OfficialGovFooter: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800/80 text-xs font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Left: Ministry Identity */}
        <div className="flex items-center gap-2.5">
          <span className="text-base">🏛️</span>
          <div>
            <div className="text-white font-bold text-xs">
              {lang === 'hi' ? 'विधिक मापविज्ञान प्रभाग • उपभोक्ता मामले विभाग' : 'Legal Metrology Division • Dept. of Consumer Affairs'}
            </div>
            <div className="text-[10px] text-slate-500">
              {lang === 'hi' ? 'भारत सरकार • विधिक मापविज्ञान (पीसी) नियम, 2011' : 'Govt. of India • Legal Metrology (PC) Rules, 2011'}
            </div>
          </div>
        </div>

        {/* Center / Right: Quick Badges & Helpline */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <a
            href="tel:1915"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold hover:bg-amber-500/20 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>NCH: 1915 (Toll-Free)</span>
          </a>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Sec 65B Certified</span>
          </div>

          <div className="font-mono text-[10px] text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            <span>SIH 2026 • </span>
            <strong className="text-emerald-400">PS 26034</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};
