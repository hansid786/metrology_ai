import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, Copy, Check, PhoneCall, ShoppingBag,
  Sparkles, Scale, Utensils, Cpu, Heart, Pill, PackageCheck, Layers
} from 'lucide-react';
import { COMPLIANCE_RULES, ComplianceRule } from '../../data/complianceRules';
import { useLanguage } from '../../context/LanguageContext';

export const ConsumerRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (rule: ComplianceRule) => {
    const title = lang === 'hi' && rule.nameHi ? rule.nameHi : rule.name;
    const ref = lang === 'hi' && rule.legalReferenceHi ? rule.legalReferenceHi : rule.legalReference;
    const desc = lang === 'hi' && rule.descriptionHi ? rule.descriptionHi : rule.description;
    const text = `${rule.id}: ${title} — ${ref}\n${desc}`;
    navigator.clipboard.writeText(text);
    setCopiedId(rule.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRules = COMPLIANCE_RULES.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(term) ||
      (r.nameHi && r.nameHi.toLowerCase().includes(term)) ||
      r.id.toLowerCase().includes(term) ||
      r.legalReference.toLowerCase().includes(term) ||
      (r.legalReferenceHi && r.legalReferenceHi.toLowerCase().includes(term)) ||
      r.description.toLowerCase().includes(term) ||
      (r.descriptionHi && r.descriptionHi.toLowerCase().includes(term));

    const matchesCategory =
      categoryFilter === 'ALL' || r.category === categoryFilter || r.category === 'ALL';

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: 'ALL', labelEn: 'All Rules (24)', labelHi: 'सभी 24 नियम', icon: Layers, activeBg: 'from-indigo-600 to-blue-600', activeText: 'text-white', badge: 'bg-indigo-100 text-indigo-800' },
    { key: 'FOOD', labelEn: 'Food & FMCG', labelHi: 'खाद्य एवं FMCG', icon: Utensils, activeBg: 'from-emerald-600 to-teal-600', activeText: 'text-white', badge: 'bg-emerald-100 text-emerald-800' },
    { key: 'ELECTRONICS', labelEn: 'Electronics & IT', labelHi: 'इलेक्ट्रॉनिक्स', icon: Cpu, activeBg: 'from-blue-600 to-cyan-600', activeText: 'text-white', badge: 'bg-blue-100 text-blue-800' },
    { key: 'COSMETICS', labelEn: 'Cosmetics', labelHi: 'सौंदर्य प्रसाधन', icon: Heart, activeBg: 'from-rose-600 to-pink-600', activeText: 'text-white', badge: 'bg-rose-100 text-rose-800' },
    { key: 'PHARMA', labelEn: 'Pharma & Ayush', labelHi: 'दवाएं व आयुष', icon: Pill, activeBg: 'from-amber-600 to-orange-600', activeText: 'text-white', badge: 'bg-amber-100 text-amber-800' },
    { key: 'GENERAL', labelEn: 'General & Apparel', labelHi: 'वस्त्र व सामान्य', icon: PackageCheck, activeBg: 'from-purple-600 to-violet-600', activeText: 'text-white', badge: 'bg-purple-100 text-purple-800' },
  ];

  const getCategoryColorConfig = (category: string) => {
    switch (category) {
      case 'FOOD':
        return {
          border: 'border-l-4 border-l-emerald-500',
          bgTint: 'bg-gradient-to-br from-emerald-50/50 via-white to-white',
          tagBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          iconColor: 'text-emerald-600',
          label: lang === 'hi' ? 'खाद्य एवं FMCG' : 'Food & FMCG',
        };
      case 'ELECTRONICS':
        return {
          border: 'border-l-4 border-l-blue-500',
          bgTint: 'bg-gradient-to-br from-blue-50/50 via-white to-white',
          tagBg: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600',
          label: lang === 'hi' ? 'इलेक्ट्रॉनिक्स' : 'Electronics & IT',
        };
      case 'COSMETICS':
        return {
          border: 'border-l-4 border-l-rose-500',
          bgTint: 'bg-gradient-to-br from-rose-50/50 via-white to-white',
          tagBg: 'bg-rose-100 text-rose-800 border-rose-200',
          iconColor: 'text-rose-600',
          label: lang === 'hi' ? 'सौंदर्य प्रसाधन' : 'Cosmetics',
        };
      case 'PHARMA':
        return {
          border: 'border-l-4 border-l-amber-500',
          bgTint: 'bg-gradient-to-br from-amber-50/50 via-white to-white',
          tagBg: 'bg-amber-100 text-amber-800 border-amber-200',
          iconColor: 'text-amber-600',
          label: lang === 'hi' ? 'दवाएं व आयुष' : 'Pharma & Ayush',
        };
      case 'GENERAL':
        return {
          border: 'border-l-4 border-l-purple-500',
          bgTint: 'bg-gradient-to-br from-purple-50/50 via-white to-white',
          tagBg: 'bg-purple-100 text-purple-800 border-purple-200',
          iconColor: 'text-purple-600',
          label: lang === 'hi' ? 'वस्त्र व सामान्य' : 'General & Apparel',
        };
      default:
        return {
          border: 'border-l-4 border-l-indigo-500',
          bgTint: 'bg-gradient-to-br from-indigo-50/50 via-white to-white',
          tagBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          iconColor: 'text-indigo-600',
          label: lang === 'hi' ? 'सभी उत्पाद' : 'Universal Rule',
        };
    }
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20 border border-emerald-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-emerald-200 text-xs font-black backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'hi' ? 'उपभोक्ता अधिकार एवं नियम निर्देशिका' : 'Official Consumer Rights & Legal Rulebook'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {lang === 'hi'
              ? 'विधिक मापविज्ञान नियम एवं उपभोक्ता अधिकार'
              : 'Legal Metrology Rules & Consumer Rights Directory'}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
            {lang === 'hi'
              ? 'भारत सरकार के विधिक मापविज्ञान (पैकेज्ड कमोडिटीज) नियम, 2011 के तहत पैकेज्ड वस्तुओं पर सभी 24 अनिवार्य वैधानिक नियम और उपभोक्ता अधिकार।'
              : 'Official statutory packaging rules and rights under the Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011.'}
          </p>

          {/* Quick Helpline Pill */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <a
              href="tel:1915"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black rounded-xl hover:from-amber-300 hover:to-orange-300 transition-all shadow-md btn-press"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'शिकायत हेल्पलाइन: 1915 (टोल-फ्री)' : 'Helpline: 1915 (Toll-Free)'}</span>
            </a>

            <button
              onClick={() => navigate('/consumer/scan')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold rounded-xl transition-all btn-press cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
              <span>{lang === 'hi' ? 'उत्पाद स्कैन करें' : 'Scan Product Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Colorful Category Filter */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3.5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'नियम, MRP, USP, फॉन्ट साइज, एक्सपायरी, वजन खोजें...'
                : 'Search rules by keyword (e.g. MRP, USP, font size, expiry, weight)...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition-all"
          />
        </div>

        {/* Colorful Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = categoryFilter === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer btn-press flex items-center gap-1.5 ${
                  isSelected
                    ? `bg-gradient-to-r ${cat.activeBg} ${cat.activeText} shadow-md shadow-indigo-600/20 font-black scale-[1.02]`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{lang === 'hi' ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
        {filteredRules.map((rule) => {
          const isCopied = copiedId === rule.id;
          const displayTitle = lang === 'hi' && rule.nameHi ? rule.nameHi : rule.name;
          const displayDesc = lang === 'hi' && rule.descriptionHi ? rule.descriptionHi : rule.description;
          const displayRef = lang === 'hi' && rule.legalReferenceHi ? rule.legalReferenceHi : rule.legalReference;
          const colorConfig = getCategoryColorConfig(rule.category);

          return (
            <div
              key={rule.id}
              className={`bg-white rounded-2xl p-5 flex flex-col justify-between space-y-3.5 border border-slate-200/90 shadow-xs card-hover ${colorConfig.border} ${colorConfig.bgTint}`}
            >
              <div className="space-y-2.5">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-300">
                      {rule.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${colorConfig.tagBg}`}>
                      {colorConfig.label}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${
                      rule.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : rule.severity === 'WARNING'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}
                  >
                    {rule.severity === 'CRITICAL'
                      ? (lang === 'hi' ? 'अनिवार्य नियम (Mandatory)' : 'Mandatory')
                      : rule.severity === 'WARNING'
                      ? (lang === 'hi' ? 'वैधानिक मानक (Standard)' : 'Standard')
                      : (lang === 'hi' ? 'दिशानिर्देश (Guideline)' : 'Guideline')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {displayTitle}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {displayDesc}
                </p>
              </div>

              {/* Legal Reference Footer */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                <div className="text-[10px] font-mono text-slate-600 truncate flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200" title={displayRef}>
                  <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-semibold">{displayRef}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCitation(rule)}
                  className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 cursor-pointer shrink-0 btn-press ${
                    isCopied
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold text-[10px] px-2.5 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200/90 shadow-2xs'
                  }`}
                  title="Copy legal clause citation"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-bold">{isCopied ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied') : (lang === 'hi' ? 'कॉपी' : 'Copy')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRules.length === 0 && (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          {lang === 'hi' ? 'कोई नियम नहीं मिला। कृपया अन्य शब्द खोजें।' : 'No rules match your search. Try another keyword.'}
        </div>
      )}
    </div>
  );
};
