import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Zap, 
  Filter, 
  Sparkles 
} from 'lucide-react';
import CustomerServiceCatalog from './CustomerServiceCatalog';

export default function FindWorkersView({ 
  workers, 
  onBookWorker, 
  onSelectServiceItem 
}) {
  const [activeMode, setActiveMode] = useState('catalog'); // 'catalog' | 'workers'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Koramangala, Bengaluru');

  const filteredWorkers = workers.filter((worker) => {
    return (
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Location & Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Service Area</span>
            <span className="text-xs font-bold text-slate-900">{selectedCity}</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveMode('catalog')}
            className={`py-1.5 px-3.5 rounded-lg transition-all cursor-pointer ${
              activeMode === 'catalog'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Service Catalog
          </button>

          <button
            onClick={() => setActiveMode('workers')}
            className={`py-1.5 px-3.5 rounded-lg transition-all cursor-pointer ${
              activeMode === 'workers'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Direct Worker Directory ({workers.length})
          </button>
        </div>
      </div>

      {/* Mode 1: Service Catalog */}
      {activeMode === 'catalog' && (
        <CustomerServiceCatalog
          onSelectService={(serviceItem) => onSelectServiceItem(serviceItem)}
        />
      )}

      {/* Mode 2: Direct Worker Directory */}
      {activeMode === 'workers' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by worker name, trade or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="Online"></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm">{worker.name}</h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-xs font-medium text-emerald-800">{worker.trade}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-slate-800">{worker.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                    {worker.specialty}
                  </p>

                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{worker.locality}</span>
                    <span className="mx-1">•</span>
                    <span className="shrink-0 text-emerald-700 font-semibold">{worker.distanceKm || '1.2 km'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {worker.skills?.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[10px] font-medium border border-slate-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-extrabold text-slate-900 font-mono">₹{worker.baseRate}</span>
                      <span className="text-[10px] text-slate-400">/visit</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${worker.phone}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Call Directly"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onBookWorker(worker)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                    >
                      <span>Book Worker</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
