import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Plus, ClipboardList, BarChart2, ShieldCheck,
  FileText, Settings, LogOut, Menu, X, ChevronRight, Activity, Shield,
  ArrowLeftRight, UserCheck, Sparkles, ShieldAlert
} from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { OfficialGovFooter } from '../common/OfficialGovFooter';

const OFFICER_NAV_ITEMS = [
  { path: '/dashboard', labelEn: 'Dashboard Overview', labelHi: 'डैशबोर्ड अवलोकन', icon: LayoutDashboard },
  { path: '/inspect/new', labelEn: 'New Field Inspection', labelHi: 'नया क्षेत्रीय निरीक्षण', icon: Plus, highlight: true },
  { path: '/complaints', labelEn: 'Consumer Grievances', labelHi: 'उपभोक्ता शिकायतें (NCH)', icon: ShieldAlert, alertBadge: true },
  { path: '/history', labelEn: 'Inspection Records', labelHi: 'निरीक्षण रिकॉर्ड्स', icon: ClipboardList },
  { path: '/analytics', labelEn: 'National Analytics', labelHi: 'राष्ट्रीय विश्लेषण', icon: BarChart2 },
  { path: '/rules', labelEn: 'Compliance Rule Matrix', labelHi: 'अनुपालन नियम मैट्रिक्स', icon: ShieldCheck },
  { path: '/reports', labelEn: 'Official Reports (PC-1)', labelHi: 'आधिकारिक रिपोर्ट (PC-1)', icon: FileText },
  { path: '/settings', labelEn: 'Officer Settings', labelHi: 'अधिकारी सेटिंग्स', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const { lang, t } = useLanguage();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white/90 backdrop-blur-2xl border-r border-slate-200/80 z-50 flex flex-col transition-all duration-300 shadow-xl shadow-slate-200/50 ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64 translate-x-0'
        }`}
      >
        {/* Government Identity Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 min-h-[64px]">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-slate-900 font-black text-sm tracking-tight truncate">
                MetrologyLens <span className="text-indigo-600 font-black">AI</span>
              </div>
              <div className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                {lang === 'hi' ? 'प्रवर्तन पोर्टल' : 'Enforcement Portal'}
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="ml-auto p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-2.5 space-y-1.5 overflow-y-auto">
          {OFFICER_NAV_ITEMS.map(({ path, labelEn, labelHi, icon: Icon, highlight, alertBadge }) => {
            const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
            const label = lang === 'hi' ? labelHi : labelEn;
            return (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  if (window.innerWidth < 1024) onToggle();
                }}
                title={collapsed ? label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer btn-press ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25 font-black'
                    : highlight
                    ? 'text-indigo-700 hover:bg-indigo-50 border border-indigo-200/80 bg-indigo-50/50'
                    : alertBadge
                    ? 'text-rose-700 hover:bg-rose-50 border border-rose-200/80 bg-rose-50/30'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : highlight ? 'text-indigo-600' : alertBadge ? 'text-rose-600' : 'text-slate-500'}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{label}</span>
                    {highlight && (
                      <span className="bg-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                        NEW
                      </span>
                    )}
                    {alertBadge && (
                      <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs animate-pulse">
                        LIVE
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Officer Profile & Switch Portal */}
        <div className="border-t border-slate-100 p-3 space-y-2 bg-slate-50/50">
          {!collapsed && user && (
            <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-2xs">
                  {user.avatarInitials || 'RK'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-slate-900 text-xs font-bold truncate">{user.name}</div>
                  <div className="text-[10px] text-indigo-600 font-mono truncate font-semibold">{user.inspectorId}</div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={collapsed ? (lang === 'hi' ? 'उपभोक्ता पोर्टल' : 'Switch to Consumer') : undefined}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer btn-press"
          >
            <ArrowLeftRight className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{t('switchToConsumer')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

interface TopBarProps {
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const { lang, t } = useLanguage();

  const currentItem = OFFICER_NAV_ITEMS.find(n =>
    location.pathname === n.path || (n.path !== '/dashboard' && location.pathname.startsWith(n.path))
  );
  const pageTitle = currentItem ? (lang === 'hi' ? currentItem.labelHi : currentItem.labelEn) : t('portalTitle');

  return (
    <header
      className={`fixed top-0 right-0 left-0 h-16 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 z-30 flex items-center px-4 sm:px-6 gap-2 sm:gap-4 shadow-xs transition-all duration-300 ${
        sidebarCollapsed ? 'lg:left-20' : 'lg:left-64'
      }`}
    >
      {/* Mobile Toggle */}
      <button
        onClick={onMenuToggle}
        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Toggle */}
      <button
        onClick={onMenuToggle}
        className="hidden lg:flex p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Page Title & Breadcrumb */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-sm sm:text-base font-black text-slate-900 truncate tracking-tight">{pageTitle}</h1>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-full shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>SIH PS: 26034 • Ministry of Consumer Affairs</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-500 font-medium hidden md:block truncate">
          {t('deptName')}
        </p>
      </div>

      {/* Bilingual Language Switcher */}
      <LanguageToggle variant="light" />

      {/* Quick Action: New Inspection */}
      <button
        onClick={() => navigate('/inspect/new')}
        className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer btn-press"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{lang === 'hi' ? 'नया निरीक्षण' : 'New Inspection'}</span>
      </button>

      {/* Switch to Consumer Portal Button */}
      <button
        onClick={() => {
          authService.logout();
          navigate('/login');
        }}
        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 btn-press"
        title="Switch to Consumer Verification Desk"
      >
        <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">{t('consumerDesk')}</span>
      </button>

      {/* Officer Badge */}
      {user && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold text-slate-800">{user.name}</div>
            <div className="text-[10px] text-indigo-600 font-mono font-semibold">{user.inspectorId}</div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
            {user.avatarInitials || 'RK'}
          </div>
        </div>
      )}
    </header>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const officerMobileTabs = [
    { path: '/dashboard', labelEn: 'Overview', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
    { path: '/history', labelEn: 'Records', labelHi: 'रिकॉर्ड्स', icon: ClipboardList },
    { path: '/inspect/new', labelEn: 'Inspect', labelHi: 'निरीक्षण', icon: Plus, isHero: true },
    { path: '/analytics', labelEn: 'Analytics', labelHi: 'एनालिटिक्स', icon: BarChart2 },
    { path: '/rules', labelEn: 'Rules', labelHi: 'नियम', icon: ShieldCheck },
  ];

  return (
    <div
      className="min-h-screen font-sans selection:bg-indigo-600 selection:text-white"
      style={{
        background: `
          radial-gradient(circle at 5% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 95% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
          linear-gradient(150deg, #f8fafc 0%, #f1f5f9 50%, #eff6ff 100%)
        `
      }}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      <TopBar onMenuToggle={() => setSidebarCollapsed(c => !c)} sidebarCollapsed={sidebarCollapsed} />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 pb-28 lg:pb-28 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 page-enter">
          {children}

          <OfficialGovFooter />
        </div>
      </main>

      {/* ── App-Style Officer Bottom Navigation Bar (Visible on All Devices with Floating Dock on Desktop) ── */}
      <nav
        className="fixed bottom-0 sm:bottom-4 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-lg md:max-w-xl z-40 sm:rounded-3xl border-t sm:border border-slate-200/90 shadow-2xl transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          boxShadow: '0 10px 35px -5px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(0,0,0,0.05)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
        }}
      >
        <div className="flex items-center justify-around px-3 pt-2 pb-1">
          {officerMobileTabs.map(tab => {
            const Icon = tab.icon;
            const active = location.pathname === tab.path || (tab.path !== '/dashboard' && location.pathname.startsWith(tab.path));
            const label = lang === 'hi' ? tab.labelHi : tab.labelEn;

            if (tab.isHero) {
              return (
                <div key={tab.path} className="flex-1 flex flex-col items-center justify-center -mt-6">
                  <button
                    onClick={() => navigate(tab.path)}
                    className={`w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white shadow-xl shadow-indigo-600/40 border-4 border-white flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                      active ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                    }`}
                    title="New Statutory Inspection"
                  >
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </button>
                  <span className="text-[10px] font-black text-indigo-700 mt-0.5">
                    {label}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex-1 flex flex-col items-center gap-0.5 py-1 btn-press cursor-pointer group"
              >
                <div className={`p-1.5 rounded-2xl transition-all duration-200 ${
                  active ? 'bg-indigo-100 text-indigo-700 shadow-xs' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold ${
                  active ? 'text-indigo-700 font-black' : 'text-slate-500'
                }`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
