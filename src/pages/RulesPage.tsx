import React, { useState } from 'react';
import {
  ShieldCheck, Search, Info, X, Shield, BookOpen
} from 'lucide-react';
import { COMPLIANCE_RULES, ComplianceRule } from '../data/complianceRules';
import { useLanguage } from '../context/LanguageContext';

export const RulesPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [rules, setRules] = useState<ComplianceRule[]>(COMPLIANCE_RULES);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedRule, setSelectedRule] = useState<ComplianceRule | null>(null);

  const toggleRuleStatus = (ruleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return {
          ...r,
          status: r.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE',
        };
      }
      return r;
    }));
  };

  const filteredRules = rules.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.legalReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' || r.category === categoryFilter || r.category === 'ALL';

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {lang === 'hi' ? 'विधिक मापविज्ञान अनुपालन नियम मैट्रिक्स' : 'Legal Metrology Compliance Rule Engine'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {lang === 'hi' ? 'विधिक मापविज्ञान अधिनियम, 2009 एवं पैकेज्ड कमोडिटीज नियम, 2011 के वैधानिक नियम।' : 'Configurable statutory parameters derived from Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>{lang === 'hi' ? 'नियम इंजन v2.4 सक्रिय' : 'Rule Engine v2.4 Active'}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'hi' ? 'नियम, धाराएं या अधिनियम खोजें...' : 'Search rules, clauses, acts...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">{t('allCategories')}</option>
            <option value="FOOD">{t('foodFmcg')}</option>
            <option value="ELECTRONICS">{t('electronics')}</option>
            <option value="GENERAL">{t('generalGoods')}</option>
            <option value="PHARMA">{t('pharma')}</option>
          </select>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <th className="py-3 px-4">{lang === 'hi' ? 'नियम आईडी' : 'Rule ID'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'नियम शीर्षक व विवरण' : 'Rule Title & Description'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'वैधानिक धारा' : 'Statutory Clause'}</th>
                <th className="py-3 px-4 text-center">{lang === 'hi' ? 'श्रेणी' : 'Category'}</th>
                <th className="py-3 px-4 text-center">{lang === 'hi' ? 'गंभीरता' : 'Severity'}</th>
                <th className="py-3 px-4 text-center">{lang === 'hi' ? 'संस्करण' : 'Version'}</th>
                <th className="py-3 px-4 text-right">{lang === 'hi' ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRules.map((rule) => {
                const isActive = rule.status === 'ACTIVE';
                const displayTitle = lang === 'hi' && rule.nameHi ? rule.nameHi : rule.name;
                const displayDesc = lang === 'hi' && rule.descriptionHi ? rule.descriptionHi : rule.description;
                const displayRef = lang === 'hi' && rule.legalReferenceHi ? rule.legalReferenceHi : rule.legalReference;

                return (
                  <tr
                    key={rule.id}
                    onClick={() => setSelectedRule(rule)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {rule.id}
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-extrabold text-slate-900">{displayTitle}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{displayDesc}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {displayRef}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-extrabold uppercase text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                        {rule.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${
                          rule.severity === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : rule.severity === 'WARNING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {rule.severity === 'CRITICAL'
                          ? (lang === 'hi' ? 'अनिवार्य' : 'CRITICAL')
                          : rule.severity === 'WARNING'
                          ? (lang === 'hi' ? 'चेतावनी' : 'WARNING')
                          : (lang === 'hi' ? 'सूचना' : 'INFO')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500">
                      v{rule.version}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => toggleRuleStatus(rule.id, e)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                            : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        {isActive ? (lang === 'hi' ? 'सक्रिय' : 'ACTIVE') : (lang === 'hi' ? 'निष्क्रिय' : 'DISABLED')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Rule Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 block">{selectedRule.id}</span>
                  <h3 className="text-base font-black text-slate-900">
                    {lang === 'hi' && selectedRule.nameHi ? selectedRule.nameHi : selectedRule.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700 leading-relaxed">
              <div className="text-[11px] font-bold text-slate-400 uppercase">
                {lang === 'hi' ? 'वैधानिक विवरण' : 'Statutory Description'}
              </div>
              <p>
                {lang === 'hi' && selectedRule.descriptionHi ? selectedRule.descriptionHi : selectedRule.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-600 font-bold uppercase block">
                  {lang === 'hi' ? 'कानूनी धारा' : 'Legal Act Reference'}
                </span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">
                  {lang === 'hi' && selectedRule.legalReferenceHi ? selectedRule.legalReferenceHi : selectedRule.legalReference}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-600 font-bold uppercase block">
                  {lang === 'hi' ? 'लागू श्रेणियां' : 'Applicable Classes'}
                </span>
                <span className="font-bold text-slate-900 text-[11px]">{selectedRule.applicableCategories.join(', ')}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRule(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
