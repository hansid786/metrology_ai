import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Wallet, 
  ShieldCheck, 
  HeartHandshake, 
  Info,
  Layers,
  Percent,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function HeroFairShareBanner({ onExploreCalculator }) {
  const [modelType, setModelType] = useState('cooperative'); // 'cooperative' | 'traditional'

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden my-6">
      
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            The Fair-Share Cooperative Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer <span className="text-emerald-400">→</span> Local Worker <span className="text-emerald-400">→</span> Cooperative <span className="text-emerald-400">→</span> Fair Earnings
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Unlike corporate aggregators that take 25%–35% cuts and squeeze blue-collar labor, Gig Work keeps platform fees at an ultra-low fixed ₹10–₹25. Workers take home 95%+ directly to their UPI with collective welfare protection.
          </p>
        </div>

        {/* Model Toggle */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-600/60 self-start md:self-auto shrink-0">
          <button
            onClick={() => setModelType('cooperative')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              modelType === 'cooperative'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-emerald-200" />
            Gig Work Cooperative Model
          </button>
          <button
            onClick={() => setModelType('traditional')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              modelType === 'traditional'
                ? 'bg-rose-900/80 text-rose-100 shadow-lg shadow-rose-950/40 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            Corporate Aggregator Model
          </button>
        </div>
      </div>

      {/* Main Visual Breakdown of ₹500 Transaction */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Step-by-Step Flow Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
          
          {/* Step 1: Customer */}
          <div className="bg-slate-800/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Step 1</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">Customer</span>
              </div>
              <p className="text-sm font-bold text-white">Local Customer Pays</p>
              <div className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">₹500</div>
              <p className="text-[11px] text-slate-400 mt-1">Direct booking, transparent quote, no hidden surge fees</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Direct connection</span>
            </div>
          </div>

          {/* Step 2: Worker Payout */}
          <div className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
            modelType === 'cooperative'
              ? 'bg-emerald-900/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
              : 'bg-rose-950/30 border-rose-800/50'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Step 2</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  modelType === 'cooperative' ? 'bg-emerald-500/30 text-emerald-200' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  Worker Receives
                </span>
              </div>
              <p className="text-sm font-bold text-white">Local Worker UPI</p>
              <div className={`text-2xl font-extrabold mt-2 font-mono ${
                modelType === 'cooperative' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {modelType === 'cooperative' ? '₹475.00' : '₹325.00'}
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                {modelType === 'cooperative' 
                  ? '95% kept directly in worker bank account instantly' 
                  : 'Only 65% left after 30% platform cut + GST + lead charges'}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] font-semibold flex items-center gap-1">
              {modelType === 'cooperative' ? (
                <span className="text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  +₹150 more in worker's pocket
                </span>
              ) : (
                <span className="text-rose-300 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  -₹150 heavy deduction
                </span>
              )}
            </div>
          </div>

          {/* Step 3: Cooperative Welfare */}
          <div className="bg-slate-800/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Step 3</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">Welfare Pool</span>
              </div>
              <p className="text-sm font-bold text-white">Guild Welfare Fund</p>
              <div className="text-2xl font-extrabold text-amber-400 mt-2 font-mono">
                {modelType === 'cooperative' ? '₹15.00' : '₹0.00'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {modelType === 'cooperative'
                  ? '3% reserved for worker health cover & 0% interest tool loans'
                  : 'Traditional apps offer zero worker collective equity or safety'}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{modelType === 'cooperative' ? 'Worker Owned Pool' : 'No Social Security'}</span>
            </div>
          </div>

          {/* Step 4: Platform Fee */}
          <div className="bg-slate-800/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Step 4</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-500/30 text-slate-300 text-[10px] font-bold">Platform Ops</span>
              </div>
              <p className="text-sm font-bold text-white">Cloud Tech & Ops</p>
              <div className="text-2xl font-extrabold text-slate-300 mt-2 font-mono">
                {modelType === 'cooperative' ? '₹10.00' : '₹175.00'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {modelType === 'cooperative'
                  ? '2% minimal server & verification overhead'
                  : 'Extractive 35% commission retained by venture shareholders'}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{modelType === 'cooperative' ? 'Non-profit Tech Layer' : '35% Private Margin'}</span>
            </div>
          </div>

        </div>

        {/* Right Side: Quick Comparison Summary Card */}
        <div className="lg:col-span-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Cooperative Advantage</span>
              <span className="bg-emerald-500 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full">
                95% PAYOUT
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <span className="text-slate-400">Worker Commission Rate:</span>
                <span className="font-mono font-bold text-emerald-300">2% - 5% (Capped)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <span className="text-slate-400">Payout Settlement:</span>
                <span className="font-bold text-emerald-300">Instant UPI Direct to Worker</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <span className="text-slate-400">Worker Governance:</span>
                <span className="font-bold text-slate-100">Local Ward Trade Guilds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Worker Welfare Fund:</span>
                <span className="font-bold text-amber-300">₹2L Medical + 0% Tool Loan</span>
              </div>
            </div>
          </div>

          <button
            onClick={onExploreCalculator}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>Test Real-Time Commission Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
