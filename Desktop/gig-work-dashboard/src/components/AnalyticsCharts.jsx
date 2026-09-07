import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  Wrench, 
  PieChart as PieIcon, 
  BarChart3, 
  Layers, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { MONTHLY_TRENDS, COOPERATIVE_WELFARE_PROGRAMS } from '../data/mockData';

const TRADE_DISTRIBUTION = [
  { name: 'Electricians', count: 860, color: '#10b981' },
  { name: 'Plumbers', count: 640, color: '#06b6d4' },
  { name: 'Deep Cleaners & Domestic', count: 720, color: '#3b82f6' },
  { name: 'Carpenters', count: 480, color: '#f59e0b' },
  { name: 'AC & Appliance Techs', count: 410, color: '#8b5cf6' },
  { name: 'Painters', count: 210, color: '#ec4899' },
  { name: 'Drivers & Gardeners', count: 160, color: '#14b8a6' },
];

const WELFARE_ALLOCATION = [
  { name: 'Suraksha Medical Cover (₹2L)', value: 45, color: '#10b981' },
  { name: 'Zero% Tool Loans', value: 25, color: '#3b82f6' },
  { name: 'Children Vidya Stipends', value: 18, color: '#f59e0b' },
  { name: 'Monsoon/Emergency Relief', value: 12, color: '#8b5cf6' },
];

export default function AnalyticsCharts() {
  const [activeTab, setActiveTab] = useState('wealth'); // 'wealth' | 'trades' | 'welfare'

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
          <p className="font-bold text-slate-200 mb-1">{label}</p>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2 my-0.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-slate-300">{item.name}:</span>
              <span className="font-bold font-mono text-white">
                {item.name.includes('Jobs') ? `${item.value} bookings` : `₹${item.value} Lakhs`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs my-6">
      
      {/* Header with Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Cooperative Ecosystem Analytics</h2>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Real-time Metrics
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Transparent tracking of wealth retained by workers, trade diversity, and cooperative welfare reserves.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveTab('wealth')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'wealth'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Retained Wealth Growth</span>
          </button>

          <button
            onClick={() => setActiveTab('trades')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'trades'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Worker Trades</span>
          </button>

          <button
            onClick={() => setActiveTab('welfare')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'welfare'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Welfare Pool</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Wealth Retained vs Aggregator Take */}
      {activeTab === 'wealth' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Worker Retained Wealth</span>
              <div className="text-2xl font-black text-emerald-900 font-mono mt-1">₹48.2 Lakhs</div>
              <p className="text-[11px] text-emerald-700 mt-1">Directly paid to 3,480 workers via UPI this month</p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Cooperative Welfare Reserve</span>
              <div className="text-2xl font-black text-amber-900 font-mono mt-1">₹1.92 Lakhs</div>
              <p className="text-[11px] text-amber-700 mt-1">Automated 3% pool for worker health & tool security</p>
            </div>

            <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Wealth Saved From 30% App Cuts</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">₹15.4 Lakhs</div>
              <p className="text-[11px] text-slate-600 mt-1">Saved from extractive corporate commission</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="workerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="corpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="L" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="workerRetained" 
                  name="Worker Retained (Gig Work)" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#workerGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="corporateAppTake" 
                  name="Corporate Aggregator Extraction (30% model)" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#corpGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Worker Retained Earnings (₹ Lakhs)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>Money Saved From Corporate Cuts (₹ Lakhs)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trade Breakdown */}
      {activeTab === 'trades' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRADE_DISTRIBUTION} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  formatter={(value) => [`${value} Registered Workers`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {TRADE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Registered Local Trades</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {TRADE_DISTRIBUTION.map((trade, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: trade.color }}></span>
                    <span className="font-semibold text-slate-800">{trade.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{trade.count}</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-xs font-medium">
              💡 <strong>Direct Listing:</strong> Workers register their own hourly/visit rate and define their local ward radius.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Welfare Pool Programs */}
      {activeTab === 'welfare' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COOPERATIVE_WELFARE_PROGRAMS.map((prog) => (
              <div key={prog.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {prog.tag}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{prog.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{prog.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Beneficiaries</span>
                    <span className="font-bold text-slate-800 font-mono">{prog.activeEnrollees}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Disbursed</span>
                    <span className="font-bold text-emerald-700 font-mono">{prog.disbursedThisYear}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-800 text-emerald-200">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm">3% Transparent Cooperative Allocation</h5>
                <p className="text-xs text-emerald-200">
                  Every booking automatically diverts 3% to worker social security and 0% interest tool purchase pool.
                </p>
              </div>
            </div>
            <div className="bg-emerald-800/80 px-4 py-2 rounded-xl text-center shrink-0 border border-emerald-600/60">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Current Pool Balance</span>
              <span className="text-lg font-black text-white font-mono">₹3,84,500</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
