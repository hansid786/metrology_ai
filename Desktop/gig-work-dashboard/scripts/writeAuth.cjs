const fs = require('fs');

const code = import React, { useState, useEffect } from 'react';
import { 
  User, 
  Wrench, 
  ShieldCheck, 
  Phone, 
  ArrowRight, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { sendPhoneOtp, verifyPhoneOtp } from '../../services/otpService';
import AddressAutocompleteInput from '../Common/AddressAutocompleteInput';

export default function AuthView({ onSuccess, initialMode = 'login' }) {
  const { login, register } = useAuth();
  const { showToast } = useNotifications();

  const [mode, setMode] = useState(initialMode);
  const [authMethod, setAuthMethod] = useState('otp');
  const [role, setRole] = useState('customer');

  // Phone & OTP state
  const [phone, setPhone] = useState('9845077123');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [debugOtpHint, setDebugOtpHint] = useState('');

  // Register Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [trade, setTrade] = useState('AC Repair');
  const [locality, setLocality] = useState('Gomti Nagar, Lucknow');
  const [baseRate, setBaseRate] = useState('349');
  const [experienceYears, setExperienceYears] = useState('6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (channel = 'sms') => {
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await sendPhoneOtp(phone, channel);
      if (res.success) {
        setOtpSent(true);
        setCountdown(60);
        setDebugOtpHint(res.debugOtp);
        showToast(res.message);
      } else {
        showToast(res.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtpAndLogin = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      showToast('Please enter the verification code');
      return;
    }

    setIsSubmitting(true);
    try {
      const otpRes = await verifyPhoneOtp(phone, otpCode);
      if (!otpRes.success) {
        showToast(otpRes.error);
        return;
      }

      const res = await login(phone, 'otp_verified', role);
      if (res.success) {
        showToast(\Welcome back, \!\);
        if (onSuccess) onSuccess(res.user);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await login(phone || email || '9845021984', 'password123', role);
      if (res.success) {
        showToast(\Welcome back, \!\);
        if (onSuccess) onSuccess(res.user);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: fullName || (role === 'worker' ? 'Arjun Singh' : 'Hanzala'),
        phone: phone ? \+91 \\ : '+91 98450 21984',
        email: email || \\@example.com\,
        role,
        trade,
        locality,
        baseRate,
        experienceYears
      });

      if (res.success) {
        showToast('Account created successfully! Welcome to the marketplace.');
        if (onSuccess) onSuccess(res.user);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setIsSubmitting(true);
    try {
      if (demoRole === 'admin') {
        const res = await login('admin@doorstep-pro.in', 'admin123', 'admin');
        if (res.success && onSuccess) onSuccess(res.user);
        return;
      }
      if (demoRole === 'worker') {
        const res = await login('9845021984', 'worker123', 'worker');
        if (res.success && onSuccess) onSuccess(res.user);
        return;
      }
      const res = await login('9845077123', 'customer123', 'customer');
      if (res.success && onSuccess) onSuccess(res.user);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 font-['Plus_Jakarta_Sans',sans-serif]>
      
      {/* Brand & Editorial Headline */}
      <div className=max-w-md w-full text-center space-y-2 mb-6>
        <div className=inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold>
          <span className=w-2 h-2 rounded-full bg-emerald-600 animate-pulse></span>
          <span>Hyperlocal Services Marketplace • Live Authentication</span>
        </div>

        <h1 className=text-2xl sm:text-3xl font-black text-slate-900 tracking-tight>
          {mode === 'login' ? 'Sign In with Mobile OTP' : 'Join as a Customer or Partner'}
        </h1>
        <p className=text-xs text-slate-500 font-medium>
          Verified technicians & instant doorstep repairs in Lucknow & Bengaluru.
        </p>
      </div>

      {/* Main Card */}
      <div className=max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6>
        
        {/* Mode Switcher */}
        <div className=grid grid-cols-2 gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold>
          <button
            type=button
            onClick={() => { setMode('login'); setOtpSent(false); }}
            className={py-2.5 rounded-xl transition-all cursor-pointer }
          >
            Sign In (OTP / Pass)
          </button>
          <button
            type=button
            onClick={() => setMode('register')}
            className={py-2.5 rounded-xl transition-all cursor-pointer }
          >
            New Registration
          </button>
        </div>

        {/* Role Selection */}
        <div className=space-y-1.5>
          <label className=text-[11px] font-bold text-slate-500 uppercase tracking-wider block>
            Select Account Role
          </label>
          <div className=grid grid-cols-2 gap-2>
            <button
              type=button
              onClick={() => {
                setRole('customer');
                setPhone('9845077123');
              }}
              className={p-3.5 rounded-2xl border text-left transition-all cursor-pointer }
            >
              <div className=flex items-center gap-2.5>
                <div className={w-8 h-8 rounded-xl flex items-center justify-center }>
                  <User className=w-4 h-4 />
                </div>
                <div>
                  <span className=text-xs font-black block text-slate-900>Customer</span>
                  <span className=text-[10px] text-slate-500>Book Services</span>
                </div>
              </div>
            </button>

            <button
              type=button
              onClick={() => {
                setRole('worker');
                setPhone('9845021984');
              }}
              className={p-3.5 rounded-2xl border text-left transition-all cursor-pointer }
            >
              <div className=flex items-center gap-2.5>
                <div className={w-8 h-8 rounded-xl flex items-center justify-center }>
                  <Wrench className=w-4 h-4 />
                </div>
                <div>
                  <span className=text-xs font-black block text-slate-900>Partner Pro</span>
                  <span className=text-[10px] text-slate-500>Receive Jobs</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        {mode === 'login' ? (
          <div className=space-y-4>
            
            {/* Auth Tab: OTP vs Password */}
            <div className=flex justify-between items-center text-xs pb-1 border-b border-slate-100>
              <span className=font-bold text-slate-700>Verification Method</span>
              <div className=flex gap-3>
                <button
                  type=button
                  onClick={() => setAuthMethod('otp')}
                  className={	ext-xs font-bold cursor-pointer transition-colors }
                >
                  6-Digit Phone OTP
                </button>
                <button
                  type=button
                  onClick={() => setAuthMethod('password')}
                  className={	ext-xs font-bold cursor-pointer transition-colors }
                >
                  Password
                </button>
              </div>
            </div>

            {authMethod === 'otp' ? (
              <form onSubmit={handleVerifyOtpAndLogin} className=space-y-4 text-xs>
                <div>
                  <label className=font-bold text-slate-700 block mb-1>
                    Enter 10-Digit Mobile Number
                  </label>
                  <div className=relative flex items-center>
                    <span className=absolute left-3.5 text-xs font-bold text-slate-400>+91</span>
                    <input
                      type=tel
                      required
                      maxLength=10
                      placeholder=98450 77123
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className=w-full pl-12 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-mono text-xs font-bold
                    />
                    <button
                      type=button
                      disabled={isSubmitting || countdown > 0}
                      onClick={() => handleSendOtp('sms')}
                      className=absolute right-1.5 px-3 py-1.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer
                    >
                      {countdown > 0 ? ${countdown}s : (otpSent ? 'Resend' : 'Send OTP')}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className=space-y-3 animate-in fade-in slide-in-from-top-2 duration-200>
                    <div>
                      <div className=flex justify-between items-center mb-1>
                        <label className=font-bold text-slate-700>Enter 6-Digit OTP</label>
                        {debugOtpHint && (
                          <span className=text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded-md>
                            Code: {debugOtpHint}
                          </span>
                        )}
                      </div>
                      <input
                        type=text
                        maxLength=6
                        required
                        autoFocus
                        placeholder=••••••
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className=w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-mono text-center tracking-[0.4em] font-black text-sm
                      />
                    </div>

                    <div className=flex items-center justify-between text-[11px] text-slate-500>
                      <button
                        type=button
                        onClick={() => handleSendOtp('whatsapp')}
                        className=text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer
                      >
                        <MessageSquare className=w-3.5 h-3.5 text-emerald-600 />
                        <span>Get OTP on WhatsApp</span>
                      </button>

                      {countdown > 0 && (
                        <span>Resend in {countdown}s</span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type=submit
                  disabled={isSubmitting || (!otpSent && phone.length < 10)}
                  className=w-full bg-slate-900 hover:bg-emerald-800 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50
                >
                  <span>{isSubmitting ? 'Verifying OTP...' : (otpSent ? 'Verify & Enter Dashboard' : 'Continue with Phone')}</span>
                  <ArrowRight className=w-4 h-4 />
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordLogin} className=space-y-4 text-xs>
                <div>
                  <label className=font-bold text-slate-700 block mb-1>
                    Mobile Number / Registered Email
                  </label>
                  <input
                    type=text
                    required
                    placeholder={role === 'customer' ? '98450 77123' : '98450 21984'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className=w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium
                  />
                </div>

                <div>
                  <label className=font-bold text-slate-700 block mb-1>Account Password</label>
                  <input
                    type=password
                    required
                    defaultValue=••••••••
                    className=w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-mono
                  />
                </div>

                <button
                  type=submit
                  disabled={isSubmitting}
                  className=w-full bg-slate-900 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50
                >
                  <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
                  <ArrowRight className=w-4 h-4 />
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleRegister} className=space-y-3.5 text-xs>
            <div>
              <label className=font-bold text-slate-700 block mb-1>Full Legal Name</label>
              <input
                type=text
                required
                placeholder={role === 'worker' ? 'Arjun Singh' : 'Hanzala'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className=w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium
              />
            </div>

            <div>
              <label className=font-bold text-slate-700 block mb-1>Mobile Number (For OTP Verification)</label>
              <div className=relative flex items-center>
                <span className=absolute left-3.5 text-xs font-bold text-slate-400>+91</span>
                <input
                  type=tel
                  required
                  maxLength=10
                  placeholder=98450 21984
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className=w-full pl-12 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-mono font-bold
                />
              </div>
            </div>

            <div>
              <label className=font-bold text-slate-700 block mb-1>Service Address / Locality</label>
              <AddressAutocompleteInput
                value={locality}
                onChange={(val) => setLocality(val)}
                onSelectAddress={(addr) => setLocality(addr.description)}
                placeholder=Type sector or detect GPS...
              />
            </div>

            {role === 'worker' && (
              <div className=grid grid-cols-2 gap-2>
                <div>
                  <label className=font-bold text-slate-700 block mb-1>Primary Trade</label>
                  <select
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    className=w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium
                  >
                    <option value=AC Repair>AC Repair</option>
                    <option value=Plumbing>Plumbing</option>
                    <option value=Electrical>Electrical</option>
                    <option value=Carpentry>Carpentry</option>
                    <option value=Deep Cleaning>Deep Cleaning</option>
                    <option value=RO & Water Purifier>RO Purifier</option>
                    <option value=Painting>Painting</option>
                    <option value=Vehicle Mechanic>Mechanic</option>
                  </select>
                </div>

                <div>
                  <label className=font-bold text-slate-700 block mb-1>Starting Rate (₹)</label>
                  <input
                    type=number
                    required
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    className=w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-mono
                  />
                </div>
              </div>
            )}

            <button
              type=submit
              disabled={isSubmitting}
              className=w-full bg-slate-900 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50
            >
              <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className=w-4 h-4 />
            </button>
          </form>
        )}

        {/* 1-Click Fast Demo Logins */}
        <div className=pt-4 border-t border-slate-100 space-y-2>
          <span className=text-[10px] text-slate-400 uppercase font-black tracking-wider block text-center>
            One-Click Quick Logins
          </span>

          <div className=grid grid-cols-1 gap-2>
            <button
              type=button
              onClick={() => handleQuickDemo('customer')}
              className=w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer
            >
              <div className=flex items-center gap-2>
                <span className=w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs>C</span>
                <span>Customer Portal (Hanzala)</span>
              </div>
              <ChevronRight className=w-4 h-4 text-slate-400 />
            </button>

            <button
              type=button
              onClick={() => handleQuickDemo('worker')}
              className=w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer
            >
              <div className=flex items-center gap-2>
                <span className=w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs>W</span>
                <span>Partner Pro (Arjun Singh - AC Specialist)</span>
              </div>
              <ChevronRight className=w-4 h-4 text-slate-400 />
            </button>

            <button
              type=button
              onClick={() => handleQuickDemo('admin')}
              className=w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer
            >
              <div className=flex items-center gap-2>
                <span className=w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs>A</span>
                <span>Platform Operations Control Center</span>
              </div>
              <ChevronRight className=w-4 h-4 text-slate-400 />
            </button>
          </div>
        </div>

      </div>

      {/* Trust Guarantee Footer */}
      <div className=mt-6 flex items-center gap-4 text-xs text-slate-400>
        <span className=flex items-center gap-1>
          <ShieldCheck className=w-3.5 h-3.5 text-emerald-700 />
          <span>Aadhaar KYC Verified</span>
        </span>
        <span>•</span>
        <span>95%+ Direct Worker Payout</span>
        <span>•</span>
        <span>Zero Hidden Fees</span>
      </div>

    </div>
  );
}
;

fs.writeFileSync('src/components/views/AuthView.jsx', code, 'utf8');
console.log('Successfully wrote src/components/views/AuthView.jsx');
