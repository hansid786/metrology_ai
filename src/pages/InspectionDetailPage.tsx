import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Shield, Clock, CheckCircle2, AlertTriangle,
  Building2, User, MapPin, Calendar, FileText, Check, X, ShieldAlert
} from 'lucide-react';
import { persistenceService } from '../services/persistenceService';
import { generateLegalInspectionReportPDF } from '../utils/pdfGenerator';
import { StatusBadge } from '../components/common/Badge';
import { SavedInspection } from '../types/inspection';

export const InspectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<SavedInspection | null>(null);

  useEffect(() => {
    if (id) {
      const found = persistenceService.get(id);
      if (found) setInspection(found);
    }
  }, [id]);

  if (!inspection) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-base font-bold text-slate-800">Inspection Record Not Found</h2>
        <p className="text-xs text-slate-500">The requested inspection docket does not exist.</p>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to History
        </button>
      </div>
    );
  }

  const { metadata, result, auditTrail, decisions } = inspection;

  const handleDownloadPDF = () => {
    const doc = generateLegalInspectionReportPDF(result);
    doc.save(`Legal_Inspection_Report_${metadata.inspectionId}.pdf`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Back and Actions Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Inspections</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/inspect/${metadata.inspectionId}/results`)}
            className="px-4 py-2 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            Review &amp; Edit Decisions
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Legal PDF</span>
          </button>
        </div>
      </div>

      {/* Main Inspection Docket Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {metadata.inspectionId}
              </span>
              <span className="text-xs text-slate-400 font-medium">Official Inspection Record</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              {metadata.productName}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Category: <strong className="text-slate-800">{metadata.productCategory}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Statutory Score</div>
              <div className="text-3xl font-black text-slate-900 font-mono">{result.compliancePercentage}%</div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <StatusBadge status={result.overallStatus} size="lg" />
            </div>
          </div>
        </div>

        {/* Metadata Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Establishment</span>
            <span className="font-bold text-slate-900">{metadata.establishmentName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Location</span>
            <span className="font-medium text-slate-700">{metadata.location}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Inspecting Officer</span>
            <span className="font-bold text-slate-900">{metadata.inspectorName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Timestamp</span>
            <span className="font-mono text-slate-700">{new Date(metadata.dateTime).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* 8 Declarations Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900">8 Mandatory Declarations Audit</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Mandatory Declaration</th>
                  <th className="py-2.5 px-3">Legal Reference</th>
                  <th className="py-2.5 px-3">Extracted Text</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.declarations.map((d, i) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{i + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{d.name}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-blue-700">{d.legalReference.split('-')[0].trim()}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800 bg-slate-50 rounded px-2">{d.extractedValue}</td>
                    <td className="py-2.5 px-3 text-right"><StatusBadge status={d.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Officer Enforcement Decisions */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-black text-white">Officer Enforcement Action &amp; Statutory Authority</h3>
                <span className="text-[10px] text-slate-400">Section 15 &amp; 36(1) Legal Metrology Act, 2009</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-full">
              DRAFT — SUBJECT TO OFFICER REVIEW
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            AI findings serve as evidentiary assistance. The final legal authority to compound offenses, issue Form PC-1 seizure memos, or initiate prosecution rests solely with the designated Legal Metrology Officer.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                const updated = {
                  ...inspection,
                  status: 'COMPLETED' as const,
                  result: { ...inspection.result, overallStatus: 'COMPLIANT' as const },
                  auditTrail: [
                    ...inspection.auditTrail,
                    {
                      id: `ae-${Date.now()}`,
                      type: 'OFFICER_OVERRIDE' as const,
                      description: `Inspecting Officer ${metadata.inspectorName} approved statutory compliance.`,
                      timestamp: new Date().toISOString(),
                      actor: metadata.inspectorName
                    }
                  ]
                };
                persistenceService.save(updated);
                setInspection(updated);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve Full Compliance</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const updated = {
                  ...inspection,
                  status: 'IN_REVIEW' as const,
                  result: { ...inspection.result, overallStatus: 'CRITICAL_NON_COMPLIANT' as const },
                  auditTrail: [
                    ...inspection.auditTrail,
                    {
                      id: `ae-${Date.now()}`,
                      type: 'OFFICER_OVERRIDE' as const,
                      description: `Inspecting Officer ${metadata.inspectorName} flagged statutory non-compliance. Form PC-1 draft initiated.`,
                      timestamp: new Date().toISOString(),
                      actor: metadata.inspectorName
                    }
                  ]
                };
                persistenceService.save(updated);
                setInspection(updated);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Flag Violation &amp; Issue Notice</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const updated = {
                  ...inspection,
                  status: 'IN_REVIEW' as const,
                  result: { ...inspection.result, overallStatus: 'INSUFFICIENT_EVIDENCE' as const },
                  auditTrail: [
                    ...inspection.auditTrail,
                    {
                      id: `ae-${Date.now()}`,
                      type: 'OFFICER_OVERRIDE' as const,
                      description: `Inspecting Officer ${metadata.inspectorName} requested field re-inspection for insufficient evidence.`,
                      timestamp: new Date().toISOString(),
                      actor: metadata.inspectorName
                    }
                  ]
                };
                persistenceService.save(updated);
                setInspection(updated);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Request Manual Re-Inspection</span>
            </button>
          </div>
        </div>

        {/* Audit Trail Timeline */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Statutory Audit Timeline &amp; Chain of Custody</span>
          </h3>

          <div className="space-y-2.5">
            {auditTrail.map((event, idx) => (
              <div key={event.id || idx} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span className="font-bold text-slate-700">{event.actor}</span>
                    <span className="font-mono">{new Date(event.timestamp).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-slate-800 font-medium mt-0.5">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
