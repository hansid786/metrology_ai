import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Lock, Mail, ArrowRight, UserCheck, AlertCircle,
  Building2, ShoppingBag, CheckCircle2, PhoneCall, Sparkles,
  Camera, Cpu, FileCheck2, Scale, Zap
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

  // Custom Email/Passcode Login
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
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 25%, #1e1b4b 55%, #312e81 80%, #065f46 100%)'
      }}
    >
      {/* ── Glowing Colorful Background Orbs ── */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/25 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      <div className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      {/* Tricolor Government Top Strip */}
      <div className="fixed top-0 left-0 right-0 h-1.5 flex z-30 shadow-lg">
        <div className="h-full w-1/3 bg-amber-500" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-emerald-500" />
      </div>

      {/* Language Switcher Top Right */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageToggle variant="dark" />
      </div>

      <div className="w-full max-w-3xl space-y-6 pt-4 relative z-10 page-enter">
        {/* Government Identity Header */}
        <div className="text-center space-y-4">

          {/* ── Brand Logo + Name ── */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 opacity-75 blur-lg group-hover:opacity-100 transition-all duration-500 animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl border-2 border-white/40">
                <Shield className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI-Powered Legal Metrology Engine</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span>Smart India Hackathon 2026 • PS: 26034</span>
              </div>
            </div>

            {/* Main Headings */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                MetrologyLens <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 text-transparent bg-clip-text">AI</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
                {lang === 'hi'
                  ? 'पैकेज्ड वस्तुओं के लिए भारत का पहला एआई-संवर्धित विधिक मापविज्ञान एवं उपभोक्ता संरक्षण पोर्टल'
                  : "India's 1st AI Optical Verification Platform under Legal Metrology (Packaged Commodities) Rules, 2011"}
              </p>
            </div>
          </div>

          {/* 5-Step Process Pipeline with Colorful Glass Cards */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 max-w-2xl mx-auto shadow-2xl">
            <div className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest text-center mb-2.5 flex items-center justify-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{lang === 'hi' ? '5-चरणीय स्वचालित सत्यापन प्रवाह' : '5-Step Optical Verification Pipeline'}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[
                { step: '1', title: t('flowCapture'), icon: '📸', color: 'from-emerald-500/30 to-emerald-600/30 border-emerald-400/50 text-emerald-200' },
                { step: '2', title: t('flowExtract'), icon: '🔍', color: 'from-sky-500/30 to-sky-600/30 border-sky-400/50 text-sky-200' },
                { step: '3', title: t('flowVerify'),  icon: '⚖️', color: 'from-amber-500/30 to-amber-600/30 border-amber-400/50 text-amber-200' },
                { step: '4', title: t('flowExplain'), icon: '💡', color: 'from-purple-500/30 to-purple-600/30 border-purple-400/50 text-purple-200' },
                { step: '5', title: t('flowReport'),  icon: '📋', color: 'from-rose-500/30 to-rose-600/30 border-rose-400/50 text-rose-200' },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`bg-gradient-to-b ${item.color} border rounded-xl p-2 flex flex-col items-center justify-center gap-1 shadow-sm`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[10px] font-black leading-tight truncate w-full">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Role Selection Container (Frosted Glass) ── */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white">{t('selectProfile')}</h2>
            <p className="text-xs text-slate-300 font-medium">{t('selectProfileSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ── Card 1: Consumer Card (Emerald-Teal Theme) ── */}
            <div className="relative rounded-2xl p-5 bg-gradient-to-b from-emerald-900/60 via-slate-900/80 to-slate-900/90 border-2 border-emerald-400/80 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-emerald-950/50 group card-hover">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-md uppercase tracking-wider">
                ⚡ Instant Access
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    <span>{t('citizenCardTitle')}</span>
                  </h3>
                  <p className="text-xs text-emerald-300 font-bold mt-0.5">{t('citizenCardSub')}</p>
                </div>

                <ul className="text-[11px] text-slate-200 space-y-2 pt-1 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'किसी भी पैकेट को तुरंत स्कैन करें (चिप्स, तेल, दवाएं)' : 'Scan any packet (Chips, Oil, Medicines, Gadgets)'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'MRP और अधिक वसूली (USP) की जांच करें' : 'Check MRP & detect hidden overcharging (USP)'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'एक्सपायरी डेट व FSSAI / BIS लाइसेंस सत्यापन' : 'Verify Expiry Date & FSSAI / BIS License'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-300">{lang === 'hi' ? 'मुफ़्त त्वरित पहुंच (लॉगिन की आवश्यकता नहीं)' : 'Free Instant Access (No Login Needed)'}</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleCitizenProceed}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all cursor-pointer btn-press"
              >
                <span>{t('startVerification')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* ── Card 2: Officer Card (Indigo-Violet Theme) ── */}
            <div className="relative rounded-2xl p-5 bg-gradient-to-b from-indigo-900/60 via-slate-900/80 to-slate-900/90 border-2 border-indigo-400/80 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-indigo-950/50 group card-hover">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-md uppercase tracking-wider">
                🛡️ Gov Portal
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{t('officerCardTitle')}</h3>
                  <p className="text-xs text-indigo-300 font-bold mt-0.5">{t('officerCardSub')}</p>
                </div>

                <ul className="text-[11px] text-slate-200 space-y-2 pt-1 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'वैधानिक बाजार निरीक्षण व डॉकेट निर्माण' : 'Conduct statutory market surveillance'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'धारा 36(1) के तहत कानूनी नोटिस जारी करें' : 'Issue legal notices under Section 36(1)'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'फॉर्म PC-1 आधिकारिक निरीक्षण रिपोर्ट तैयार करें' : 'Generate official Form PC-1 Inspection Reports'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{lang === 'hi' ? 'राष्ट्रीय एनालिटिक्स एवं नियम इंजन नियंत्रण' : 'National analytics & rule engine control'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 mt-4">
                <button
                  type="button"
                  onClick={handleOfficerProceed}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 transition-all cursor-pointer btn-press"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('loginAsOfficer')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomOfficerForm(!showCustomOfficerForm)}
                    className="text-[11px] font-bold text-indigo-300 hover:text-white underline cursor-pointer"
                  >
                    {showCustomOfficerForm ? (lang === 'hi' ? 'पासकोड छुपाएं' : 'Hide Passcode Form') : t('officerPasscodeLogin')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Password Form */}
          {showCustomOfficerForm && (
            <div className="pt-4 border-t border-white/20 space-y-3.5 fade-in">
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-xs font-black text-white">
                  {lang === 'hi' ? 'मैन्युअल अधिकारी प्रमाणीकरण' : 'Manual Officer Authentication (Demo / Production)'}
                </h3>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCustomOfficerLogin} className="space-y-3">
                {/* 1-Click Role Fillers */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                    {lang === 'hi' ? 'त्वरित परीक्षण क्रेडेंशियल्स:' : 'Quick Demo Officer Accounts:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { role: 'INSPECTOR', label: '👮 Officer Ravi (LMO)', email: 'ravi.kumar@metrologylens.gov.in', pass: 'inspector123', color: 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30' },
                      { role: 'SUPERVISOR', label: '👩‍💼 Priya Nair (CLM)', email: 'priya.nair@metrologylens.gov.in', pass: 'supervisor123', color: 'border-indigo-400/40 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30' },
                      { role: 'ADMIN', label: '🛡️ National Admin', email: 'admin@metrologylens.gov.in', pass: 'admin123', color: 'border-purple-400/40 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30' }
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
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer btn-press ${item.color}`}
                      >
                        <div className="text-[11px] font-black truncate">{item.label}</div>
                        <div className="text-[9px] text-slate-300 font-mono truncate">{item.email}</div>
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
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
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
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all btn-press"
                >
                  <span>{lang === 'hi' ? 'क्रेडेंशियल्स के साथ लॉगिन करें' : 'Sign In with Credentials'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* National Consumer Helpline footer */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 rounded-2xl border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-200">{t('helpline')}: </span>
                <span className="font-mono font-black text-amber-300 text-sm">1915 (Toll-Free)</span>
              </div>
            </div>
            <span className="text-[11px] text-amber-200 font-semibold">{t('deptName')}</span>
          </div>
        </div>

        {/* Legal Act Footnote */}
        <p className="text-[10px] text-center text-slate-400 leading-relaxed max-w-md mx-auto font-medium">
          Legal Metrology Act, 2009 · Legal Metrology (Packaged Commodities) Rules, 2011 · Consumer Protection Act, 2019.
        </p>

        {/* SIH Official Hackathon Disclaimer */}
        <p className="text-xs text-center text-slate-400 font-semibold">
          Prototype developed for Smart India Hackathon | Problem Statement ID: 26034. Demonstration Environment.
        </p>
      </div>
    </div>
  );
};
