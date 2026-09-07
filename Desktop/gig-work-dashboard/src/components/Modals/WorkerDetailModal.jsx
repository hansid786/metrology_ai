import React from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  Building2, 
  HeartHandshake, 
  CheckCircle2, 
  Phone, 
  Calendar,
  Coins,
  ChevronRight
} from 'lucide-react';

export default function WorkerDetailModal({ worker, onClose, onBook }) {
  if (!worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        
        {/* Modal Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">{worker.name}</h3>
                {worker.verificationStatus === 'verified' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Guild Verified
                  </span>
                )}
              </div>
              <p className="text-emerald-200 text-xs font-semibold mt-0.5">{worker.trade} • {worker.specialty}</p>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> {worker.locality}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {worker.rating} ({worker.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          
          {/* Bio */}
          <div>
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">About Worker</h4>
            <p className="text-slate-600 text-xs leading-relaxed">{worker.bio}</p>
          </div>

          {/* Pricing & Fair Split Highlight */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-bold text-slate-700">Self-Set Rate:</span>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900 font-mono">₹{worker.baseRate}</span>
                <span className="text-[11px] text-slate-500 block">{worker.rateType}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-200/80 flex justify-between text-[11px] text-emerald-800 font-semibold">
              <span>Worker receives: <strong>₹{Math.round(worker.baseRate * 0.95)} (95%)</strong></span>
              <span>Coop Welfare: <strong>3%</strong> • Tech Fee: <strong>2%</strong></span>
            </div>
          </div>

          {/* Cooperative Guild Credential */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Cooperative Guild Credential</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Guild Chapter:</span>
                <span className="font-semibold text-slate-800">{worker.coopUnit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Union Reg No:</span>
                <span className="font-mono font-bold text-slate-800">{worker.unionRegNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Experience:</span>
                <span className="font-semibold text-slate-800">{worker.experienceYears} Years</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Vouched By:</span>
                <span className="font-semibold text-slate-800">{worker.vouchedBy}</span>
              </div>
            </div>
          </div>

          {/* Skills & Tools */}
          <div>
            <h4 className="font-bold text-slate-800 mb-1.5">Skills & Specializations</h4>
            <div className="flex flex-wrap gap-1.5">
              {worker.skills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1.5">Verified Professional Tools</h4>
            <div className="flex flex-wrap gap-1.5">
              {worker.toolsOwned.map((tool, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-100 flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-blue-600" />
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Passbook Lifetime Summary */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Jobs Completed</span>
              <span className="text-base font-black text-slate-800 font-mono">{worker.completedJobs}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Retained Earnings</span>
              <span className="text-base font-black text-emerald-700 font-mono">₹{worker.totalEarnings?.toLocaleString('en-IN') || '42,000'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Welfare Fund Pool</span>
              <span className="text-base font-black text-amber-700 font-mono">₹{worker.coopWelfareContributed || '1,800'}</span>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
          
          <button
            onClick={() => {
              onClose();
              onBook(worker);
            }}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <span>Book {worker.name} Directly (₹{worker.baseRate})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
