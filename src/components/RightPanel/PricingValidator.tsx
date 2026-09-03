import React, { useState } from 'react';
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Sliders, 
  RotateCcw,
  Scale,
  Equal
} from 'lucide-react';
import { PricingIntelligence } from '../../types/inspection';
import { calculatePricingIntelligence } from '../../services/complianceEngine';

interface PricingValidatorProps {
  pricing: PricingIntelligence;
}

export const PricingValidator: React.FC<PricingValidatorProps> = ({
  pricing,
}) => {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [sandboxMRP, setSandboxMRP] = useState(pricing.mrpAmount);
  const [sandboxNetQty, setSandboxNetQty] = useState(pricing.netQuantityValue);
  const [sandboxUnit, setSandboxUnit] = useState(pricing.netQuantityUnit);
  const [sandboxPrintedUSP, setSandboxPrintedUSP] = useState(pricing.printedUSPText || '');

  const livePricing = isSandboxOpen 
    ? calculatePricingIntelligence(sandboxMRP, sandboxNetQty, sandboxUnit, sandboxPrintedUSP)
    : pricing;

  const handleResetSandbox = () => {
    setSandboxMRP(pricing.mrpAmount);
    setSandboxNetQty(pricing.netQuantityValue);
    setSandboxUnit(pricing.netQuantityUnit);
    setSandboxPrintedUSP(pricing.printedUSPText || '');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden">
      {/* Header Banner with Premium Gradient Accent */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-400/30 shadow-inner">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Pricing Intelligence Engine
              </h3>
              <span className="text-[10px] font-extrabold uppercase bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2.5 py-0.5 rounded-full">
                Rule 6(1)(e) Audit
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Automated Mathematical Unit Sale Price (USP) Verification
            </p>
          </div>
        </div>

        {/* Sandbox Button */}
        <button
          onClick={() => setIsSandboxOpen(!isSandboxOpen)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
            isSandboxOpen
              ? 'bg-blue-600 text-white border-blue-400 shadow-md'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isSandboxOpen ? 'Close Calculator' : 'Interactive Sandbox'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Visual Math Equation Banner */}
        <div className="p-3.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50/80 rounded-xl border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-blue-950 font-bold text-xs">
            <Scale className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Statutory Metric Formula:</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-900 bg-white/90 px-3 py-1 rounded-lg border border-blue-200 shadow-2xs">
            <span>Expected USP</span>
            <Equal className="w-3.5 h-3.5 text-blue-500" />
            <span>MRP (₹{livePricing.mrpAmount}) ÷ Net Qty ({livePricing.standardizedQuantity}{livePricing.standardUnit})</span>
          </div>
        </div>

        {/* 3 Step Comparison Cards with High Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. Declared Packaging Data */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">1. Packaging Surface</span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">Declared</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-500 font-medium">Declared MRP:</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">₹{livePricing.mrpAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-500 font-medium">Net Quantity:</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">{livePricing.netQuantityValue} {livePricing.netQuantityUnit}</span>
              </div>
            </div>
          </div>

          {/* 2. Calculated Rate (Truth) */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/70 rounded-2xl border-2 border-blue-300 space-y-2 shadow-xs ring-2 ring-blue-500/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold text-blue-700 tracking-wider">2. Expected Unit Rate</span>
              <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">Calculated Math</span>
            </div>
            <div className="pt-0.5">
              <div className="text-2xl font-black font-mono text-blue-900 tracking-tight">
                ₹{livePricing.calculatedUSPAmount.toFixed(2)} <span className="text-xs font-bold text-blue-700">/ {livePricing.calculatedUSPUnit}</span>
              </div>
              <p className="text-[11px] text-blue-600 mt-1 font-mono font-medium">
                ₹{livePricing.mrpAmount} ÷ {livePricing.standardizedQuantity}{livePricing.standardUnit}
              </p>
            </div>
          </div>

          {/* 3. Printed on Packaging */}
          <div className={`p-4 rounded-2xl border-2 space-y-2 shadow-xs ${
            livePricing.isDiscrepancy 
              ? 'bg-gradient-to-br from-rose-50 to-red-50/70 border-rose-300 ring-2 ring-rose-500/10' 
              : 'bg-gradient-to-br from-emerald-50 to-teal-50/70 border-emerald-300 ring-2 ring-emerald-500/10'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase font-extrabold tracking-wider ${
                livePricing.isDiscrepancy ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                3. Printed On Label
              </span>
              {livePricing.isDiscrepancy ? (
                <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">Mismatch</span>
              ) : (
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Verified OK</span>
              )}
            </div>
            <div className="pt-0.5">
              <div className={`text-2xl font-black font-mono tracking-tight ${
                livePricing.isDiscrepancy ? 'text-rose-950' : 'text-emerald-950'
              }`}>
                {livePricing.hasPrintedUSP ? (
                  <>₹{livePricing.printedUSPAmount?.toFixed(2)} <span className="text-xs font-bold opacity-80">/ {livePricing.printedUSPUnit}</span></>
                ) : (
                  <span className="text-sm font-black text-rose-800">NOT PRINTED</span>
                )}
              </div>
              <p className={`text-[11px] mt-1 font-bold ${
                livePricing.isDiscrepancy ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {livePricing.hasPrintedUSP ? 'Extracted from packaging' : 'Mandatory under Rule 6(1)(e)'}
              </p>
            </div>
          </div>
        </div>

        {/* High-Visibility Discrepancy & Finding Callout */}
        {livePricing.isDiscrepancy ? (
          <div className="p-4.5 bg-rose-50 rounded-2xl border-2 border-rose-300 flex items-start gap-4 shadow-sm">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-sm shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-black text-rose-950 text-sm tracking-tight">
                  {livePricing.discrepancyType === 'MISSING_USP'
                    ? 'Mandatory Unit Sale Price (USP) is Missing on Label'
                    : 'Mathematical Pricing Mismatch Detected'}
                </span>
                <span className="bg-rose-600 text-white font-extrabold px-3 py-1 rounded-full text-[11px] shadow-xs">
                  POTENTIAL PRICING VIOLATION
                </span>
              </div>

              {livePricing.discrepancyType !== 'MISSING_USP' ? (
                <div className="text-rose-900 leading-relaxed font-medium pt-0.5">
                  The printed rate on the package is <strong className="font-mono text-rose-950 font-black">₹{livePricing.printedUSPAmount?.toFixed(2)}/{livePricing.printedUSPUnit}</strong>, but the true statutory calculated rate is <strong className="font-mono text-rose-950 font-black">₹{livePricing.calculatedUSPAmount.toFixed(2)}/{livePricing.calculatedUSPUnit}</strong>. 
                  <div className="mt-1.5 p-2 bg-white/80 rounded-lg border border-rose-200 font-mono text-rose-900 font-bold text-xs flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Consumer Overcharge Variance: +₹{Math.abs(livePricing.differenceAmount).toFixed(2)} / {livePricing.calculatedUSPUnit} (+{livePricing.differencePercentage}%)</span>
                  </div>
                </div>
              ) : (
                <p className="text-rose-900 leading-relaxed font-medium">
                  The product label fails to declare the mandatory Unit Sale Price. Under the 2021 Legal Metrology Amendment, this pack must declare <strong className="font-mono text-rose-950 font-black">₹{livePricing.calculatedUSPAmount.toFixed(2)} / {livePricing.calculatedUSPUnit}</strong>.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-emerald-950 text-sm block">Unit Sale Price is 100% Mathematically Verified</span>
                <p className="text-emerald-800 font-medium mt-0.5">
                  Printed USP of ₹{livePricing.printedUSPAmount?.toFixed(2)}/{livePricing.printedUSPUnit} matches the mathematical calculation exactly (₹{livePricing.mrpAmount} ÷ {livePricing.netQuantityValue}{livePricing.netQuantityUnit}).
                </p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white font-black px-3 py-1 rounded-full text-xs shadow-xs shrink-0">
              100% VERIFIED
            </span>
          </div>
        )}

        {/* Interactive Sandbox Recalculator */}
        {isSandboxOpen && (
          <div className="p-4.5 bg-slate-50 rounded-2xl border border-slate-300 space-y-3.5 animate-in fade-in text-xs shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2 font-extrabold text-slate-900">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Inspector Live Test Sandbox</span>
              </div>
              <button
                onClick={handleResetSandbox}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Values
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">MRP (₹)</label>
                <input
                  type="number"
                  value={sandboxMRP}
                  onChange={(e) => setSandboxMRP(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Net Quantity</label>
                <input
                  type="number"
                  value={sandboxNetQty}
                  onChange={(e) => setSandboxNetQty(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit</label>
                <select
                  value={sandboxUnit}
                  onChange={(e) => setSandboxUnit(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                >
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ml">Millilitres (ml)</option>
                  <option value="l">Litres (L)</option>
                  <option value="pcs">Pieces (pcs)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Printed USP on Pack</label>
                <input
                  type="text"
                  value={sandboxPrintedUSP}
                  placeholder="e.g. ₹0.25/g"
                  onChange={(e) => setSandboxPrintedUSP(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Type or modify values above to see how the pricing intelligence algorithms respond in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


