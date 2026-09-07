import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Clock, 
  AirVent, 
  Droplets, 
  Zap, 
  Hammer, 
  Wrench, 
  Paintbrush, 
  Sparkles, 
  Car, 
  ChevronRight, 
  Check, 
  Phone,
  HeartHandshake,
  RotateCw,
  Refrigerator,
  Tv,
  Bug,
  GlassWater,
  Laptop,
  Truck,
  Scissors,
  Award,
  BadgeCheck,
  Flame,
  Shield,
  ThumbsUp
} from 'lucide-react';
import { SEED_CATEGORIES } from '../../services/seedData';

const CATEGORY_STYLES = {
  'ac-repair': { icon: AirVent, bg: 'bg-sky-50 hover:bg-sky-100/90 border-sky-200/90', iconBg: 'bg-sky-500 text-white', text: 'text-sky-950' },
  'plumbing': { icon: Droplets, bg: 'bg-cyan-50 hover:bg-cyan-100/90 border-cyan-200/90', iconBg: 'bg-cyan-600 text-white', text: 'text-cyan-950' },
  'electrical': { icon: Zap, bg: 'bg-amber-50 hover:bg-amber-100/90 border-amber-200/90', iconBg: 'bg-amber-500 text-white', text: 'text-amber-950' },
  'carpentry': { icon: Hammer, bg: 'bg-orange-50 hover:bg-orange-100/90 border-orange-200/90', iconBg: 'bg-orange-600 text-white', text: 'text-orange-950' },
  'painting': { icon: Paintbrush, bg: 'bg-purple-50 hover:bg-purple-100/90 border-purple-200/90', iconBg: 'bg-purple-600 text-white', text: 'text-purple-950' },
  'appliance-repair': { icon: Wrench, bg: 'bg-rose-50 hover:bg-rose-100/90 border-rose-200/90', iconBg: 'bg-rose-500 text-white', text: 'text-rose-950' },
  'washing-machine': { icon: RotateCw, bg: 'bg-indigo-50 hover:bg-indigo-100/90 border-indigo-200/90', iconBg: 'bg-indigo-600 text-white', text: 'text-indigo-950' },
  'refrigerator': { icon: Refrigerator, bg: 'bg-teal-50 hover:bg-teal-100/90 border-teal-200/90', iconBg: 'bg-teal-600 text-white', text: 'text-teal-950' },
  'tv-audio': { icon: Tv, bg: 'bg-fuchsia-50 hover:bg-fuchsia-100/90 border-fuchsia-200/90', iconBg: 'bg-fuchsia-600 text-white', text: 'text-fuchsia-950' },
  'mechanic': { icon: Car, bg: 'bg-red-50 hover:bg-red-100/90 border-red-200/90', iconBg: 'bg-red-600 text-white', text: 'text-red-950' },
  'cleaning': { icon: Sparkles, bg: 'bg-emerald-50 hover:bg-emerald-100/90 border-emerald-200/90', iconBg: 'bg-emerald-600 text-white', text: 'text-emerald-950' },
  'pest-control': { icon: Bug, bg: 'bg-lime-50 hover:bg-lime-100/90 border-lime-200/90', iconBg: 'bg-lime-600 text-white', text: 'text-lime-950' },
  'ro-water-purifier': { icon: GlassWater, bg: 'bg-blue-50 hover:bg-blue-100/90 border-blue-200/90', iconBg: 'bg-blue-600 text-white', text: 'text-blue-950' },
  'computer-laptop': { icon: Laptop, bg: 'bg-violet-50 hover:bg-violet-100/90 border-violet-200/90', iconBg: 'bg-violet-600 text-white', text: 'text-violet-950' },
  'movers-packers': { icon: Truck, bg: 'bg-amber-50 hover:bg-amber-100/90 border-amber-200/90', iconBg: 'bg-amber-600 text-white', text: 'text-amber-950' },
  'grooming-salon': { icon: Scissors, bg: 'bg-pink-50 hover:bg-pink-100/90 border-pink-200/90', iconBg: 'bg-pink-500 text-white', text: 'text-pink-950' }
};

