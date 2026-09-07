import React from 'react';
import { 
  Users, 
  UserCheck, 
  Coins, 
  Percent, 
  ShieldCheck, 
  CalendarCheck, 
  Star, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export default function MetricsOverview({ workersCount, activeWorkersCount, totalBookingsCount, onSelectMetric }) {
  const metrics = [
    {
      id: 'worker-earnings',
      title: 'Worker Retained Earnings',
      value: '₹48,24,900',
      subtitle: '95.2% payout ratio to worker accounts',
      change: '+18.4% vs last month',
      isPositive: true,
      icon: Coins,
      iconColor: 'text-emerald-700 bg-emerald-100',
      borderAccent: 'hover:border-emerald-400',
      badge: '95% Payout'
    },
    {
      id: 'active-workers',
      title: 'Local Workers Onboarded',
      value: `${workersCount || '3,480'}`,
      subtitle: `${activeWorkersCount || '2,140'} actively available today across 18 trades`,
      change: '+142 self-registered this week',
      isPositive: true,
      icon: Users,
      iconColor: 'text-blue-700 bg-blue-100',
      borderAccent: 'hover:border-blue-400',
      badge: 'Self-Listed'
    },
    {
      id: 'coop-welfare',
      title: 'Cooperative Welfare Fund',
      value: '₹3,84,500',
      subtitle: 'Reserved for ₹2L Health & 0% Tool Microloans',
      change: '+₹38,200 added this month',
      isPositive: true,
      icon: HeartHandshake,
      iconColor: 'text-amber-700 bg-amber-100',
      borderAccent: 'hover:border-amber-400',
      badge: 'Worker Owned'
    },
    {
      id: 'platform-fee',
      title: 'Avg Platform Take-Rate',
      value: '3.2%',
      subtitle: '₹10–₹25 flat tech fee (Zero surge cuts)',
      change: 'Fixed 2% ops + 3% welfare',
      isPositive: true,
      icon: Percent,
      iconColor: 'text-teal-700 bg-teal-100',
      borderAccent: 'hover:border-teal-400',
      badge: 'Ultra-Low Cap'
    },
    {
      id: 'bookings',
      title: 'Completed Direct Bookings',
      value: '14,920',
      subtitle: 'Direct customer-to-worker dispatches',
      change: '+22.6% month-over-month',
      isPositive: true,
      icon: CalendarCheck,
      iconColor: 'text-indigo-700 bg-indigo-100',
      borderAccent: 'hover:border-indigo-400',
      badge: 'Direct Connect'
    },
    {
      id: 'trust-rating',
      title: 'Trust & Peer Rating',
      value: '4.91 / 5.0',
      subtitle: 'Based on 11,280 verified locality reviews',
      change: '99.4% dispute-free rate',
      isPositive: true,
      icon: Star,
      iconColor: 'text-orange-700 bg-orange-100',
      borderAccent: 'hover:border-orange-400',
      badge: 'Ward Verified'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.id}
            onClick={() => onSelectMetric && onSelectMetric(metric.id)}
            className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group ${metric.borderAccent}`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${metric.iconColor} transition-transform group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {metric.badge}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{metric.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{metric.value}</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">{metric.subtitle}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{metric.change}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
