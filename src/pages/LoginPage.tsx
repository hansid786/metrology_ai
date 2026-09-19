import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Lock, Mail, ArrowRight, UserCheck, AlertCircle,
  Building2, ShoppingBag, CheckCircle2, PhoneCall, Sparkles, Landmark,
  Scale, ScanLine
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

  // 1-Click Officer Entry (Demo / SIH Hackathon mode)
  const handleOfficerProceed = () => {
    try {
      authService.loginAsRole('INSPECTOR');
      navigate('/dashboard');
    } catch (loginError) {
      setShowCustomOfficerForm(true);
      setError(lang === 'hi'
        ? 'Officer login के लिए Supabase account configure करें या demo mode enable करें।'
        : 'Configure a Supabase officer account or enable demo mode for officer access.');
    }
  };

  // Custom Email/Passcode Login (Supabase or demo fallback)
  const handleCustomOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = await authService.loginWithSupabase(officerEmail, officerPassword);
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
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800 selection:bg-emerald-600 selection:text-white relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 10% 15%, rgba(16, 185, 129, 0.16) 0%, transparent 40%),
          radial-gradient(circle at 90% 12%, rgba(99, 102, 241, 0.16) 0%, transparent 42%),
          radial-gradient(circle at 50% 85%, rgba(244, 63, 94, 0.10) 0%, transparent 45%),
          linear-gradient(145deg, #f8fafc 0%, #f0fdf4 35%, #eff6ff 70%, #faf5ff 100%)
        `
      }}
    >
      {/* Tricolor Government Top Strip */}
      <div className="fixed top-0 left-0 right-0 h-1.5 flex z-30 shadow-xs">
        <div className="h-full w-1/3 bg-amber-500" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-emerald-500" />
      </div>

      {/* Language Switcher Top Right */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageToggle variant="light" />
      </div>

      <div className="w-full max-w-2xl space-y-6 pt-4 page-enter">
        {/* Government Identity Header */}
        <div className="text-center space-y-4">

          {/* ── Official Government & MetrologyLens Brand Logo ── */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 border-2 border-white ring-8 ring-emerald-500/10 transform hover:scale-105 transition-transform">
                <div className="relative flex items-center justify-center">
                  <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                    <ScanLine className="w-3 h-3 text-slate-950 font-black" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'hi' ? 'भारत सरकार' : 'GOVT. OF INDIA'}</span>
              </span>
              <span>•</span>
              <span className="text-indigo-700 font-extrabold uppercase tracking-wider text-[11px]">
                {lang === 'hi' ? 'विधिक मापविज्ञान प्रभाग' : 'LEGAL METROLOGY DIVISION'}
              </span>
            </div>
          </div>

          {/* ── Heading & Badges ── */}
          <div className="flex flex-col items-center gap-3">
            {/* Idea / Product Name */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200/80 shadow-xs text-xs font-bold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI-Powered Legal Metrology Verification Engine</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                {t('landingMainHeading')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
                {t('landingSubHeading')}
              </p>
            </div>
          </div>

          {/* 5-Step Process Pipeline Pill */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3.5 max-w-xl mx-auto shadow-sm">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center mb-2.5">
              {lang === 'hi' ? '5-चरणीय सत्यापन प्रक्रिया' : '5-Step Optical Verification Pipeline'}
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 flex-wrap gap-1">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-black">1</span>
                {t('flowCapture')}
              </span>
              <span className="text-slate-300 font-black">→</span>
              <span className="flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[9px] font-black">2</span>
                {t('flowExtract')}
              </span>
              <span className="text-slate-300 font-black">→</span>
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[9px] font-black">3</span>
                {t('flowVerify')}
              </span>
              <span className="text-slate-300 font-black">→</span>
              <span className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-black">4</span>
                {t('flowExplain')}
              </span>
              <span className="text-slate-300 font-black">→</span>
              <span className="flex items-center gap-1.5 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[9px] font-black">5</span>
                {t('flowReport')}
              </span>
            </div>
          </div>

          {/* SIH Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Smart India Hackathon 2026 • PS: 26034</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs">
              <Landmark className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('deptName')}</span>
            </div>
          </div>
        </div>

        {/* Profile Selection Gateway Box */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">{t('selectProfile')}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('selectProfileSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Consumer Card */}
            <div className="p-5 rounded-2xl border-2 border-emerald-400/80 bg-gradient-to-b from-emerald-50/80 via-white to-white hover:border-emerald-500 transition-all duration-200 space-y-3 flex flex-col justify-between shadow-md shadow-emerald-500/10 card-hover">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{t('citizenCardTitle')}</h3>
                  <p className="text-xs text-emerald-700 font-bold">{t('citizenCardSub')}</p>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-2 pt-2 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'किसी भी पैकेट को तुरंत स्कैन करें (चिप्स, तेल, दवाएं)' : 'Scan any packet (Chips, Oil, Medicines, Gadgets)'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'MRP और अधिक वसूली (USP) की जांच करें' : 'Check MRP & detect hidden overcharging (USP)'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'एक्सपायरी डेट व FSSAI / BIS लाइसेंस सत्यापन' : 'Verify Expiry Date & FSSAI / BIS License'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-800">{lang === 'hi' ? 'मुफ़्त त्वरित पहुंच (लॉगिन की आवश्यकता नहीं)' : 'Free Instant Access (No Login Needed)'}</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleCitizenProceed}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer btn-press"
              >
                <span>{t('startVerification')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Officer Card */}
            <div className="p-5 rounded-2xl border-2 border-indigo-400/80 bg-gradient-to-b from-indigo-50/80 via-white to-white hover:border-indigo-500 transition-all duration-200 space-y-3 flex flex-col justify-between shadow-md shadow-indigo-500/10 card-hover">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{t('officerCardTitle')}</h3>
                  <p className="text-xs text-indigo-700 font-bold">{t('officerCardSub')}</p>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-2 pt-2 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'वैधानिक बाजार निरीक्षण व डॉकेट निर्माण' : 'Conduct statutory market surveillance'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'धारा 36(1) के तहत कानूनी नोटिस जारी करें' : 'Issue legal notices under Section 36(1)'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'फॉर्म PC-1 आधिकारिक निरीक्षण रिपोर्ट तैयार करें' : 'Generate official Form PC-1 Inspection Reports'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'राष्ट्रीय एनालिटिक्स एवं नियम इंजन नियंत्रण' : 'National analytics & rule engine control'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <button
                  type="button"
                  onClick={handleOfficerProceed}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer btn-press"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('loginAsOfficer')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomOfficerForm(!showCustomOfficerForm)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                  >
                    {showCustomOfficerForm ? (lang === 'hi' ? 'पासकोड छुपाएं' : 'Hide Passcode Form') : t('officerPasscodeLogin')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Password Form */}
          {showCustomOfficerForm && (
            <div className="pt-4 border-t border-slate-200 space-y-3.5 fade-in">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-slate-800">
                  {lang === 'hi' ? 'मैन्युअल अधिकारी प्रमाणीकरण' : 'Manual Officer Authentication (Demo / Production)'}
                </h3>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCustomOfficerLogin} className="space-y-3">
                {/* 1-Click Role Fillers */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    {lang === 'hi' ? 'त्वरित परीक्षण क्रेडेंशियल्स:' : 'Quick Demo Officer Accounts:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { role: 'INSPECTOR', label: 'Officer Ravi (LMO)', email: 'ravi.kumar@metrologylens.gov.in', pass: 'inspector123', icon: UserCheck, color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100' },
                      { role: 'SUPERVISOR', label: 'Priya Nair (CLM)', email: 'priya.nair@metrologylens.gov.in', pass: 'supervisor123', icon: Shield, color: 'border-indigo-200 bg-indigo-50/60 text-indigo-900 hover:bg-indigo-100' },
                      { role: 'ADMIN', label: 'National Admin', email: 'admin@metrologylens.gov.in', pass: 'admin123', icon: Lock, color: 'border-purple-200 bg-purple-50/60 text-purple-900 hover:bg-purple-100' }
                    ].map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => {
                            setOfficerEmail(item.email);
                            setOfficerPassword(item.pass);
                            authService.loginAsRole(item.role as any);
                            navigate('/dashboard');
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer btn-press ${item.color}`}
                        >
                          <div className="text-[11px] font-black truncate flex items-center gap-1.5">
                            <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono truncate">{item.email}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'hi' ? 'आधिकारिक ईमेल आईडी' : 'Official Email ID'}
                    </label>
                    <input
                      type="email"
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                      placeholder="officer@metrologylens.gov.in"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'hi' ? 'सुरक्षा पासकोड' : 'Security Passcode'}
                    </label>
                    <input
                      type="password"
                      value={officerPassword}
                      onChange={(e) => setOfficerPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all btn-press"
                >
                  <span>{lang === 'hi' ? 'क्रेडेंशियल्स के साथ लॉगिन करें' : 'Sign In with Credentials'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* National Consumer Helpline footer */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
              </div>
              <div>
                <span className="font-bold text-slate-700">{t('helpline')}: </span>
                <span className="font-mono font-black text-amber-800 text-sm">1915</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-600 font-semibold">{t('deptName')}</span>
          </div>
        </div>

        {/* Legal Act Footnote */}
        <p className="text-[10px] text-center text-slate-400 leading-relaxed max-w-md mx-auto font-medium">
          Legal Metrology Act, 2009 · Legal Metrology (Packaged Commodities) Rules, 2011 · Consumer Protection Act, 2019.
        </p>

        {/* SIH Official Hackathon Disclaimer */}
        <p className="text-xs text-center text-slate-500 font-semibold">
          Prototype developed for Smart India Hackathon | Problem Statement ID: 26034. Demonstration Environment.
        </p>
      </div>
    </div>
  );
};
