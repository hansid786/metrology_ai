import React, { useState } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Star, 
  ArrowRight, 
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRADES_LIST, COOPERATIVE_CHAPTERS } from '../data/mockData';

export default function WorkerSelfListingView({ onWorkerRegistered }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [trade, setTrade] = useState('Electrician');
  const [locality, setLocality] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [baseRate, setBaseRate] = useState(350);
  const [rateType, setRateType] = useState('Per Visit / Inspection');
  const [skills, setSkills] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const skillsArr = skills
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Immediate On-Demand Service', 'Inspection', 'General Repairs'];

    const newWorker = {
      id: `w-${Date.now().toString().slice(-4)}`,
      name: name || 'Local Professional Member',
      trade: trade,
      specialty: specialty || `${trade} Specialist`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?w=150&auto=format&fit=crop&q=80`,
      experienceYears: Number(experienceYears) || 3,
      locality: locality || 'Koramangala, Bengaluru',
      coopUnit: 'Bangalore South Guild',
      unionRegNo: `GW-${new Date().getFullYear()}-${trade.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewsCount: 1,
      baseRate: Number(baseRate) || 350,
      rateType: rateType,
      phone: phone || '+91 98000 12345',
      status: 'online',
      verificationStatus: 'verified',
      kycType: 'Aadhaar Verified Self-Listing',
      vouchedBy: 'Ward Cooperative Peer Endorsed',
      skills: skillsArr,
      toolsOwned: ['Standard Professional Tool Kit'],
      totalEarnings: 0,
      coopWelfareContributed: 0,
      completedJobs: 0,
      joinedDate: 'Just Now',
      bio: `Independent certified ${trade} with ${experienceYears} years experience in ${locality}. Direct pricing, 0% middleman commission.`
    };

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    onWorkerRegistered(newWorker);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
          Free Self-Listing
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Register as an Independent Worker
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Set your own rates, retain 95%+ of customer payments, and connect directly with local households.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Clean Form Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Primary Trade *</label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
                >
                  {TRADES_LIST.filter(t => t !== 'All Trades').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Years of Experience *</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Operating Ward / City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Koramangala, Bengaluru"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. MCB Panels, Inverter Repair"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* Self-Set Pricing */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Your Base Visit Rate</span>
                <span className="font-mono font-black text-slate-900 text-sm">₹{baseRate}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  value={baseRate}
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none"
                />

                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Per Visit / Inspection">Per Visit / Inspection</option>
                  <option value="Per Hour Labor">Per Hour Labor</option>
                  <option value="Complete Job Fixed">Complete Job Fixed</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                You receive <strong>₹{Math.round(baseRate * 0.95)} (95%)</strong> directly into your bank account.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Key Skills (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. MCB Switches, Earthing, Inverter, House Wiring"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>Publish Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-semibold text-slate-400 block">Card Preview</span>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-base">
                  {name ? name.charAt(0).toUpperCase() : 'W'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{name || 'Your Name'}</h3>
                  <p className="text-xs font-medium text-emerald-800">{trade}</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-100">
                Verified
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-1">
              {specialty || `${trade} Services in ${locality || 'Your City'}`}
            </p>

            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>{locality || 'Operating Locality'}</span>
              <span className="mx-1">•</span>
              <span>{experienceYears} yrs exp</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Rate</span>
                <span className="text-base font-black text-slate-900 font-mono">₹{baseRate}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900 text-white font-semibold py-1.5 px-3 rounded-xl text-xs">
                  Book
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-800">Worker Autonomy Guarantee</p>
            <p className="text-[11px] leading-relaxed">
              No mandatory acceptance quotas. You choose which jobs to take and receive direct client payments.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
