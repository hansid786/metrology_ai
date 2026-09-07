import React, { useState } from 'react';
import { 
  HeartHandshake, 
  User, 
  Wrench, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Coins,
  MapPin,
  ChevronRight,
  Star,
  Check
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [role, setRole] = useState('customer'); // 'customer' | 'worker'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: phone, 2: otp

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone) return;
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (role === 'customer') {
      onLoginSuccess({
        id: 'user-c1',
        name: 'Hanzala',
        role: 'customer',
        email: 'hanzala@example.com',
        phone: phone ? `+91 ${phone}` : '+91 98450 77123',
        locality: 'Gomti Nagar, Lucknow',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
    } else {
      onLoginSuccess({
        id: 'w-101',
        name: 'Arjun Singh',
        role: 'worker',
        trade: 'AC Repair',
        email: 'arjun.singh@example.com',
        phone: phone ? `+91 ${phone}` : '+91 98450 21984',
        locality: 'Gomti Nagar, Lucknow',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
      });
    }
  };

  const handleQuickDemo = (selectedRole) => {
    if (selectedRole === 'customer') {
      onLoginSuccess({
        id: 'user-c1',
        name: 'Hanzala',
        role: 'customer',
        email: 'hanzala@example.com',
        phone: '+91 98450 77123',
        locality: 'Gomti Nagar, Lucknow',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
    } else if (selectedRole === 'worker') {
      onLoginSuccess({
        id: 'w-101',
        name: 'Arjun Singh',
        role: 'worker',
        trade: 'AC Repair',
        email: 'arjun.singh@example.com',
        phone: '+91 98450 21984',
        locality: 'Gomti Nagar, Lucknow',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
      });
    } else {
      onLoginSuccess({
        id: 'admin-1',
        name: 'Operations Lead',
        role: 'admin',
        email: 'admin@doorstep-pro.in',
        phone: '+91 80 4492 8800',
        locality: 'Lucknow Central',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between py-8 px-4 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Brand Header */}
      <div className="max-w-md w-full mx-auto text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>Hyperlocal Services Marketplace • Lucknow</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Doorstep Pro Services
        </h1>
        <p className="text-xs text-slate-500">Find the right professional. Right at your doorstep.</p>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
        
        {/* Role Toggle */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Select Your Account Type
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'customer'
                  ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-2xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${role === 'customer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black block text-slate-900">Customer</span>
                  <span className="text-[10px] text-slate-500">Book Services</span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'worker'
                  ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-2xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${role === 'worker' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black block text-slate-900">Professional</span>
                  <span className="text-[10px] text-slate-500">Accept Jobs</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 1: Mobile */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {role === 'customer' ? 'Customer Mobile Number' : 'Technician Mobile Number'}
              </label>
              <input
                type="tel"
                required
                placeholder={role === 'customer' ? '98450 77123' : '98450 21984'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Get OTP on WhatsApp / SMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Enter 4-Digit OTP</label>
                <button type="button" onClick={() => setStep(1)} className="text-[11px] text-emerald-700 hover:underline">
                  Change Number
                </button>
              </div>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="4 4 9 2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-center tracking-widest font-mono text-lg font-bold focus:outline-none focus:bg-white focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Demo Fast Access */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block text-center">
            One-Click Test Profiles
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">C</span>
                <span>Customer (Hanzala / Lucknow)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('worker')}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">W</span>
                <span>Worker (Arjun Singh - AC Specialist)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 mt-4">
        <p>🔒 100% Verified Local Professionals • Zero Markup Commission</p>
      </div>

    </div>
  );
}
