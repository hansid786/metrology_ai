import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck, PhoneCall, ExternalLink, Landmark, Scale,
  BookOpen, Sparkles, FileText, Lock, CheckCircle2, Shield
} from 'lucide-react';

export const OfficialGovFooter: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 text-xs font-sans mt-auto relative overflow-hidden shadow-inner">
      {/* Tricolor Subtle Top Strip */}
      <div className="h-[2px] w-full flex opacity-90 shadow-sm">
        <div className="h-full flex-1 bg-amber-500" />
        <div className="h-full flex-1 bg-slate-200" />
        <div className="h-full flex-1 bg-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Top Section: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Column 1: Ministry & Governance Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100/70 border border-amber-300/80 text-amber-700 flex items-center justify-center shrink-0 shadow-sm">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-slate-900 font-black text-sm tracking-tight">
                  {lang === 'hi' ? 'विधिक मापविज्ञान प्रभाग' : 'Legal Metrology Division'}
                </h4>
                <p className="text-[11px] text-slate-700 font-semibold">
                  {lang === 'hi' ? 'उपभोक्ता मामले विभाग' : 'Department of Consumer Affairs'}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {lang === 'hi'
                ? 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय, भारत सरकार द्वारा अधिकृत डिजिटल अनुपालन एवं सत्यापन मंच।'
                : 'Ministry of Consumer Affairs, Food & Public Distribution, Government of India. Statutory verification & enforcement architecture.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-700 font-medium shadow-xs">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Legal Metrology Digital Engine</span>
            </div>
          </div>

          {/* Column 2: Legal Acts & Statutory References */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'वैधानिक अधिनियम एवं नियम' : 'Statutory Acts & Standards'}</span>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-600">
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Legal Metrology Act, 2009 (Act No. 1 of 2010)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Consumer Protection Act, 2019 (Act No. 35 of 2019)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>BSA 2023 / IEA Sec 65B Certified Electronic Evidence</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Helplines & National Portals */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>{lang === 'hi' ? 'राष्ट्रीय उपभोक्ता सहायता' : 'Consumer Helpline & Grievance'}</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-800 font-bold">National Consumer Helpline (NCH):</span>
                <a
                  href="tel:1915"
                  className="font-mono font-black text-sm text-amber-600 hover:text-amber-700 transition-colors"
                >
                  1915
                </a>
              </div>
              <p className="text-[10px] text-slate-500">
                {lang === 'hi' ? 'टोल-फ्री राष्ट्रीय हेल्पलाइन (24x7 उपलब्ध)' : 'Toll-Free National Helpline (All India)'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold shadow-xs">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>SIH 2026 • PS: 26034</span>
              </div>
              <a
                href="https://consumeraffairs.nic.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-bold transition-colors shadow-xs"
              >
                <span>consumeraffairs.nic.in</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance Seals */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© 2026 MetrologyLens AI. Department of Consumer Affairs, Govt. of India. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center text-[10px] font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Section 65B Admissible</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-700">
              <Lock className="w-3 h-3 text-blue-600" />
              <span>Audit Logging Active</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Statutory PCR Matrix</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
