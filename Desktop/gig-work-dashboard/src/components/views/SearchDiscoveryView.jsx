import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Zap, 
  Sparkles,
  Phone,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  BadgeCheck
} from 'lucide-react';
import { apiSearchWorkers } from '../../services/api';
import { SEED_CATEGORIES } from '../../services/seedData';
import InteractiveMap from '../InteractiveMap';

export default function SearchDiscoveryView({ 
  initialQuery = '', 
  onSelectWorker, 
  onBookService 
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'rating' | 'price_asc' | 'experience'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const results = await apiSearchWorkers({
        query,
        trade: selectedCategory === 'all' ? '' : selectedCategory,
        onlyAvailable: onlyAvailableNow,
        sortBy
      });
      setWorkers(results);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, selectedCategory, onlyAvailableNow, sortBy]);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Search Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Live Proximity Radar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Discover Verified Local Professionals
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing <strong className="text-emerald-800">{workers.length} verified technicians</strong> ready for doorstep service in Lucknow / Bengaluru.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* View Switcher: List vs Map */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setViewMode('list')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'map' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Interactive Map</span>
              </button>
            </div>

            {/* Available Now Toggle */}
            <button
              onClick={() => setOnlyAvailableNow(!onlyAvailableNow)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                onlyAvailableNow
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyAvailableNow ? 'bg-white animate-ping' : 'bg-emerald-500'}`}></span>
              <span>{onlyAvailableNow ? '🟢 Available Now Only' : 'Filter: Available Now'}</span>
            </button>
          </div>
        </div>

        {/* Input & Sorting Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by worker name, trade skill, locality or repair task..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium shadow-inner"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-2xl px-3.5 py-3 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="match">Sort by: Best Match & Proximity</option>
              <option value="rating">Sort by: Highest Rating</option>
              <option value="price_asc">Sort by: Lowest Base Price</option>
              <option value="experience">Sort by: Most Experience</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>

          {SEED_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                selectedCategory === cat.slug
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode 1: Live Interactive Radar Map */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Hyperlocal Worker Proximity Radar</h3>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live Radius: 8.0 KM
            </span>
          </div>
          <InteractiveMap
            workers={workers}
            onSelectWorker={onSelectWorker}
          />
        </div>
      )}

      {/* View Mode 2: Worker Cards Grid */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Worker Header Card */}
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                    />
                    {worker.isAvailableNow && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-black text-slate-900 text-base truncate">{worker.name}</h3>
                      {worker.verificationStatus === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-200">
                          <BadgeCheck className="w-3 h-3 text-emerald-700" />
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold text-emerald-700 mt-0.5">{worker.trade}</p>
                    <p className="text-[11px] text-slate-500 truncate">{worker.specialty}</p>
                  </div>
                </div>

                {/* Rating & Proximity Highlights */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Rating</span>
                    <span className="text-xs font-black text-amber-500 flex items-center justify-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {worker.ratingAvg}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Jobs Done</span>
                    <span className="text-xs font-black text-slate-900 mt-0.5 block">{worker.completedJobsCount}+</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Proximity</span>
                    <span className="text-xs font-black text-emerald-700 mt-0.5 block">{worker.distanceKm || '1.4 km'}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills?.slice(0, 3).map((skill, sIdx) => (
                    <span key={sIdx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting Price</span>
                  <span className="text-base font-black text-slate-900 font-mono">₹{worker.baseRate} <span className="text-xs font-normal text-slate-500">onwards</span></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectWorker(worker)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer"
                  >
                    View Profile
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
