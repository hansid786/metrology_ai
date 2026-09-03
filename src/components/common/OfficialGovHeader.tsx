import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PhoneCall } from 'lucide-react';

export const OfficialGovHeader: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="w-full bg-slate-900 text-slate-200 text-[11px] font-medium border-b border-slate-800 select-none">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 flex-wrap">
        {/* Left: National Flag & Ministry Info */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
            <span className="text-sm">🇮🇳</span>
            <span>{lang === 'hi' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline truncate">
            {lang === 'hi'
              ? 'उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय'
              : 'Ministry of Consumer Affairs, Food & Public Distribution'}
          </span>
        </div>

        {/* Right: GIGW Accessibility & Helpline */}
        <div className="flex items-center gap-3 text-[10px] sm:text-[11px] shrink-0">
          <a
            href="tel:1915"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition-colors"
            title="National Consumer Helpline"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>NCH: <strong className="font-mono">1915</strong></span>
          </a>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GIGW 3.0 Certified</span>
          </span>
        </div>
      </div>
    </div>
  );
};
