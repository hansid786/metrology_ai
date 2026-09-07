import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Wrench, 
  MapPin, 
  Coins, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Phone,
  Building2,
  FileCheck
} from 'lucide-react';
import { TRADES_LIST, COOPERATIVE_CHAPTERS } from '../../data/mockData';

export default function SelfRegisterWorkerModal({ onClose, onRegisterSuccess }) {
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('Electrician');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [coopChapter, setCoopChapter] = useState(COOPERATIVE_CHAPTERS[1]?.name || 'Bengaluru South Shramik Guild');
  
  const [baseRate, setBaseRate] = useState(400);
  const [rateType, setRateType] = useState('Base inspection + labor');
  const [skillsInput, setSkillsInput] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [kycType, setKycType] = useState('Aadhaar + Govt Trade Certificate');
  const [vouchedBy, setVouchedBy] = useState('Ward Guild Steward');
  const [bio, setBio] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete Registration
      const skillsArray = skillsInput
        ? skillsInput.split(',').map(s => s.trim()).filter(Boolean)
        : ['General Maintenance', 'Inspection', 'Quick Fixes'];

      const toolsArray = toolsInput
        ? toolsInput.split(',').map(t => t.trim()).filter(Boolean)
        : ['Standard Professional Tool Kit'];

      const newWorker = {
        id: `w-${Date.now().toString().slice(-4)}`,
        name: name || 'New Karigar Member',
        trade: trade,
        specialty: specialty || `${trade} Specialist`,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?w=150&auto=format&fit=crop&q=80`,
        experienceYears: Number(experienceYears) || 3,
        locality: locality || 'Koramangala, Bengaluru',
        coopUnit: coopChapter,
        unionRegNo: `GUILD-${new Date().getFullYear()}-${trade.slice(0,2).toUpperCase()}-${Math.floor(100 + Math.random()*900)}`,
        rating: 5.0,
        reviewsCount: 1,
        baseRate: Number(baseRate) || 400,
        rateType: rateType,
        phone: phone || '+91 98000 12345',
        status: 'online',
        verificationStatus: 'pending_review',
        kycType: kycType,
        vouchedBy: vouchedBy,
        skills: skillsArray,
        toolsOwned: toolsArray,
        totalEarnings: 0,
        coopWelfareContributed: 0,
        completedJobs: 0,
        joinedDate: 'Just Now',
        bio: bio || `Self-registered ${trade} with ${experienceYears} years experience. Direct pricing, no middleman.`
      };

      onRegisterSuccess(newWorker);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <UserPlus className="w-4 h-4" />
            <span>Worker Self-Registration Hub</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">Join the Cooperative Platform</h3>
          <p className="text-xs text-emerald-200 mt-0.5">
            You own your profile, set your own rates, and keep 95%+ of your customer earnings.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-400' : 'bg-white/20'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-400' : 'bg-white/20'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-400' : 'bg-white/20'}`}></div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNext} className="p-6 space-y-4 text-xs">
          
          {/* Step 1: Basic Profile & Trade */}
          {step === 1 && (
            <div className="space-y-3.5">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span>Step 1: Your Identity & Trade Guild</span>
              </h4>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name (as per Aadhaar)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar, Sunita Devi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Trade</label>
                  <select
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {TRADES_LIST.filter(t => t !== 'All Trades').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Locality / Ward</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Koramangala, Bengaluru or Dadar, Mumbai"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Local Cooperative Chapter</label>
                <select
                  value={coopChapter}
                  onChange={(e) => setCoopChapter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {COOPERATIVE_CHAPTERS.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.city})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Skills, Specialization & Self-Set Rates */}
          {step === 2 && (
            <div className="space-y-3.5">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span>Step 2: Skills, Tool Inventory & Pricing</span>
              </h4>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Trade Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Inverter AC Jet Servicing, MCB Distribution Panels"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Base Rate (₹)</label>
                  <input
                    type="number"
                    min="150"
                    step="50"
                    required
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                    You receive ₹{Math.round(baseRate * 0.95)} (95%)
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rate Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Inspection + 1 hr labor"
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Key Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. House Wiring, Smart Switches, Earthing, Inverter Repair"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Professional Tools Owned</label>
                <input
                  type="text"
                  placeholder="e.g. Bosch Hammer Drill, Fluke Multimeter, Pressure Jet"
                  value={toolsInput}
                  onChange={(e) => setToolsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {/* Step 3: Verification & KYC */}
          {step === 3 && (
            <div className="space-y-3.5">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span>Step 3: Cooperative KYC & Peer Endorsement</span>
              </h4>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Trust & Verification Process</span>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Your local ward cooperative verifies your credentials. Once approved, you gain the <strong>Verified Karigar Badge</strong> and automatic eligibility for the ₹2,00,000 Suraksha Health Cover.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document for Verification</label>
                <select
                  value={kycType}
                  onChange={(e) => setKycType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="Aadhaar + ITI Trade Certificate">Aadhaar + ITI Trade Certificate</option>
                  <option value="Aadhaar + Govt Wireman/Plumber License">Aadhaar + Govt Wireman/Plumber License</option>
                  <option value="Aadhaar + Police Clearance + Guild Endorsement">Aadhaar + Police Clearance + Guild Endorsement</option>
                  <option value="Commercial Driving License + Police Verification">Commercial Driving License + Police Verification</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Peer Endorsement / Vouched By</label>
                <input
                  type="text"
                  placeholder="Name of Senior Guild Steward or Peer Worker"
                  value={vouchedBy}
                  onChange={(e) => setVouchedBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Worker Bio / Description</label>
                <textarea
                  rows="2"
                  placeholder="Share a short note on your experience and work ethos..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>{step === 3 ? 'Complete Self-Registration' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
