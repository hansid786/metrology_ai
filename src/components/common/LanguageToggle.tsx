import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-0.5 sm:gap-1 p-0.5 sm:px-1.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all shadow-2xs shrink-0 ${
        variant === 'dark'
          ? 'bg-slate-900 border-slate-800 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 shrink-0 hidden xs:inline" />
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition-all cursor-pointer ${
          lang === 'en'
            ? variant === 'dark'
              ? 'bg-blue-600 text-white font-black shadow-xs'
              : 'bg-emerald-600 text-white font-black shadow-xs'
            : 'hover:text-slate-900'
        }`}
      >
        <span className="sm:hidden">EN</span>
        <span className="hidden sm:inline">English</span>
      </button>

      <span className="opacity-30 text-[10px]">|</span>

      <button
        type="button"
        onClick={() => setLang('hi')}
        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition-all cursor-pointer ${
          lang === 'hi'
            ? variant === 'dark'
              ? 'bg-blue-600 text-white font-black shadow-xs'
              : 'bg-emerald-600 text-white font-black shadow-xs'
            : 'hover:text-slate-900'
        }`}
      >
        <span className="sm:hidden">हि</span>
        <span className="hidden sm:inline">हिन्दी</span>
      </button>
    </div>
  );
};
