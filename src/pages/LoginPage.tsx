import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Lock, Mail, ArrowRight, UserCheck, AlertCircle,
  Building2, ShoppingBag, CheckCircle2, PhoneCall, Languages
} from 'lucide-react';
import { authService } from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from '../components/common/LanguageToggle';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [showCustomOfficerForm, setShowCustomOfficerForm] = useState(false);

  // Custom Officer Credentials
  const [officerEmail, setOfficerEmail] = useState('ravi.kumar@metrologylens.gov.in');
  const [officerPassword, setOfficerPassword] = useState('inspector123');
  const [error, setError] = useState<string | null>(null);

  // 1-Click Consumer Entry
  const handleCitizenProceed = () => {
    authService.loginAsCitizen();
    navigate('/consumer/scan');
  };

  // 1-Click Officer Entry
  const handleOfficerProceed = () => {
    authService.loginAsRole('INSPECTOR');
    navigate('/dashboard');
  };

  // Custom Email/Passcode Login
  const handleCustomOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authService.login(officerEmail, officerPassword);
    if (user) {
      navigate('/dashboard');
    } else {
      setError(
        lang === 'hi'
          ? 'अमान्य अधिकारी क्रेडेंशियल्स। कृपया आधिकारिक ईमेल और पासवर्ड जांचें।'
          : 'Invalid officer credentials. Please check your email and password.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-white selection:bg-blue-600 relative">
      {/* Tricolor Government Top Strip */}
      <div className="fixed top-0 left-0 right-0 h-1.5 flex">
        <div className="h-full w-1/3 bg-amber-500" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-emerald-500" />
      </div>

      {/* Language Switcher Top Right */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageToggle variant="dark" />
      </div>

      <div className="w-full max-w-2xl space-y-6 pt-4">
        {/* Government Identity Header */}
        <div className="text-center space-y-4">

          {/* ── Brand Logo + Name ── */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-900 flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 ring-4 ring-blue-500/20">
              <Shield className="w-10 h-10 text-white" />
            </div>

            {/* Idea / Product Name */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t('landingMainHeading')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
                {t('landingSubHeading')}
              </p>
            </div>
          </div>

          {/* 5-Step Process Pipeline Pill */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 max-w-xl mx-auto shadow-lg">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center mb-2">
              {lang === 'hi' ? '5-चरणीय सत्यापन प्रक्रिया' : '5-Step Verification Process'}
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">1</span>
                {t('flowCapture')}
              </span>
              <span className="text-slate-600">→</span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">2</span>
                {t('flowExtract')}
              </span>
              <span className="text-slate-600">→</span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
                {t('flowVerify')}
              </span>
              <span className="text-slate-600">→</span>
              <span className="flex items-center gap-1 text-purple-400">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">4</span>
                {t('flowExplain')}
              </span>
              <span className="text-slate-600">→</span>
              <span className="flex items-center gap-1 text-teal-400">
                <span className="w-4 h-4 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">5</span>
                {t('flowReport')}
              </span>
            </div>
          </div>

          {/* SIH Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Smart India Hackathon 2026 • PS: 26034</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
              <span>🇮🇳</span>
              <span>{t('deptName')}</span>
            </div>
          </div>
        </div>

        {/* Profile Selection Gateway Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black text-white">{t('selectProfile')}</h2>
            <p className="text-xs text-slate-400 font-medium">{t('selectProfileSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Consumer Card */}
            <div className="p-5 rounded-2xl border-2 border-emerald-500/60 bg-emerald-950/30 hover:bg-emerald-950/50 transition-all space-y-3 flex flex-col justify-between shadow-lg shadow-emerald-950/40">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{t('citizenCardTitle')}</h3>
                  <p className="text-xs text-emerald-400 font-bold">{t('citizenCardSub')}</p>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{lang === 'hi' ? 'किसी भी पैकेट को तुरंत स्कैन करें (चिप्स, तेल, दवाएं)' : 'Scan any packet (Chips, Oil, Medicines, Gadgets)'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{lang === 'hi' ? 'MRP और अधिक वसूली (USP) की जांच करें' : 'Check MRP & detect hidden overcharging (USP)'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{lang === 'hi' ? 'एक्सपायरी डेट व FSSAI / BIS लाइसेंस सत्यापन' : 'Verify Expiry Date & FSSAI / BIS License'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>{lang === 'hi' ? 'मुफ़्त त्वरित पहुंच (लॉगिन की आवश्यकता नहीं)' : 'Free Instant Access (No Login Needed)'}</strong></span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleCitizenProceed}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
              >
                <span>{t('startVerification')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Officer Card */}
            <div className="p-5 rounded-2xl border-2 border-blue-500/60 bg-blue-950/30 hover:bg-blue-950/50 transition-all space-y-3 flex flex-col justify-between shadow-lg shadow-blue-950/40">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{t('officerCardTitle')}</h3>
                  <p className="text-xs text-blue-400 font-bold">{t('officerCardSub')}</p>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>{lang === 'hi' ? 'वैधानिक बाजार निरीक्षण व डॉकेट निर्माण' : 'Conduct statutory market surveillance'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>{lang === 'hi' ? 'धारा 36(1) के तहत कानूनी नोटिस जारी करें' : 'Issue legal notices under Section 36(1)'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>{lang === 'hi' ? 'फॉर्म PC-1 आधिकारिक निरीक्षण रिपोर्ट तैयार करें' : 'Generate official Form PC-1 Inspection Reports'}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>{lang === 'hi' ? 'राष्ट्रीय एनालिटिक्स एवं नियम इंजन नियंत्रण' : 'National analytics & rule engine control'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <button
                  type="button"
                  onClick={handleOfficerProceed}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('loginAsOfficer')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomOfficerForm(!showCustomOfficerForm)}
                    className="text-[11px] text-slate-400 hover:text-blue-300 underline cursor-pointer"
                  >
                    {showCustomOfficerForm ? (lang === 'hi' ? 'पासकोड छुपाएं' : 'Hide Passcode Form') : t('officerPasscodeLogin')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Password Form */}
          {showCustomOfficerForm && (
            <div className="pt-4 border-t border-slate-800 space-y-3 animate-in fade-in">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-xs font-extrabold text-white">
                  {lang === 'hi' ? 'मैन्युअल अधिकारी प्रमाणीकरण' : 'Manual Officer Authentication'}
                </h3>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCustomOfficerLogin} className="space-y-3">
                {/* 1-Click Role Fillers */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {lang === 'hi' ? 'त्वरित परीक्षण क्रेडेंशियल्स:' : 'Quick Demo Officer Accounts:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {[
                      { role: 'INSPECTOR', label: '👮 Officer Ravi (LMO)', email: 'ravi.kumar@metrologylens.gov.in', pass: 'inspector123' },
                      { role: 'SUPERVISOR', label: '👩‍💼 Priya Nair (CLM)', email: 'priya.nair@metrologylens.gov.in', pass: 'supervisor123' },
                      { role: 'ADMIN', label: '🛡️ National Admin', email: 'admin@metrologylens.gov.in', pass: 'admin123' }
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => {
                          setOfficerEmail(item.email);
                          setOfficerPassword(item.pass);
                          authService.loginAsRole(item.role as any);
                          navigate('/dashboard');
                        }}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-700 text-left transition-all cursor-pointer"
                      >
                        <div className="text-[11px] font-black text-blue-300 truncate">{item.label}</div>
                        <div className="text-[9px] text-slate-500 font-mono truncate">{item.email}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {lang === 'hi' ? 'आधिकारिक ईमेल आईडी' : 'Official Email ID'}
                    </label>
                    <input
                      type="email"
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      placeholder="officer@metrologylens.gov.in"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {lang === 'hi' ? 'सुरक्षा पासकोड' : 'Security Passcode'}
                    </label>
                    <input
                      type="password"
                      value={officerPassword}
                      onChange={(e) => setOfficerPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>{lang === 'hi' ? 'क्रेडेंशियल्स के साथ लॉगिन करें' : 'Sign In with Credentials'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* National Consumer Helpline footer */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white">{t('helpline')}: </span>
                <span className="font-mono font-black text-amber-400 text-sm">1915</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">{t('deptName')}</span>
          </div>
        </div>

        {/* Legal Act Footnote */}
        <p className="text-[10px] text-center text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
          Legal Metrology Act, 2009 · Legal Metrology (Packaged Commodities) Rules, 2011 · Consumer Protection Act, 2019.
        </p>

        {/* SIH Official Hackathon Disclaimer */}
        <p className="text-xs text-center text-slate-400 font-medium">
          Prototype developed for Smart India Hackathon | Problem Statement ID: 26034. Demonstration Environment.
        </p>
      </div>
    </div>
  );
};
