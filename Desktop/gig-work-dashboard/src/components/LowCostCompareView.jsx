import React, { useState } from 'react';
import { 
  Coins, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function LowCostCompareView() {
  const [jobPrice, setJobPrice] = useState(500);

  // Gig Work Math (5% total cap)
  const gigWorkerGets = Math.round(jobPrice * 0.95);
  const gigFee = jobPrice - gigWorkerGets;

  // Traditional Corporate Aggregator Math (35% markup + extraction)
  const bigAppCustomerPays = Math.round(jobPrice * 1.35);
  const bigAppWorkerGets = Math.round(bigAppCustomerPays * 0.65);
  const bigAppCommission = bigAppCustomerPays - bigAppWorkerGets;

  const customerSavings = bigAppCustomerPays - jobPrice;
  const workerExtraIncome = gigWorkerGets - bigAppWorkerGets;

  const presetAmounts = [350, 500, 850, 1200, 2500, 5000];

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
          Transparent Math
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Transparent Pricing Calculator
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          See exactly how our low-commission cooperative model delivers fair value to both customers and workers.
        </p>
      </div>

      {/* Simulator Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Slider & Presets */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <span className="text-xs font-semibold text-slate-700">Adjust Service Amount:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {presetAmounts.map((p) => (
                <button
                  key={p}
                  onClick={() => setJobPrice(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    jobPrice === p
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ₹{p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
            <span className="text-xs text-slate-500 font-medium">Selected Job Value</span>
            <span className="text-2xl font-black text-slate-900 font-mono">₹{jobPrice}</span>
          </div>

          <input
            type="range"
            min="200"
            max="5000"
            step="50"
            value={jobPrice}
            onChange={(e) => setJobPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
        </div>

        {/* Side by Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          {/* Gig Work Model */}
          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Gig Work Platform</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                95% Worker Share
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-emerald-100 text-slate-600">
                <span>Customer Pays:</span>
                <span className="font-mono font-bold text-slate-900">₹{jobPrice}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-100 text-slate-900 font-semibold">
                <span>Worker Take-Home:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">₹{gigWorkerGets}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 text-[11px]">
                <span>Platform Ops (5%):</span>
                <span className="font-mono text-slate-700">₹{gigFee}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Customer saves ₹{customerSavings} with direct payment</span>
            </div>
          </div>

          {/* Corporate Aggregator */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Corporate Aggregators</span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                35%+ Margin
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-slate-600">
                <span>Customer Invoiced:</span>
                <span className="font-mono font-bold text-slate-900">₹{bigAppCustomerPays}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-slate-600">
                <span>Worker Take-Home:</span>
                <span className="font-mono font-bold text-slate-700 text-sm">₹{bigAppWorkerGets}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400 text-[11px]">
                <span>Company Deduction:</span>
                <span className="font-mono text-slate-600">₹{bigAppCommission}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Worker loses ₹{workerExtraIncome} in platform cuts</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
