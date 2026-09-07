import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  PlusCircle, 
  Phone, 
  CheckCircle2, 
  Wrench, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  Building2
} from 'lucide-react';
import { TRADES_LIST } from '../data/mockData';

export default function WorkerDirectory({ 
  workers, 
  onSelectWorker, 
  onBookWorker, 
  onOpenRegisterModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterOnlineOnly, setFilterOnlineOnly] = useState(false);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = 
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTrade = selectedTrade === 'All Trades' || worker.trade.includes(selectedTrade) || selectedTrade.includes(worker.trade);
    const matchesVerified = !filterVerifiedOnly || worker.verificationStatus === 'verified';
    const matchesOnline = !filterOnlineOnly || worker.status === 'online';

    return matchesSearch && matchesTrade && matchesVerified && matchesOnline;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs my-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Self-Listed Worker Directory</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {filteredWorkers.length} Workers Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Workers set their own honest rates, keep 95%+ of their pay, and are endorsed by their local ward cooperative.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-900/10 cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Self-Register New Worker</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by worker name, trade, skill (e.g., Inverter, MCB, Balcony), or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-all"
            />
          </div>

          {/* Trade Filter Dropdown */}
          <div className="sm:w-64">
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {TRADES_LIST.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Toggles */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1">Quick Filters:</span>
          
          <button
            onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              filterVerifiedOnly
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Coop Verified Only</span>
          </button>

          <button
            onClick={() => setFilterOnlineOnly(!filterOnlineOnly)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              filterOnlineOnly
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Available Now</span>
          </button>

          {(searchQuery || selectedTrade !== 'All Trades' || filterVerifiedOnly || filterOnlineOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTrade('All Trades');
                setFilterVerifiedOnly(false);
                setFilterOnlineOnly(false);
              }}
              className="text-[11px] font-bold text-rose-600 hover:underline ml-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all p-5 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top row with status & cooperative badge */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-emerald-500 transition-colors"
                    />
                    <span 
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        worker.status === 'online' ? 'bg-emerald-500' :
                        worker.status === 'on_job' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                      title={worker.status === 'online' ? 'Available' : worker.status === 'on_job' ? 'On Active Job' : 'Offline'}
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                      {worker.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800">{worker.trade}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-slate-800">{worker.rating}</span>
                      <span className="text-[11px] text-slate-400">({worker.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {worker.verificationStatus === 'verified' ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 shrink-0 border border-emerald-300">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-1 shrink-0 border border-amber-300">
                    <Clock className="w-3 h-3" />
                    Under Review
                  </span>
                )}
              </div>

              {/* Speciality & Locality */}
              <p className="text-xs text-slate-600 line-clamp-1 font-medium">{worker.specialty}</p>

              <div className="flex items-center gap-1 text-slate-500 text-xs mt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{worker.locality}</span>
              </div>

              {/* Guild Union Badge */}
              <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl mt-3 border border-slate-100">
                <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate font-medium">{worker.coopUnit}</span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {worker.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                    {skill}
                  </span>
                ))}
                {worker.skills.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px]">
                    +{worker.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Row: Pricing & Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[11px] text-slate-500 font-medium">Self-Set Rate:</span>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-slate-900 font-mono">₹{worker.baseRate}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">{worker.rateType}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectWorker(worker)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Profile / Passbook</span>
                </button>

                <button
                  onClick={() => onBookWorker(worker)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Book Worker</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
