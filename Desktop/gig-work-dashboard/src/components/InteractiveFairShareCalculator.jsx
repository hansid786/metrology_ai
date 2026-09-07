import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  Sliders, 
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function InteractiveFairShareCalculator() {
  const [jobPrice, setJobPrice] = useState(500);
  const [monthlyJobs, setMonthlyJobs] = useState(25);

  // Gig Work Cooperative Math:
  // Worker: 95%
  // Cooperative Welfare: 3%
  // Platform Ops: 2%
  const coopWorkerPayout = Math.round(jobPrice * 0.95);
  const coopWelfareCut = Math.max(5, Math.round(jobPrice * 0.03));
  const coopPlatformFee = Math.max(5, jobPrice - coopWorkerPayout - coopWelfareCut);

  // Traditional Corporate Aggregator Math:
  // Worker: 65% (after 28% app fee + 5% GST + lead cost + penalty risk)
  // App Cut: 35%
  const tradWorkerPayout = Math.round(jobPrice * 0.65);
  const tradAppCut = jobPrice - tradWorkerPayout;

  // Differences:
  const perJobWorkerExtra = coopWorkerPayout - tradWorkerPayout;
  const monthlyWorkerExtra = perJobWorkerExtra * monthlyJobs;
  const annualWorkerExtra = monthlyWorkerExtra * 12;

  const presetPrices = [350, 500, 850, 1200, 2500, 5000];

  return (
    <div id="calculator-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm my-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">Interactive Fair-Share Simulator</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Calculator
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Simulate any service fee to observe how Gig Work's low commission model protects worker livelihood.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1">Quick Presets:</span>
          {presetPrices.map((preset) => (
            <button
              key={preset}
              onClick={() => setJobPrice(preset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                jobPrice === preset
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ₹{preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Service Price Slider */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Customer Service Price
              </label>
              <div className="flex items-center bg-white border border-slate-300 rounded-xl px-3 py-1 text-base font-extrabold text-slate-900 font-mono">
                <span className="text-slate-400 mr-1">₹</span>
                <input
                  type="number"
                  min="100"
                  max="15000"
                  step="50"
                  value={jobPrice}
                  onChange={(e) => setJobPrice(Math.max(50, Number(e.target.value)))}
                  className="w-20 font-bold focus:outline-none text-right"
                />
              </div>
            </div>

            <input
              type="range"
              min="200"
              max="10000"
              step="50"
              value={jobPrice}
              onChange={(e) => setJobPrice(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-2">
              <span>₹200 (Switch Repair)</span>
              <span>₹500 (Base Plumbing)</span>
              <span>₹2,500 (Full Deep Clean)</span>
              <span>₹10,000 (House Painting)</span>
            </div>
          </div>

          {/* Monthly Jobs Frequency Slider */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Worker Jobs Per Month
              </label>
              <span className="font-extrabold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-1 text-sm font-mono">
                {monthlyJobs} jobs/month
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={monthlyJobs}
              onChange={(e) => setMonthlyJobs(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-2">
              <span>5 (Part-time)</span>
              <span>25 (Average Full-time)</span>
              <span>60 (High Volume)</span>
            </div>
          </div>

          {/* Key Annual Wealth Impact Box */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-lg border border-emerald-700/50">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Annual Worker Wealth Retained
            </div>
            <div className="text-3xl font-black text-white font-mono mt-2 tracking-tight">
              +₹{annualWorkerExtra.toLocaleString('en-IN')}
            </div>
            <p className="text-emerald-200 text-xs mt-1">
              Extra income that stays with the worker and local community instead of venture capital aggregators!
            </p>
            <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-300 font-semibold">
              <span>+₹{monthlyWorkerExtra.toLocaleString('en-IN')}/mo in direct wallet</span>
              <span>+46.1% Higher Earnings</span>
            </div>
          </div>

        </div>

        {/* Live Comparison Breakdown Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Side by Side Split Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Gig Work Cooperative Card */}
            <div className="bg-emerald-50/60 rounded-2xl p-5 border-2 border-emerald-500 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Gig Work Model
              </div>

              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm mb-4">
                <HeartHandshake className="w-5 h-5 text-emerald-700" />
                <span>Cooperative Platform</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Customer Paid:</span>
                    <span className="font-bold text-slate-900 font-mono">₹{jobPrice}</span>
                  </div>
                </div>

                <div className="bg-emerald-100/90 p-3.5 rounded-xl border border-emerald-300">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-emerald-950 text-sm">Worker Direct Payout:</span>
                    <span className="text-xl font-black text-emerald-800 font-mono">₹{coopWorkerPayout}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                    95% deposited immediately to worker UPI
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Cooperative Welfare (3%):</span>
                    </span>
                    <span className="font-bold font-mono text-amber-700">₹{coopWelfareCut}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-teal-600" />
                      <span>Platform Cloud & Ops (2%):</span>
                    </span>
                    <span className="font-bold font-mono text-teal-700">₹{coopPlatformFee}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero hidden surge markups or lead fees</span>
              </div>
            </div>

            {/* Traditional Corporate Aggregator Card */}
            <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Corporate App
              </div>

              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm mb-4">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>High-Commission App</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-rose-200">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Customer Paid:</span>
                    <span className="font-bold text-slate-900 font-mono">₹{jobPrice}</span>
                  </div>
                </div>

                <div className="bg-rose-100/80 p-3.5 rounded-xl border border-rose-300">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-rose-950 text-sm">Worker Take-Home:</span>
                    <span className="text-xl font-black text-rose-800 font-mono">₹{tradWorkerPayout}</span>
                  </div>
                  <span className="text-[11px] text-rose-700 font-semibold mt-0.5 block">
                    Only ~65% after heavy algorithmic deductions
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-2">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>App Platform Cut (28%):</span>
                    <span className="font-bold font-mono text-rose-700">₹{Math.round(jobPrice * 0.28)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Lead Fees, GST & Penalties:</span>
                    <span className="font-bold font-mono text-rose-700">₹{tradAppCut - Math.round(jobPrice * 0.28)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200 text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Worker loses ₹{perJobWorkerExtra} on every single job</span>
              </div>
            </div>

          </div>

          {/* Visual Percentage Comparison Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-2">Revenue Share Comparison (% of Customer Payment)</p>
            
            {/* Gig Work Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span className="text-emerald-800 font-bold">Gig Work Cooperative (95% Worker / 3% Welfare / 2% Tech)</span>
                <span className="text-emerald-800 font-mono font-bold">₹{coopWorkerPayout}</span>
              </div>
              <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div style={{ width: '95%' }} className="bg-emerald-600 transition-all duration-300"></div>
                <div style={{ width: '3%' }} className="bg-amber-500 transition-all duration-300"></div>
                <div style={{ width: '2%' }} className="bg-teal-600 transition-all duration-300"></div>
              </div>
            </div>

            {/* Corporate Aggregator Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span className="text-rose-800 font-bold">Corporate Aggregator App (65% Worker / 35% Extracted)</span>
                <span className="text-rose-800 font-mono font-bold">₹{tradWorkerPayout}</span>
              </div>
              <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div style={{ width: '65%' }} className="bg-rose-500 transition-all duration-300"></div>
                <div style={{ width: '35%' }} className="bg-slate-700 transition-all duration-300"></div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
