import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ShoppingBag, PhoneCall, History, BookOpen, ScanLine } from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { OfficialGovFooter } from '../common/OfficialGovFooter';

export const ConsumerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const handleSwitchToOfficer = () => {
    authService.logout();
    navigate('/login');
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
      <div className="sticky top-0 z-50"
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
                <span className="text-[11px] font-semibold text-slate-400 hidden md:inline">
                  🇮🇳 {lang === 'hi' ? 'भारत सरकार' : 'Govt. of India'}
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

            <button onClick={handleSwitchToOfficer}
              className="p-2 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 btn-press">
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'अधिकारी' : 'Officer'}</span>
            </button>
          </div>
        </header>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 md:pb-6 page-enter">
        {children}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'rgba(255,255,255,0.93)',
          backdropFilter: 'blur(20px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.07)',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        }}>
        <div className="flex items-center justify-around pt-2 pb-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 px-5 py-1 btn-press">
                <div className={`p-1.5 rounded-2xl transition-all duration-200 ${active ? 'bg-emerald-100' : ''}`}>
                  <Icon className={`w-5 h-5 transition-all duration-200 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <span className={`text-[10px] font-bold transition-colors duration-200 ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
          <button onClick={handleSwitchToOfficer}
            className="flex flex-col items-center gap-0.5 px-4 py-1 text-slate-400 btn-press">
            <div className="p-1.5 rounded-2xl">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">{lang === 'hi' ? 'अधिकारी' : 'Officer'}</span>
          </button>
        </div>
      </nav>

      <OfficialGovFooter />
    </div>
  );
};
