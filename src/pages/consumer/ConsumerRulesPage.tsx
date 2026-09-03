import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Copy, Check, PhoneCall, ShoppingBag } from 'lucide-react';
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
    { key: 'ALL', labelEn: 'All Rules (24)', labelHi: 'सभी नियम (24)' },
    { key: 'FOOD', labelEn: 'Food & FMCG', labelHi: 'खाद्य एवं FMCG' },
    { key: 'ELECTRONICS', labelEn: 'Electronics & IT', labelHi: 'इलेक्ट्रॉनिक्स' },
    { key: 'COSMETICS', labelEn: 'Cosmetics', labelHi: 'सौंदर्य प्रसाधन' },
    { key: 'PHARMA', labelEn: 'Pharma & Ayush', labelHi: 'दवाएं व आयुष' },
    { key: 'GENERAL', labelEn: 'General & Apparel', labelHi: 'वस्त्र व सामान्य' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'उपभोक्ता अधिकार एवं नियम पुस्तिका' : 'Consumer Rights & Packaging Rulebook'}</span>
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 text-slate-950 font-black rounded-xl hover:bg-amber-300 transition-colors shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'शिकायत हेल्पलाइन: 1915 (टोल-फ्री)' : 'Helpline: 1915 (Toll-Free)'}</span>
            </a>

            <button
              onClick={() => navigate('/consumer/scan')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'hi' ? 'उत्पाद स्कैन करें' : 'Scan Product Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
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
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat.key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {lang === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => {
          const isCopied = copiedId === rule.id;
          const displayTitle = lang === 'hi' && rule.nameHi ? rule.nameHi : rule.name;
          const displayDesc = lang === 'hi' && rule.descriptionHi ? rule.descriptionHi : rule.description;
          const displayRef = lang === 'hi' && rule.legalReferenceHi ? rule.legalReferenceHi : rule.legalReference;

          return (
            <div
              key={rule.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {rule.id}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      rule.severity === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : rule.severity === 'WARNING'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {rule.severity === 'CRITICAL'
                      ? (lang === 'hi' ? 'अनिवार्य नियम' : 'Mandatory')
                      : rule.severity === 'WARNING'
                      ? (lang === 'hi' ? 'चेतावनी' : 'Standard')
                      : (lang === 'hi' ? 'सूचना' : 'Guideline')}
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
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="text-[10px] font-mono text-slate-500 truncate" title={displayRef}>
                  ⚖️ {displayRef}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCitation(rule)}
                  className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                    isCopied
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold text-[10px] px-2'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border-slate-200'
                  }`}
                  title="Copy legal clause citation"
                >
                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[10px]">{isCopied ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied') : (lang === 'hi' ? 'कॉपी' : 'Copy')}</span>
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
