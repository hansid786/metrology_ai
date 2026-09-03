import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Plus, ClipboardList, BarChart2, ShieldCheck,
  FileText, Settings, LogOut, Menu, X, ChevronRight, Activity, Shield,
  ArrowLeftRight, UserCheck
} from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';

const OFFICER_NAV_ITEMS = [
  { path: '/dashboard', labelEn: 'Dashboard Overview', labelHi: 'डैशबोर्ड अवलोकन', icon: LayoutDashboard },
  { path: '/inspect/new', labelEn: 'New Field Inspection', labelHi: 'नया क्षेत्रीय निरीक्षण', icon: Plus, highlight: true },
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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-all duration-300 shadow-2xl ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64 translate-x-0'
        }`}
      >
        {/* Government Identity Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800/80 min-h-[64px]">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-white font-black text-sm tracking-tight truncate">
                MetrologyLens <span className="text-blue-400 font-black">AI</span>
              </div>
              <div className="text-blue-400 text-[10px] font-bold uppercase tracking-wider truncate">
                {lang === 'hi' ? 'प्रवर्तन पोर्टल' : 'Enforcement Portal'}
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="ml-auto p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
          {OFFICER_NAV_ITEMS.map(({ path, labelEn, labelHi, icon: Icon, highlight }) => {
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
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : highlight
                    ? 'text-blue-400 hover:bg-blue-950/60 hover:text-blue-200 border border-blue-500/20 bg-blue-950/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{label}</span>
                    {highlight && (
                      <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Officer Profile & Switch Portal */}
        <div className="border-t border-slate-800/80 p-3 space-y-2">
          {!collapsed && user && (
            <div className="p-2.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {user.avatarInitials || 'RK'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white text-xs font-bold truncate">{user.name}</div>
                  <div className="text-[10px] text-blue-300 font-mono truncate">{user.inspectorId}</div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={collapsed ? (lang === 'hi' ? 'उपभोक्ता पोर्टल' : 'Switch to Consumer') : undefined}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-900/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
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
      className={`fixed top-0 right-0 left-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-30 flex items-center px-4 sm:px-6 gap-2 sm:gap-4 shadow-xs transition-all duration-300 ${
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
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold bg-blue-500/10 text-blue-700 border border-blue-500/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>SIH PS: 26034 • Department of Consumer Affairs (Target Portal)</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-500 font-medium hidden md:block truncate">
          {t('deptName')}
        </p>
      </div>

      {/* Bilingual Language Switcher */}
      <LanguageToggle />

      {/* Quick Action: New Inspection */}
      <button
        onClick={() => navigate('/inspect/new')}
        className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
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
        className="text-[11px] font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        title="Switch to Consumer Verification Desk"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t('consumerDesk')}</span>
      </button>

      {/* Officer Badge */}
      {user && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold text-slate-800">{user.name}</div>
            <div className="text-[10px] text-slate-500 font-mono">{user.inspectorId}</div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-black shadow-sm">
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      <TopBar onMenuToggle={() => setSidebarCollapsed(c => !c)} sidebarCollapsed={sidebarCollapsed} />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {children}

          {/* SIH Official Hackathon Disclaimer */}
          <footer className="pt-8 pb-4 text-center border-t border-slate-200/80">
            <p className="text-xs text-slate-400 font-medium">
              Prototype developed for Smart India Hackathon | Problem Statement ID: 26034. Demonstration Environment.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};
