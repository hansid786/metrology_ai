import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ShoppingBag, PhoneCall, History, BookOpen } from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { OfficialGovFooter } from '../common/OfficialGovFooter';

export const ConsumerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, t } = useLanguage();

  const handleSwitchToOfficer = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">

      {/* ── Consolidated Single-Row Official Government Header ── */}
      <div className="sticky top-0 z-50 flex flex-col bg-white border-b border-slate-200 shadow-sm">
        {/* Tricolor Government Top Micro-Strip */}
        <div className="h-1 w-full flex">
          <div className="h-full w-1/3 bg-amber-500" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-emerald-500" />
        </div>

        {/* Compact Single Unified Navbar */}
        <header className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-15 w-full flex items-center justify-between gap-2">
          {/* Left: 🇮🇳 Flag + GOI + Jago Grahak Jago + MetrologyLens AI */}
          <div
            onClick={() => navigate('/consumer/scan')}
            className="flex items-center gap-2 cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="text-xs font-bold text-slate-500 hidden md:inline">
                  🇮🇳 {lang === 'hi' ? 'भारत सरकार' : 'Govt. of India'}
                </span>
                <span className="text-slate-300 hidden md:inline">|</span>
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight whitespace-nowrap">
                  {lang === 'hi' ? 'जागो ग्राहक जागो' : 'Jago Grahak Jago'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>MetrologyLens AI</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate hidden lg:block">
                {lang === 'hi' ? 'उपभोक्ता मामले विभाग • विधिक मापविज्ञान' : 'Dept. of Consumer Affairs • Legal Metrology Portal'}
              </p>
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <LanguageToggle />

            {/* Helpline Pill - Visible on Tablet and Desktop */}
            <a
              href="tel:1915"
              className="hidden sm:flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 transition-colors shadow-2xs whitespace-nowrap"
              title="National Consumer Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden lg:inline text-[11px] text-slate-600">NCH:</span>
              <span className="font-mono font-black text-amber-700 text-xs">1915</span>
            </a>

            {/* Rules Guide Button - Visible on Tablet and Desktop */}
            <button
              onClick={() => navigate('/consumer/rules')}
              className={`hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all items-center gap-1.5 cursor-pointer ${
                location.pathname === '/consumer/rules'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Legal Packaging Rules Directory"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'नियम' : 'Rules'}</span>
            </button>

            {/* My Scans Button */}
            <button
              onClick={() => navigate('/consumer/history')}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                location.pathname === '/consumer/history'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Saved Inspection Records"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('myScans')}</span>
            </button>

            {/* Switch to Officer Portal */}
            <button
              onClick={handleSwitchToOfficer}
              className="p-2 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              title="Officer Login"
            >
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'अधिकारी' : 'Officer'}</span>
            </button>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {children}
      </main>

      {/* Official Government Footer */}
      <OfficialGovFooter />
    </div>
  );
};
