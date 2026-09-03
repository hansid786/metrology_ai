import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, Printer, Eye, CheckCircle2,
  Calendar, Building2, Search, ArrowRight, ShieldAlert
} from 'lucide-react';
import { persistenceService } from '../services/persistenceService';
import { generateLegalInspectionReportPDF } from '../utils/pdfGenerator';
import { generateSeizureMemoPDF } from '../services/seizureMemoService';
import { StatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SavedInspection } from '../types/inspection';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<SavedInspection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setInspections(persistenceService.getOfficerInspections());
  }, []);

  const handleDownloadPDF = (insp: SavedInspection) => {
    const doc = generateLegalInspectionReportPDF(insp.result);
    doc.save(`Legal_Inspection_Report_${insp.metadata.inspectionId}.pdf`);
  };

  const filtered = inspections.filter(i =>
    i.metadata.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.metadata.establishmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.metadata.inspectionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Official Inspection Reports &amp; Dossiers</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Ministry of Consumer Affairs compliant inspection notices, evidence sheets, and PDF dockets.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report by product, establishment or ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Reports Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No inspection reports found"
          description="Create and complete inspections to generate official legal inspection reports."
          actionText="Create New Inspection"
          onAction={() => navigate('/inspect/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {item.metadata.inspectionId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.metadata.dateTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 truncate mt-1">
                    {item.metadata.productName}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {item.metadata.establishmentName} • {item.metadata.location}
                  </p>
                </div>

                <StatusBadge status={item.result.overallStatus} size="sm" />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Compliance Score</span>
                  <span className="font-mono font-black text-slate-900 text-base">{item.result.compliancePercentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Inspector</span>
                  <span className="font-bold text-slate-700">{item.metadata.inspectorName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Findings</span>
                  <span className="font-bold text-rose-600">{item.result.findings.length} recorded</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/history/${item.id}`)}
                  className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      generateSeizureMemoPDF({
                        memoNumber: `SZ-GOI-${Date.now().toString().slice(-6)}`,
                        inspection: item,
                        officerName: item.metadata.inspectorName || 'Officer Ravi Kumar',
                        officerBadge: item.metadata.inspectorId || 'LMO-DEL-2024-0042',
                        seizureLocation: item.metadata.establishmentAddress || item.metadata.location || 'New Delhi',
                        seizedLotQuantity: 50,
                        compoundingFineEstimate: 25000,
                        witness1Name: 'Sh. Rajesh Verma (Shop Owner)',
                        witness2Name: 'Sh. Anil Gupta (Market Secy)'
                      });
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Seizure Memo (Sec 15)</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(item)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
