import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  Clock,
  MapPin,
  Star,
  ChevronRight,
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Cpu,
  Hammer,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Phone,
  Home,
  SlidersHorizontal,
  ThumbsUp,
  Award,
  Users
} from 'lucide-react';
import {
  getCategories,
  getProfessionals,
  getActiveLocality,
  getActiveCity,
  getCustomerHomeAssets,
  getBookings
} from '../../services/hommieState';

const categoryIcons = {
  'ac-service': Wind,
  'electrician': Zap,
  'plumber': Droplets,
  'appliance': Cpu,
  'carpenter': Hammer,
  'cleaning': Sparkles
};

export default function CustomerHomeView({
  onSelectCategory,
  onOpenBookingModal,
  onViewProProfile,
  onOpenLocationModal,
  onNavigate
}) {
  const [categories, setCategories] = useState([]);
  const [featuredPros, setFeaturedPros] = useState([]);
  const [activeLocality, setActiveLocality] = useState(null);
  const [activeCity, setActiveCity] = useState(null);
  const [homeAssets, setHomeAssets] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCategories(getCategories());
    setActiveLocality(getActiveLocality());
    setActiveCity(getActiveCity());
    setHomeAssets(getCustomerHomeAssets());

    const activeLoc = getActiveLocality();
    const pros = getProfessionals({
      locality: activeLoc?.name,
      verifiedOnly: false
    });
    setFeaturedPros(pros.slice(0, 4));

    const bookings = getBookings({
      status: 'pro_assigned'
    });
    setActiveBookings(bookings.slice(0, 1));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('discovery', { query: searchQuery });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-amber-500/10 via-slate-50 to-slate-50 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto">
          {/* Locality Pill Alert */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm hover:border-amber-400 text-xs sm:text-sm font-medium text-slate-700 transition"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>
                Delivering in <strong className="text-slate-900">{activeLocality?.name || 'Indiranagar'}</strong>, {activeCity?.name || 'Bengaluru'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              18 Pros Online in Sector
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
              Honest local service professionals for your home.
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Direct connection to verified independent technicians, electricians, and plumbers. No inflated middleman markups.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-6 max-w-2xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200 p-2 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 'AC gas refill', 'Geyser repair', 'MCB tripping'..."
                className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition shrink-0"
              >
                Find Pros
              </button>
            </div>
          </form>

          {/* Urgent Dispatch vs Scheduled Dispatch Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Need Help Right Now?</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">15-30m Dispatch</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Urgent electrical tripping, burst pipe, or water leakage. Nearby available pros alerted immediately.
                </p>
                <button
                  onClick={() => onNavigate('discovery', { urgent: true })}
                  className="mt-2 text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
                >
                  View available emergency pros <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Schedule at Your Convenience</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">Pick Slot</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Choose your preferred date and exact 2-hour arrival window with confirmed pro acceptance.
                </p>
                <button
                  onClick={() => onNavigate('discovery')}
                  className="mt-2 text-xs font-bold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1"
                >
                  Explore rate cards & book <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE SERVICE CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Explore Services</h2>
            <p className="text-xs sm:text-sm text-slate-500">Transparent standardized inspection and diagnostic pricing</p>
          </div>
          <button
            onClick={() => onNavigate('discovery')}
            className="text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
          >
            All Services <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Sparkles;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group relative flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition text-center"
              >
                {cat.badge && (
                  <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    {cat.badge}
                  </span>
                )}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition group-hover:scale-110"
                  style={{ backgroundColor: `${cat.accentColor}15`, color: cat.accentColor }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition">
                  {cat.shortName}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Insp: ₹{cat.inspectionFee}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. MY HOME MAINTENANCE SNAPSHOT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
              <Home className="w-3.5 h-3.5" />
              <span>HOMMIE My Home Hub</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Your Household Appliance & Service Passport</h3>
            <p className="mt-2 text-sm text-slate-300">
              Never hunt for old warranty cards or guess when your AC was last serviced. Keep a verified digital log for your home.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('my-home')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition inline-flex items-center gap-2"
              >
                <span>Open My Home ({homeAssets.length} Assets Logged)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-3 absolute right-6 top-6 bottom-6 w-96 opacity-90">
            {homeAssets.slice(0, 2).map((asset) => (
              <div key={asset.id} className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">{asset.location}</span>
                  <h4 className="font-bold text-sm text-white truncate">{asset.brand} {asset.name}</h4>
                  <p className="text-[11px] text-slate-300 mt-1">Last: {asset.lastServiceDate}</p>
                </div>
                <div className="text-[10px] text-amber-200 bg-amber-500/20 px-2 py-1 rounded mt-2 border border-amber-500/30">
                  {asset.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED NEIGHBORHOOD PROFESSIONALS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Verified Professionals in {activeLocality?.name || 'Indiranagar'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Background verified, identity confirmed, with genuine customer reviews
            </p>
          </div>
          <button
            onClick={() => onNavigate('discovery')}
            className="text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
          >
            Browse All ({featuredPros.length}+) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPros.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    {pro.verifications?.hommieVerified && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-sm" title="HOMMIE Verified Identity">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-amber-600 transition">
                      {pro.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate font-medium">{pro.trade}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{pro.ratingAvg.toFixed(1)}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-500">{pro.ratingCount} reviews</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {pro.headline}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {pro.primaryLocality}
                  </span>
                  <span className="font-semibold text-slate-900">
                    From ₹{pro.baseRate}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center gap-2">
                <button
                  onClick={() => onViewProProfile(pro.id)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onOpenBookingModal(pro)}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOMMIE PROMISE / FAIR PRICING GUARANTEE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">How HOMMIE Protects You</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Building mutual trust between homeowners and skilled independent technicians
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">30-Day Service Guarantee</h4>
                <p className="text-xs text-slate-600 mt-1">
                  If the same problem reoccurs within 30 days of inspection or repair, the pro revisits without new inspection fees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-sm">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">No Surprise Quotes</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Pros diagnose on-site and send an itemized in-app quote. Work starts only after your tap-to-approve.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Direct Independent Pros</h4>
                <p className="text-xs text-slate-600 mt-1">
                  100% of the service fee goes directly to your professional. You build a direct relationship with someone who knows your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
