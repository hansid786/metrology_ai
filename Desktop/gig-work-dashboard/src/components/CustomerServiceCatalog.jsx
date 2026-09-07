import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Sparkles, 
  Hammer, 
  AirVent, 
  Paintbrush, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Star,
  Check
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockData';

const ICON_MAP = {
  'Zap': Zap,
  'Droplets': Droplets,
  'Sparkles': Sparkles,
  'Hammer': Hammer,
  'AirVent': AirVent,
  'Paintbrush': Paintbrush
};

export default function CustomerServiceCatalog({ onSelectService }) {
  const [selectedCatId, setSelectedCatId] = useState('electrical');

  const activeCategory = SERVICE_CATEGORIES.find(c => c.id === selectedCatId) || SERVICE_CATEGORIES[0];
  const IconComponent = ICON_MAP[activeCategory.icon] || Zap;

  return (
    <div className="space-y-6">
      
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Zap;
          const isActive = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2.5 cursor-pointer card-premium ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 text-slate-700'}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Category Highlights Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white">{activeCategory.name} Services</h2>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Zero Surge Markup
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">{activeCategory.description}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>30-Day Work Warranty</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>Direct Worker UPI</span>
        </div>
      </div>

      {/* Service Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCategory.services.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between card-premium"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">{item.title}</h3>
                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-slate-900 text-lg">₹{item.price}</span>
                  <span className="text-[10px] text-emerald-800 font-bold block">Fixed Labor</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{item.desc}</p>
              
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Standard turnaround: <strong>{item.timeEst}</strong></span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>95% payout to worker</span>
              </span>

              <button
                onClick={() => onSelectService(item)}
                className="bg-slate-900 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Book Service</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
