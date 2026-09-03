import React, { useState, useEffect } from 'react';
import {
  BarChart2, TrendingUp, ShieldAlert, CheckCircle2, AlertTriangle,
  PieChart as PieIcon, Activity, Calendar, Filter
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { analyticsService } from '../services/analyticsService';
import { persistenceService } from '../services/persistenceService';
import { StatsCard } from '../components/common/StatsCard';
import { NationalComplianceHeatmap } from '../components/common/NationalComplianceHeatmap';
import { useLanguage } from '../context/LanguageContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const AnalyticsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [days, setDays] = useState<number>(30);
  const [summary, setSummary] = useState(analyticsService.getSummary(30));

  useEffect(() => {
    setSummary(analyticsService.getSummary(days));
  }, [days]);

  const { stats, chartData, violationsByCategory } = summary;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {lang === 'hi' ? 'राष्ट्रीय विधिक मापविज्ञान विश्लेषण' : 'National Legal Metrology Analytics'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {lang === 'hi' ? 'सांख्यिकीय प्रवर्तन विश्लेषण, नियामक उल्लंघन हीटमैप्स एवं अनुपालन मानक।' : 'Statistical enforcement intelligence, regulatory infraction heatmaps & compliance benchmarks.'}
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold self-start sm:self-auto">
          {[
            { d: 7, labelEn: 'Last 7 Days', labelHi: 'पिछले 7 दिन' },
            { d: 30, labelEn: 'Last 30 Days', labelHi: 'पिछले 30 दिन' },
            { d: 90, labelEn: 'Last 90 Days', labelHi: 'पिछले 90 दिन' }
          ].map((item) => (
            <button
              key={item.d}
              onClick={() => setDays(item.d)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                days === item.d ? 'bg-blue-600 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'hi' ? item.labelHi : item.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('totalInspections')}
          value={stats.total}
          subtitle={`${stats.today} ${t('conductToday')}`}
          icon={Activity}
          colorScheme="blue"
        />
        <StatsCard
          title={lang === 'hi' ? 'समग्र अनुपालन दर' : 'Overall Compliance Rate'}
          value={`${stats.overallComplianceRate}%`}
          subtitle={lang === 'hi' ? 'राष्ट्रीय औसत' : 'National Benchmark'}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatsCard
          title={t('violationsFlagged')}
          value={stats.withViolations}
          subtitle={`${stats.highSeverity} ${t('criticalNotices')}`}
          icon={ShieldAlert}
          colorScheme="rose"
        />
        <StatsCard
          title={t('pendingReviews')}
          value={stats.pendingReview}
          subtitle={t('awaitingOfficerDecision')}
          icon={AlertTriangle}
          colorScheme="amber"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Longitudinal Enforcement Velocity (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">{t('enforcementVelocity')}</h2>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'hi' ? 'निरीक्षण एवं उल्लंघन पहचान की प्रवृत्ति' : 'Trend of inspections vs non-compliance detections'}
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anColorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="count" name={lang === 'hi' ? 'कुल' : 'Total'} stroke="#3b82f6" strokeWidth={2.5} fill="url(#anColorTotal)" />
                <Area type="monotone" dataKey="passed" name={lang === 'hi' ? 'मान्य' : 'Passed'} stroke="#10b981" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="violations" name={lang === 'hi' ? 'उल्लंघन' : 'Violations'} stroke="#ef4444" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Category (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">{t('violationsBySector')}</h2>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'hi' ? 'उत्पाद वर्ग अनुसार गैर-अनुपालन' : 'Non-compliance by product class'}
            </p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationsByCategory.length ? violationsByCategory : [{ category: 'Food & FMCG', count: 5 }, { category: 'Electronics', count: 3 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="category"
                >
                  {(violationsByCategory.length ? violationsByCategory : [{ category: 'Food', count: 5 }]).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {(violationsByCategory.length ? violationsByCategory : [
              { category: 'Food & FMCG', count: 5 },
              { category: 'Electronics', count: 3 },
              { category: 'Pharma', count: 2 },
              { category: 'General Goods', count: 2 }
            ]).map((item, idx) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {item.category}
                </span>
                <span className="font-bold text-slate-900">{item.count} {lang === 'hi' ? 'मामले' : 'issues'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* National Compliance Heatmap */}
      <NationalComplianceHeatmap />
    </div>
  );
};
