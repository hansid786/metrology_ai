import React, { useState } from 'react';
import { 
  Wrench, 
  Coins, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { apiUpdateWorkerRateCard } from '../../services/api';

export default function WorkerProfileSettingsView() {
  const { currentUser, updateUserSession } = useAuth();
  const { showToast } = useNotifications();

  const [baseRate, setBaseRate] = useState('249');
  const [serviceRadiusKm, setServiceRadiusKm] = useState('12');
  const [skills, setSkills] = useState(['MCB Tripping Fix', 'Inverter Battery', 'Smart Switches', 'Earthing Test', 'Concealed Wiring']);
  const [newSkill, setNewSkill] = useState('');
  const [activePlan, setActivePlan] = useState('coop_free'); // 'coop_free' | 'pro_featured'

  const handleSaveRateCard = async (e) => {
    e.preventDefault();
    await apiUpdateWorkerRateCard(currentUser?.workerId || 'w-101', baseRate, skills);
    showToast('Rate card and skill tags updated successfully.');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (idx) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Professional Rate Card & Growth Plans</h1>
        <p className="text-xs text-slate-500 mt-0.5">Control your self-set visit rates, trade skills, and subscription visibility.</p>
      </div>

      {/* Rate Card & Radius Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="font-extrabold text-slate-900 text-sm">Self-Set Rate Card</h3>

        <form onSubmit={handleSaveRateCard} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Base Inspection / Labor Visit Fee (₹)</label>
              <input
                type="number"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono font-bold text-sm focus:bg-white focus:outline-none focus:border-slate-900"
              />
              <span className="text-[10px] text-emerald-800 font-semibold block mt-1">You receive 95%+ of this fee directly via UPI.</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Service Radius Ward (Kilometers)</label>
              <select
                value={serviceRadiusKm}
                onChange={(e) => setServiceRadiusKm(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="5">5 km (Immediate Ward only)</option>
                <option value="10">10 km (Standard City Ward)</option>
                <option value="15">15 km (Extended Metropolitan Area)</option>
                <option value="25">25 km (Greater City Area)</option>
              </select>
            </div>
          </div>

          {/* Specialized Skill Tags */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-700 block">Listed Skills & Equipment Capabilities</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  <span>{s}</span>
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-400 hover:text-rose-600 cursor-pointer">×</button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add new skill (e.g. Copper Braze, 3-Phase Wiring)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-5 rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Save Rate Card & Radius
          </button>
        </form>
      </div>

      {/* Subscription & Featured Plans (Section 11 Requirement) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Professional Membership Tier</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
            activePlan === 'coop_free' ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300'
          }`} onClick={() => setActivePlan('coop_free')}>
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Standard Cooperative
            </span>
            <h4 className="font-extrabold text-slate-900 text-base mt-2">Zero Fixed Cost (₹0/mo)</h4>
            <p className="text-xs text-slate-500 mt-1">95%+ direct payout on every completed booking. Zero advance subscription fees.</p>
            <ul className="text-xs text-slate-700 space-y-1.5 mt-3 pt-3 border-t border-slate-200/60">
              <li>✓ Unlimited nearby customer job leads</li>
              <li>✓ Instant direct UPI settlement</li>
              <li>✓ ₹2,00,000 Suraksha Health Cover</li>
            </ul>
          </div>

          <div className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
            activePlan === 'pro_featured' ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300'
          }`} onClick={() => { setActivePlan('pro_featured'); showToast('Pro Featured Tier activated! Top placement enabled.'); }}>
            <span className="text-[10px] uppercase font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
              Featured Listing Pro
            </span>
            <h4 className="font-extrabold text-slate-900 text-base mt-2">₹499 / Month</h4>
            <p className="text-xs text-slate-500 mt-1">Top placement in search directory and 3x more direct priority customer leads.</p>
            <ul className="text-xs text-slate-700 space-y-1.5 mt-3 pt-3 border-t border-slate-200/60">
              <li>✓ Top 1-3 placement in your city ward</li>
              <li>✓ Featured Gold Star Pro badge</li>
              <li>✓ Zero lead commission on first 20 jobs</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