export default function HomeView({ 
  onSearch, 
  onSelectCategory, 
  onSelectWorker, 
  workers, 
  onJoinAsWorker,
  onOpenEmergency
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Lucknow');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const topWorkers = workers.slice(0, 4);

  return (
    <div className="space-y-16 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. HERO SECTION (Vibrant Startup Gradient Banner + Editorial Photo Card) */}
      <section className="relative rounded-[2.5rem] bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-emerald-900/50">
        
        {/* Subtle Ambient Color Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Headline & High-Converting Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Hyperlocal Network • {location}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Find the right professional.<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Right at your doorstep.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Directly book verified local electricians, plumbers, AC technicians, and repair specialists in <strong>15–30 minutes</strong> with transparent rate cards.
            </p>

            {/* Vibrant Search Capsule */}
            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-2 border-emerald-500/30 focus-within:border-emerald-400 transition-all">
                
                {/* Service Query Input */}
                <div className="flex-1 flex items-center px-3 py-2">
                  <Search className="w-4.5 h-4.5 text-emerald-700 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search: AC jet service, tap leakage, MCB fuse..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none"
                  />
                </div>

                {/* Location Picker */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-800 shrink-0 border border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="Lucknow">Lucknow</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                {/* Search CTA */}
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-emerald-500/25 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Search Pros</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            </form>

            {/* Popular Quick Chips + Urgent Dispatch Action */}
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              <span className="font-bold text-slate-400">Popular:</span>
              {['AC Jet Service', 'Plumbing Leak', 'Fan Repair', 'Door Lock', 'Deep Cleaning'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setSearchQuery(chip); onSearch(chip); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}

              <button
                onClick={() => onOpenEmergency && onOpenEmergency()}
                className="ml-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-black transition-all shadow-lg hover:shadow-rose-500/30 cursor-pointer flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
                <span>⚡ Need Help Now</span>
              </button>
            </div>

          </div>

          {/* RIGHT: High Impact Verified Technician Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&auto=format&fit=crop&q=80"
                alt="Arjun Singh - Certified Local AC Technician in Lucknow"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Contextual Badges */}
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/50 text-xs font-bold text-emerald-300 flex items-center gap-1.5 shadow-lg">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>Aadhaar & Trade Verified</span>
              </div>

              <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                <span>Available Now</span>
              </div>

              {/* Bottom Card Summary */}
              <div className="absolute bottom-4 inset-x-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-white text-base">Arjun Singh</h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-400/30">
                      AC Specialist
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                    <span className="flex items-center gap-1 font-black text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      4.9
                    </span>
                    <span>(142 reviews)</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">1.4 km away</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectWorker(workers[0])}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-1"
                >
                  <span>Book</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 2. DIVERSE COLORFUL SERVICE CATEGORIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Popular Local Services</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                16+ Categories
              </span>
            </h2>
            <p className="text-xs text-slate-500">Fixed rate cards with zero hidden inspection fees</p>
          </div>
          
          <button 
            onClick={() => onSearch('')} 
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Colorful Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
          {SEED_CATEGORIES.map((cat) => {
            const style = CATEGORY_STYLES[cat.slug] || { icon: Wrench, bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200', iconBg: 'bg-emerald-600 text-white', text: 'text-emerald-950' };
            const Icon = style.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-1 ${style.bg} ${style.text}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm ${style.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-center leading-tight">{cat.name}</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">₹249 onwards</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. VIBRANT STARTUP TRUST PILLARS */}
      <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-6 sm:p-8 rounded-[2rem] border border-emerald-100/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">Why Customers & Workers Choose Our Platform</h3>
            <p className="text-xs text-slate-600">Built to empower independent skilled technicians and protect homeowners</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Verified Local Professionals</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Aadhaar & Trade Verified</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every technician undergoes ID background check, trade skill validation, and facial match before listing.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Hyperlocal Radar</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time proximity mapping connects you with skilled specialists within 2–5 km for 15-minute arrivals.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">30-Day Work Warranty</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full service guarantee with escrow dispute protection. Free rework if you're not completely satisfied.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">95%+ Direct Worker Payout</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero predatory middleman cuts. Independent technicians keep their full hard-earned compensation.
            </p>
          </div>

        </div>
      </section>

      {/* 4. PROFESSIONALS NEAR YOU (High-Converting Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Top Rated Professionals Near You
            </h2>
            <p className="text-xs text-slate-500">Ready for instant dispatch in Lucknow / Bengaluru</p>
          </div>

          <button
            onClick={() => onSearch('')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-full h-44 rounded-2xl object-cover border border-slate-100"
                  />
                  {worker.isAvailableNow && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                      Available Now
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base">{worker.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{worker.ratingAvg}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">{worker.trade} • {worker.experienceYears}+ yrs exp</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{worker.locality} ({worker.distanceKm || '1.4 km away'})</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Starting from</span>
                  <span className="text-base font-black text-slate-900 font-mono">₹{worker.baseRate}</span>
                </div>

                <button
                  onClick={() => onSelectWorker(worker)}
                  className="px-4 py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer"
                >
                  View Profile
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 5. WORKER PARTNER ONBOARDING BANNER (Vibrant Call to Action) */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-left">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            For Skilled Technicians & Mechanics
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Are you an independent technician? Earn directly with zero middleman fee.
          </h3>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            Join 5,000+ verified electricians, plumbers, AC specialists, and carpenters receiving high-paying doorstep jobs across your city.
          </p>
        </div>

        <button
          onClick={onJoinAsWorker}
          className="bg-slate-950 hover:bg-slate-900 text-white font-black py-4 px-8 rounded-2xl text-xs sm:text-sm transition-all shadow-2xl hover:scale-105 cursor-pointer whitespace-nowrap"
        >
          Join as a Partner Pro →
        </button>
      </section>

    </div>
  );
}
