import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Wrench, 
  ArrowLeft, 
  Check, 
  Calendar, 
  Sparkles,
  Award,
  FileCheck,
  BadgeCheck,
  Zap
} from 'lucide-react';

export default function WorkerProfileView({ 
  worker, 
  onBack, 
  onBookWorker 
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search Results</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-20 h-20 rounded-3xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${worker.isAvailableNow ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{worker.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Verified Pro
                </span>
              </div>
              
              <p className="text-sm font-black text-emerald-700">{worker.trade} • {worker.specialty}</p>
              
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {worker.locality} ({worker.distanceKm})</span>
                <span>•</span>
                <span className="font-mono text-slate-700 font-semibold">Reg ID: {worker.unionRegNo}</span>
              </div>
            </div>
          </div>

          {/* Rate & Book CTA */}
          <div className="flex flex-col items-end gap-2 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 w-full sm:w-auto shadow-2xs">
            <div className="text-right w-full">
              <span className="text-[10px] uppercase font-black text-emerald-800 block tracking-wider">Starting Rate</span>
              <span className="text-2xl font-black text-slate-900 font-mono">₹{worker.baseRate} <span className="text-xs font-semibold text-slate-500">/{worker.rateUnit}</span></span>
            </div>

            <div className="flex items-center gap-2 w-full pt-1">
              <a
                href={`tel:${worker.phone}`}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
                title="Direct Phone Call"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
              </a>

              <button
                onClick={() => onBookWorker(worker)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Book Doorstep Visit
              </button>
            </div>
          </div>

        </div>

        {/* 4 Trust Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Rating</span>
            <div className="flex items-center justify-center gap-1 text-base font-black text-slate-900 font-mono mt-0.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{worker.ratingAvg}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">({worker.reviewsCount} reviews)</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed Jobs</span>
            <span className="text-base font-black text-slate-900 font-mono block mt-0.5">{worker.completedJobsCount}+</span>
            <span className="text-[10px] text-emerald-800 font-bold">100% Verified</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
            <span className="text-base font-black text-slate-900 font-mono block mt-0.5">{worker.experienceYears} Years</span>
            <span className="text-[10px] text-slate-500 font-semibold">Master Grade</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Response Rate</span>
            <span className="text-base font-black text-emerald-800 font-mono block mt-0.5">{worker.responseRatePct}%</span>
            <span className="text-[10px] text-slate-500 font-semibold">Avg 20 mins arrival</span>
          </div>
        </div>

        {/* Bio & About */}
        <div className="space-y-2 pt-2">
          <h3 className="font-extrabold text-slate-900 text-sm">About Professional</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {worker.bio}
          </p>
        </div>

        {/* Verified Credentials & Licenses */}
        <div className="space-y-2 pt-2">
          <h3 className="font-extrabold text-slate-900 text-sm">Verified Credentials & Government Clearance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs">
              <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Aadhaar & Police Clearance:</strong> Verified & Background Checked</span>
            </div>

            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs">
              <Award className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Trade Certification:</strong> {worker.tradeCertified}</span>
            </div>
          </div>
        </div>

        {/* Skills & Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Expertise & Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {worker.skills?.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Owned Professional Tools</h4>
            <div className="flex flex-wrap gap-1.5">
              {worker.toolsOwned?.map((tool, idx) => (
                <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                  ⚙️ {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-2 pt-2">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Weekly Operating Hours</h4>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs">
            {worker.weeklySchedule?.map((slot, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="font-extrabold text-slate-900 block">{slot.day}</span>
                <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">{slot.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Recent Customer Reviews ({worker.reviews?.length || 0})</h4>
          <div className="space-y-3">
            {worker.reviews?.map((rev, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-900">{rev.author}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">"{rev.comment}"</p>
                <span className="text-[10px] text-slate-400 font-semibold block pt-1">{rev.service} • {rev.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
