import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Plus, FileText, Download, ChevronRight,
  Calendar, Building2, Trash2, CheckCircle2, AlertOctagon, Clock
} from 'lucide-react';
import { persistenceService } from '../services/persistenceService';
import { generateLegalInspectionReportPDF } from '../utils/pdfGenerator';
import { StatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SavedInspection, ProductCategory } from '../types/inspection';
import { useLanguage } from '../context/LanguageContext';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [inspections, setInspections] = useState<SavedInspection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    setInspections(persistenceService.getAll());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(lang === 'hi' ? `क्या आप निश्चित रूप से निरीक्षण रिकॉर्ड ${id} हटाना चाहते हैं?` : `Are you sure you want to delete inspection record ${id}?`)) {
      persistenceService.delete(id);
      setInspections(persistenceService.getAll());
    }
  };

  const handleDownloadPDF = (insp: SavedInspection, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = generateLegalInspectionReportPDF(insp.result);
    doc.save(`Legal_Inspection_Report_${insp.metadata.inspectionId}.pdf`);
  };

  // Filtered List
  const filtered = inspections.filter((item) => {
    const matchesSearch =
      item.metadata.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.metadata.establishmentName && item.metadata.establishmentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.metadata.inspectionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.metadata.inspectorName && item.metadata.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' || item.metadata.productCategory === categoryFilter;

    const matchesStatus =
      statusFilter === 'ALL' || item.result.overallStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {lang === 'hi' ? 'निरीक्षण इतिहास एवं ऑडिट ट्रेल' : 'Inspection History & Audit Trail'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {lang === 'hi' ? 'विधिक मापविज्ञान निरीक्षण रिकॉर्ड्स एवं सत्यापित साक्ष्य डॉकेट्स का केंद्रीय भंडार।' : 'Central repository of legal metrology inspection records and verified evidence dockets.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/inspect/new')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer shrink-0 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'hi' ? 'नया निरीक्षण' : 'New Inspection'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category & Status dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="ALL">{t('allCategories')}</option>
            <option value="FOOD">{t('foodFmcg')}</option>
            <option value="ELECTRONICS">{t('electronics')}</option>
            <option value="GENERAL">{t('generalGoods')}</option>
            <option value="PHARMA">{t('pharma')}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="ALL">{t('allStatuses')}</option>
            <option value="COMPLIANT">{lang === 'hi' ? 'मान्य (Compliant)' : 'Compliant'}</option>
            <option value="ATTENTION_REQUIRED">{lang === 'hi' ? 'समीक्षा आवश्यक' : 'Attention Required'}</option>
            <option value="CRITICAL_NON_COMPLIANT">{lang === 'hi' ? 'उल्लंघन (Violations)' : 'Violations'}</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title={lang === 'hi' ? 'कोई निरीक्षण रिकॉर्ड नहीं मिला' : 'No inspection records match your filters'}
            description={lang === 'hi' ? 'फ़िल्टर बदलकर देखें या नया निरीक्षण शुरू करें।' : 'Try changing the category/status filter, or start a new inspection to add records.'}
            actionText={lang === 'hi' ? 'नया निरीक्षण शुरू करें' : 'Start New Inspection'}
            onAction={() => navigate('/inspect/new')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <th className="py-3 px-4">{t('inspectionId')}</th>
                  <th className="py-3 px-4">{t('productAndCategory')}</th>
                  <th className="py-3 px-4">{t('establishment')}</th>
                  <th className="py-3 px-4">{t('officer')}</th>
                  <th className="py-3 px-4 text-center">{t('score')}</th>
                  <th className="py-3 px-4 text-center">{t('status')}</th>
                  <th className="py-3 px-4 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/history/${item.id}`)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-600 block">{item.metadata.inspectionId}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(item.metadata.dateTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-extrabold text-slate-900 block truncate">
                        {item.metadata.productName} — ₹{item.result.pricing.mrpAmount.toFixed(0)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{item.metadata.productCategory}</span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-slate-800 block truncate">{item.metadata.establishmentName}</span>
                      <span className="text-[10px] text-slate-400 truncate">{item.metadata.location}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-700 block">{item.metadata.inspectorName}</span>
                      <span className="text-[10px] text-slate-400">{item.metadata.inspectorId}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-black text-sm text-slate-900">
                      {item.result.compliancePercentage}%
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={item.result.overallStatus} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => handleDownloadPDF(item, e)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title={lang === 'hi' ? 'PDF डाउनलोड करें' : 'Download Form PC-1 PDF'}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          title={lang === 'hi' ? 'हटाएं' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
