import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Coins, 
  HeartHandshake, 
  ArrowRight,
  Filter,
  Sparkles,
  Phone
} from 'lucide-react';
import { TRADES_LIST } from '../data/mockData';

export default function CustomerExplorerView({ workers, onBookWorker }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [customerLocality, setCustomerLocality] = useState('Koramangala, Bengaluru');

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch = 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTrade = selectedTrade === 'All Trades' || w.trade.includes(selectedTrade) || selectedTrade.includes(w.trade);
    return matchesSearch && matchesTrade && w.verificationStatus === 'verified';
  });

  return (
    <div className="space-y-6 my-6">
      
      {/* Customer Discovery Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Neighborhood Worker Discovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Book Verified Local Karigars with Zero Commission Markup
          </h1>
          <p className="text-blue-100 text-sm mt-2">
            Corporate apps add 30% hidden margins and charge workers lead fees. On <strong>Gig Work</strong>, 95%+ of what you pay goes straight to your local electrician, plumber, cleaner or carpenter.
          </p>

          {/* Search Box in Hero */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-blue-200 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="What service do you need? (e.g. Inverter repair, kitchen cleaning...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-transparent text-white placeholder-blue-200 text-xs focus:outline-none"
              />
            </div>

            <div className="sm:w-52">
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 text-white text-xs font-semibold rounded-xl focus:outline-none cursor-pointer"
              >
                {TRADES_LIST.map((t) => (
                  <option key={t} value={t} className="text-slate-900">{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Local Workers Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Nearby Verified Workers in Your Ward</h2>
            <p className="text-xs text-slate-500 mt-0.5">Showing {filteredWorkers.length} cooperative-endorsed workers near {customerLocality}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold">{customerLocality}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkers.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.avatar}
                      alt={w.name}
                      className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{w.name}</h3>
                      <p className="text-xs font-bold text-indigo-700">{w.trade}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-800">{w.rating}</span>
                        <span className="text-[11px] text-slate-400">({w.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1">{w.bio}</p>

                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Direct Labor Rate:</span>
                    <span className="font-mono font-extrabold text-slate-900 text-sm">₹{w.baseRate}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    ✨ You pay ₹{w.baseRate} → Worker gets ₹{Math.round(w.baseRate * 0.95)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onBookWorker(w)}
                  className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Book Service Directly</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
