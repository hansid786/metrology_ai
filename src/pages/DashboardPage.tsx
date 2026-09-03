import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, CheckCircle2, AlertOctagon, Clock, Plus, FileText,
  TrendingUp, PieChart as PieIcon, ChevronRight, Download, ShieldCheck
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { persistenceService } from '../services/persistenceService';
import { authService } from '../services/authService';
import { generateLegalInspectionReportPDF } from '../utils/pdfGenerator';
import { StatusBadge } from '../components/common/Badge';
import { DashboardStats, SavedInspection } from '../types/inspection';
import { useLanguage } from '../context/LanguageContext';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { lang, t } = useLanguage();

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    today: 0,
    passed: 0,
    withViolations: 0,
    highSeverity: 0,
    pendingReview: 0,
    overallComplianceRate: 0,
  });

  const [chartData, setChartData] = useState<{ date: string; count: number; passed: number; violations: number }[]>([]);
  const [violationsByCategory, setViolationsByCategory] = useState<{ category: string; count: number }[]>([]);
  const [topViolations, setTopViolations] = useState<{ name: string; count: number }[]>([]);
  const [recentInspections, setRecentInspections] = useState<SavedInspection[]>([]);

  useEffect(() => {
    setStats(persistenceService.getStats());
    setChartData(persistenceService.getChartData(14));
    setViolationsByCategory(persistenceService.getViolationsByCategory());
    setTopViolations(persistenceService.getTopViolations());
    setRecentInspections(persistenceService.getAll().slice(0, 5));
  }, []);

  const handleDownloadPDF = (insp: SavedInspection, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = generateLegalInspectionReportPDF(insp.result);
    doc.save(`Legal_Inspection_Report_${insp.metadata.inspectionId}.pdf`);
  };

  const sectorFallback = [
    { category: lang === 'hi' ? 'खाद्य एवं उपभोक्ता' : 'Food & FMCG', count: 5 },
    { category: lang === 'hi' ? 'इलेक्ट्रॉनिक्स' : 'Electronics', count: 3 },
    { category: lang === 'hi' ? 'दवा व स्वास्थ्य' : 'Pharma', count: 2 },
    { category: lang === 'hi' ? 'सामान्य वस्तुएं' : 'General Goods', count: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Officer Welcome & Quick Actions Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'hi' ? 'राष्ट्रीय विधिक मापविज्ञान प्रवर्तन प्रभाग' : 'National Metrology Enforcement Division'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {t('officerDashboard')} · {user?.name || 'Officer Ravi Kumar'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
            {user?.designation || 'Legal Metrology Officer'} • Zone: {user?.zone || 'NCT of Delhi'}. {lang === 'hi' ? 'वास्तविक समय अनुपालन निगरानी एवं वैधानिक साक्ष्य मैट्रिक्स।' : 'Real-time compliance monitoring & statutory evidence matrix.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => navigate('/inspect/new')}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t('startNewInspection')}</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{t('formPC1Reports')}</span>
          </button>
        </div>

        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Big KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('totalInspections')}
          value={stats.total}
          subtitle={`${stats.today} ${t('conductToday')}`}
          icon={ClipboardCheck}
          colorScheme="blue"
        />
        <StatsCard
          title={t('fullyCompliant')}
          value={stats.passed}
          subtitle={`${Math.round((stats.passed / (stats.total || 1)) * 100)}% ${t('passRate')}`}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatsCard
          title={t('violationsFlagged')}
          value={stats.withViolations}
          subtitle={`${stats.highSeverity} ${t('criticalNotices')}`}
          icon={AlertOctagon}
          colorScheme="rose"
        />
        <StatsCard
          title={t('pendingReviews')}
          value={stats.pendingReview}
          subtitle={t('awaitingOfficerDecision')}
          icon={Clock}
          colorScheme="amber"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inspection Velocity Trend (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">{t('enforcementVelocity')}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'hi' ? 'दैनिक निरीक्षण गतिविधि एवं नियम अनुपालन दर' : 'Daily inspection counts vs non-compliance detections'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                {lang === 'hi' ? 'कुल' : 'Total'}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {lang === 'hi' ? 'मान्य' : 'Passed'}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                {lang === 'hi' ? 'उल्लंघन' : 'Violations'}
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="count" name={lang === 'hi' ? 'कुल' : 'Total'} stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="passed" name={lang === 'hi' ? 'मान्य' : 'Passed'} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPass)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Category (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">{t('violationsBySector')}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'hi' ? 'उत्पाद वर्ग अनुसार गैर-अनुपालन' : 'Non-compliance by product class'}
              </p>
            </div>
            <PieIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationsByCategory.length ? violationsByCategory : sectorFallback}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="category"
                >
                  {(violationsByCategory.length ? violationsByCategory : sectorFallback).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {(violationsByCategory.length ? violationsByCategory : sectorFallback).map((item, idx) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600 font-medium truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="truncate">{item.category}</span>
                </span>
                <span className="font-bold text-slate-900 shrink-0">{item.count} {lang === 'hi' ? 'मामले' : 'issues'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Inspections & Common Breach Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Inspections Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">{t('recentDockets')}</h2>
              <p className="text-xs text-slate-500 font-medium">{t('clickDocketInspect')}</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('viewAll')} ({stats.total})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentInspections.map((insp) => (
              <div
                key={insp.id}
                onClick={() => navigate(`/history/${insp.id}`)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-2xl px-2 transition-colors cursor-pointer group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {insp.metadata.inspectionId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(insp.metadata.dateTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 truncate mt-1">
                    {insp.metadata.productName} — ₹{insp.result.pricing.mrpAmount.toFixed(0)}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {insp.metadata.establishmentName} • {insp.metadata.location}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={insp.result.overallStatus} size="sm" />
                  <button
                    onClick={(e) => handleDownloadPDF(insp, e)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title={lang === 'hi' ? 'फॉर्म PC-1 डाउनलोड करें' : 'Download Form PC-1 PDF'}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Breached Clauses Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">{t('commonBreachClauses')}</h2>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'hi' ? 'प्रवर्तन ऑडिट में पाए गए मुख्य उल्लंघन' : 'Frequent violations across enforcement audits'}
            </p>
          </div>

          <div className="space-y-2">
            {(topViolations.length ? topViolations : [
              { name: lang === 'hi' ? 'USP अधिक वसूली (नियम 6(1)(e))' : 'USP Overcharging (Rule 6(1)(e))', count: 4 },
              { name: lang === 'hi' ? 'अनुपस्थित इकाई विक्रय मूल्य' : 'Missing Unit Sale Price', count: 3 },
              { name: lang === 'hi' ? 'फॉन्ट आकार उल्लंघन (नियम 7(3))' : 'Font Size Under 1mm (Rule 7(3))', count: 2 },
              { name: lang === 'hi' ? 'अमान्य FSSAI / BIS घोषणा' : 'Invalid FSSAI / BIS Declaration', count: 1 }
            ]).map((v, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-800 truncate">{v.name}</span>
                <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                  {v.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  colorScheme: 'blue' | 'emerald' | 'rose' | 'amber';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, colorScheme }) => {
  const styles = {
    blue: { bg: 'bg-blue-50/80 border-blue-200', text: 'text-blue-600', valText: 'text-blue-950' },
    emerald: { bg: 'bg-emerald-50/80 border-emerald-200', text: 'text-emerald-600', valText: 'text-emerald-950' },
    rose: { bg: 'bg-rose-50/80 border-rose-200', text: 'text-rose-600', valText: 'text-rose-950' },
    amber: { bg: 'bg-amber-50/80 border-amber-200', text: 'text-amber-600', valText: 'text-amber-950' },
  }[colorScheme];

  return (
    <div className={`p-4 sm:p-5 rounded-3xl border ${styles.bg} shadow-sm space-y-2 transition-all hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-700 tracking-tight">{title}</span>
        <div className={`p-2 rounded-xl bg-white shadow-2xs ${styles.text}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className={`text-2xl sm:text-3xl font-black font-mono ${styles.valText}`}>
          {value}
        </div>
        <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
};
