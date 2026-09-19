import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck, PhoneCall, ExternalLink, Landmark, Scale,
  BookOpen, Sparkles, FileText, Lock, CheckCircle2, Shield
} from 'lucide-react';

export const OfficialGovFooter: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-[#0c182c] via-[#091322] to-[#050a14] text-slate-300 border-t-2 border-indigo-950/80 text-xs font-sans mt-auto relative overflow-hidden shadow-2xl">
      {/* Tricolor National Top Strip */}
      <div className="h-[3px] w-full flex opacity-90 shadow-md">
        <div className="h-full flex-1 bg-amber-500" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-emerald-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        {/* Top Section: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Column 1: Ministry & Governance Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-black text-sm tracking-tight">
                  {lang === 'hi' ? 'विधिक मापविज्ञान प्रभाग' : 'Legal Metrology Division'}
                </h4>
                <p className="text-[11px] text-slate-300 font-semibold">
                  {lang === 'hi' ? 'उपभोक्ता मामले विभाग' : 'Department of Consumer Affairs'}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'hi'
                ? 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय, भारत सरकार द्वारा अधिकृत डिजिटल अनुपालन एवं सत्यापन मंच।'
                : 'Ministry of Consumer Affairs, Food & Public Distribution, Government of India. Statutory verification & enforcement architecture.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-[10px] text-slate-200 font-medium shadow-sm">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>National Legal Metrology Digital Engine</span>
            </div>
          </div>

          {/* Column 2: Legal Acts & Statutory References */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? 'वैधानिक अधिनियम एवं नियम' : 'Statutory Acts & Standards'}</span>
            </div>
            <ul className="space-y-2.5 text-[11px] text-slate-300">
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Legal Metrology Act, 2009 (Act No. 1 of 2010)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Consumer Protection Act, 2019 (Act No. 35 of 2019)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-medium">BSA 2023 / IEA Sec 65B Electronic Evidence</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Helplines & National Portals */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'राष्ट्रीय उपभोक्ता सहायता' : 'Consumer Helpline & Grievance'}</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/60 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-200 font-bold">National Consumer Helpline (NCH):</span>
                <a
                  href="tel:1915"
                  className="font-mono font-black text-base text-amber-400 hover:text-amber-300 transition-colors"
                >
                  1915
                </a>
              </div>
              <p className="text-[10px] text-slate-400">
                {lang === 'hi' ? 'टोल-फ्री राष्ट्रीय हेल्पलाइन (24x7 उपलब्ध)' : 'Toll-Free National Helpline (All India)'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>SIH 2026 • PS: 26034</span>
              </div>
              <a
                href="https://consumeraffairs.nic.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-[10px] text-slate-200 font-bold transition-colors shadow-sm"
              >
                <span>consumeraffairs.nic.in</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance Seals */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© 2026 MetrologyLens AI. Department of Consumer Affairs, Govt. of India. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center text-[10px] font-semibold text-slate-300">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Section 65B Certified</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-slate-200">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Audit Logging Active</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Statutory PCR Matrix</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
