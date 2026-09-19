import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ShoppingBag, PhoneCall, History, BookOpen, ScanLine, Landmark, LogOut, ShieldAlert, X } from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { OfficialGovFooter } from '../common/OfficialGovFooter';

export const ConsumerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const navItems = [
    { path: '/consumer/scan',    icon: ScanLine, label: lang === 'hi' ? 'स्कैन'   : 'Scan'    },
    { path: '/consumer/history', icon: History,  label: lang === 'hi' ? 'इतिहास' : 'History'  },
    { path: '/consumer/rules',   icon: BookOpen, label: lang === 'hi' ? 'नियम'   : 'Rules'    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-600 selection:text-white"
      style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f1f5f9 45%, #eff6ff 100%)' }}>

      {/* ── Sticky Glass Header ── */}
      <div className="sticky top-0 z-40"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 16px rgba(0,0,0,0.06)',
        }}>

        {/* Tricolor strip */}
        <div className="h-[3px] w-full flex">
          <div className="h-full flex-1 bg-amber-500" />
          <div className="h-full flex-1 bg-white" />
          <div className="h-full flex-1 bg-emerald-500" />
        </div>

        <header className="max-w-6xl mx-auto px-3 sm:px-6 h-14 w-full flex items-center justify-between gap-2">
          {/* Logo */}
          <div onClick={() => navigate('/consumer/scan')}
            className="flex items-center gap-2 cursor-pointer min-w-0 btn-press">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hidden md:inline-flex">
                  <Landmark className="w-3.5 h-3.5 text-slate-600" />
                  <span>{lang === 'hi' ? 'भारत सरकार' : 'Govt. of India'}</span>
                </span>
                <span className="text-slate-200 hidden md:inline">·</span>
                <span className="text-sm font-black text-slate-900 tracking-tight whitespace-nowrap">
                  {lang === 'hi' ? 'जागो ग्राहक जागो' : 'Jago Grahak Jago'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  MetrologyLens AI
                </span>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 shrink-0">
            <LanguageToggle />

            <a href="tel:1915"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 rounded-xl text-xs font-bold text-amber-800 transition-all duration-200 btn-press whitespace-nowrap">
              <PhoneCall className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-mono font-black text-amber-700">1915</span>
            </a>

            {/* Desktop nav tabs */}
            {navItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`hidden md:flex px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 items-center gap-1.5 cursor-pointer btn-press ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                      : 'text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleOpenLogoutModal}
              title={lang === 'hi' ? 'अधिकारी पोर्टल पर स्विच करें' : 'Switch to Officer Portal'}
              className="p-2 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 btn-press"
            >
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'अधिकारी' : 'Officer'}</span>
            </button>
          </div>
        </header>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 md:pb-28 page-enter">
        {children}
      </main>

      {/* ── App-Style Bottom Navigation Bar (Visible on All Devices with Floating Dock on Desktop) ── */}
      <nav className="fixed bottom-0 sm:bottom-4 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md md:max-w-lg z-40 sm:rounded-3xl border-t sm:border border-slate-200/90 shadow-2xl transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          boxShadow: '0 10px 35px -5px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(0,0,0,0.05)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
        }}>
        <div className="flex items-center justify-around px-3 pt-2 pb-1">
          {/* Tab 1: History */}
          <button
            onClick={() => navigate('/consumer/history')}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 btn-press cursor-pointer group"
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-200 ${
              location.pathname === '/consumer/history' ? 'bg-emerald-100 text-emerald-700 shadow-xs' : 'text-slate-400 group-hover:text-slate-600'
            }`}>
              <History className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold ${
              location.pathname === '/consumer/history' ? 'text-emerald-700 font-black' : 'text-slate-500'
            }`}>
              {lang === 'hi' ? 'इतिहास' : 'History'}
            </span>
          </button>

          {/* Tab 2: Legal Rules */}
          <button
            onClick={() => navigate('/consumer/rules')}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 btn-press cursor-pointer group"
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-200 ${
              location.pathname === '/consumer/rules' ? 'bg-emerald-100 text-emerald-700 shadow-xs' : 'text-slate-400 group-hover:text-slate-600'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold ${
              location.pathname === '/consumer/rules' ? 'text-emerald-700 font-black' : 'text-slate-500'
            }`}>
              {lang === 'hi' ? 'नियम' : 'Rules'}
            </span>
          </button>

          {/* Tab 3: Center Elevated SCAN Hero Button (Like Instagram Reels / Camera) */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-6">
            <button
              onClick={() => navigate('/consumer/scan')}
              className={`w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl shadow-emerald-600/40 border-4 border-white flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                location.pathname === '/consumer/scan' ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
              }`}
              title="Instant Scan Product"
            >
              <ScanLine className="w-6 h-6 animate-pulse" />
            </button>
            <span className="text-[10px] font-black text-emerald-700 mt-0.5">
              {lang === 'hi' ? 'स्कैन करें' : 'Scan'}
            </span>
          </div>

          {/* Tab 4: NCH 1915 Helpline */}
          <a
            href="tel:1915"
            className="flex-1 flex flex-col items-center gap-0.5 py-1 btn-press cursor-pointer text-amber-700 group"
          >
            <div className="p-1.5 rounded-2xl bg-amber-50 text-amber-600 transition-all group-hover:bg-amber-100">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-amber-800">1915</span>
          </a>

          {/* Tab 5: Switch to Officer Portal */}
          <button
            onClick={handleOpenLogoutModal}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 text-slate-500 hover:text-slate-800 btn-press cursor-pointer group"
          >
            <div className="p-1.5 rounded-2xl text-slate-400 group-hover:bg-slate-100 transition-all">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">
              {lang === 'hi' ? 'अधिकारी' : 'Officer'}
            </span>
          </button>
        </div>
      </nav>

      {/* Logout / Switch Gateway Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'hi' ? 'सत्र समाप्त / अधिकारी पोर्टल' : 'Exit Consumer Portal?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {lang === 'hi'
                  ? 'आप उपभोक्ता सत्यापन सत्र से बाहर निकलकर अधिकारी लॉगिन गेटवे पर जा रहे हैं। क्या आप जारी रखना चाहते हैं?'
                  : 'You are about to exit the Consumer Portal and switch to the Officer Login & Authentication gateway. Do you want to proceed?'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
              <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                {lang === 'hi'
                  ? 'अधिकारी पोर्टल केवल अधिकृत विधिक मापविज्ञान अधिकारियों के लिए है।'
                  : 'Officer portal is strictly reserved for authorized Legal Metrology inspectors.'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  authService.logout();
                  setShowLogoutModal(false);
                  navigate('/login');
                }}
                className="py-3 px-4 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'hi' ? 'लॉगआउट करें' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <OfficialGovFooter />
    </div>
  );
};
