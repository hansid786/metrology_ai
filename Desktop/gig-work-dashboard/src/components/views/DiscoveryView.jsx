import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  X,
  Zap,
  ArrowUpDown,
  Phone,
  MessageSquare,
  Award,
  ChevronDown
} from 'lucide-react';
import {
  getCategories,
  getProfessionals,
  getActiveLocality,
  getActiveCity
} from '../../services/hommieState';

export default function DiscoveryView({
  initialCategory,
  initialQuery = '',
  initialUrgent = false,
  onViewProProfile,
  onOpenBookingModal,
  onOpenLocationModal
}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [availableNowOnly, setAvailableNowOnly] = useState(initialUrgent);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // recommended, rating, price_asc, jobs
  const [activeLocality, setActiveLocality] = useState(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
    setActiveLocality(getActiveLocality());
  }, []);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialQuery) setSearchQuery(initialQuery);
    if (initialUrgent) setAvailableNowOnly(initialUrgent);
  }, [initialCategory, initialQuery, initialUrgent]);

  // Fetch filtered professionals
  const allPros = getProfessionals({
    categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
    locality: activeLocality?.name,
    availableNowOnly,
    verifiedOnly,
    minRating: minRating > 0 ? minRating : undefined,
    language: selectedLanguage || undefined,
    query: searchQuery
  });

  // Sort logic
  const sortedPros = [...allPros].sort((a, b) => {
    if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
    if (sortBy === 'price_asc') return a.baseRate - b.baseRate;
    if (sortBy === 'jobs') return b.jobsCompleted - a.jobsCompleted;
    // default recommended: Verified first then rating
    if (a.verifications?.hommieVerified !== b.verifications?.hommieVerified) {
      return a.verifications?.hommieVerified ? -1 : 1;
    }
    return b.ratingAvg - a.ratingAvg;
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setAvailableNowOnly(false);
    setVerifiedOnly(false);
    setMinRating(0);
    setSelectedLanguage('');
    setSortBy('recommended');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (availableNowOnly ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (selectedLanguage ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-24 md:pb-16 font-sans">
      {/* Top Search & Filter Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technician name, appliance, skill..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Action Badges / Controls */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setAvailableNowOnly(!availableNowOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  availableNowOnly
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-900" />
                <span>Available Now</span>
              </button>

              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  verifiedOnly
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HOMMIE Verified</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="rating">Highest Rated ★</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="jobs">Most Jobs Completed</option>
                </select>
              </div>

              {/* Filter Drawer Toggle */}
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-bold shrink-0 hover:bg-slate-900 transition shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center ml-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  selectedCategory === cat.slug
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-950">
              {sortedPros.length} Professional{sortedPros.length !== 1 ? 's' : ''} available
            </h1>
            <span className="text-xs text-slate-500 font-medium">
              in {activeLocality?.name || 'Indiranagar'}
            </span>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-amber-700 font-bold hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {sortedPros.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No professionals match your filters</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try loosening your search query, clearing filters, or switching category.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-900 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Grid of Professionals */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedPros.map((pro) => (
              <div
                key={pro.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  {/* Top Row: Avatar & Badges */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                      />
                      {pro.availableNow && (
                        <span className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black shadow-xs flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Online
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-extrabold text-slate-950 text-base truncate">
                          {pro.name}
                        </h2>
                        {pro.verifications?.hommieVerified && (
                          <span title="HOMMIE Verified Identity">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                        {pro.trade}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200/60">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{pro.ratingAvg.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          ({pro.ratingCount} reviews)
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {pro.jobsCompleted} jobs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Headline */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {pro.headline}
                  </p>

                  {/* Details Badges */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {pro.primaryLocality}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {pro.experienceYears} yrs exp
                    </span>
                    {pro.languages?.map((lang) => (
                      <span key={lang} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Overview */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Inspection Visit</span>
                      <p className="text-xs font-extrabold text-slate-900">₹{pro.inspectionFee || 149}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Starting From</span>
                      <p className="text-sm font-black text-amber-700">₹{pro.baseRate}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onViewProProfile(pro.id)}
                    className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-100 transition shadow-2xs"
                  >
                    Rate Card & Reviews
                  </button>
                  <button
                    onClick={() => onOpenBookingModal(pro)}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition shadow-xs"
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Drawer Modal (Mobile & Desktop) */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Filter Professionals</h3>
              </div>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Category */}
              <div>
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Service Category</label>
                <div className="mt-2 space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      selectedCategory === 'all'
                        ? 'bg-amber-50 text-amber-900 border border-amber-400 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        selectedCategory === cat.slug
                          ? 'bg-amber-50 text-amber-900 border border-amber-400 shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Minimum Rating</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[0, 4.0, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition ${
                        minRating === rating
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+ ★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Spoken Languages</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Hindi', 'Kannada', 'English', 'Tamil'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(selectedLanguage === lang ? '' : lang)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedLanguage === lang
                          ? 'bg-slate-950 text-white border-slate-950 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 transition shadow-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
