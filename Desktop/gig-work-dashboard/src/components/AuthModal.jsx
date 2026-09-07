import React, { useState } from 'react';
import { 
  X, 
  User, 
  Wrench, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [role, setRole] = useState('customer'); // 'customer' | 'worker'
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otpOrPassword, setOtpOrPassword] = useState('');
  const [step, setStep] = useState(1); // 1: input, 2: otp
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setOtpSent(true);
    setStep(2);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (role === 'customer') {
      onLoginSuccess({
        id: 'user-c1',
        name: 'Rahul Verma',
        role: 'customer',
        email: phoneOrEmail.includes('@') ? phoneOrEmail : 'rahul.verma@example.com',
        phone: phoneOrEmail.includes('@') ? '+91 98450 77123' : phoneOrEmail,
        locality: 'Koramangala 5th Block, Bengaluru',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
    } else {
      onLoginSuccess({
        id: 'w-101',
        name: 'Ramesh Sharma',
        role: 'worker',
        trade: 'Electrician',
        email: phoneOrEmail.includes('@') ? phoneOrEmail : 'ramesh.sharma@example.com',
        phone: phoneOrEmail.includes('@') ? '+91 98450 21984' : phoneOrEmail,
        locality: 'Koramangala, Bengaluru',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
      });
    }
  };

  const handleQuickDemoLogin = (selectedRole) => {
    if (selectedRole === 'customer') {
      onLoginSuccess({
        id: 'user-c1',
        name: 'Rahul Verma',
        role: 'customer',
        email: 'rahul.verma@gmail.com',
        phone: '+91 98450 77123',
        locality: 'Koramangala 5th Block, Bengaluru',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
    } else {
      onLoginSuccess({
        id: 'w-101',
        name: 'Ramesh Sharma',
        role: 'worker',
        trade: 'Master Electrician',
        email: 'ramesh.sharma@gmail.com',
        phone: '+91 98450 21984',
        locality: 'Koramangala, Bengaluru',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900">Gig work Sign In</span>
          </div>
          <p className="text-xs text-slate-500">Access your personalized dashboard & booking controls.</p>
        </div>

        {/* Role Selector Pill */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 text-xs font-bold">
            <button
              onClick={() => { setRole('customer'); setStep(1); }}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                role === 'customer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              onClick={() => { setRole('worker'); setStep(1); }}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                role === 'worker'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Worker / Pro</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {role === 'customer' ? 'Mobile Number or Email' : 'Registered Worker Mobile / Phone'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'customer' ? '+91 98450 77123' : '+91 98450 21984'}
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Continue with OTP</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-3.5">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Demo OTP sent to {phoneOrEmail || '+91 98450...'}</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Enter 4-Digit OTP (Enter any 4 numbers)</label>
                <input
                  type="text"
                  maxLength="4"
                  required
                  placeholder="1 2 3 4"
                  value={otpOrPassword}
                  onChange={(e) => setOtpOrPassword(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Verify & Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Buttons for Fast Testing */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block text-center">
              Or 1-Click Quick Demo Sign In
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sign In as Customer (Rahul Verma)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('worker')}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-between border border-emerald-200/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sign In as Worker (Ramesh Sharma - Electrician)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-emerald-600" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
