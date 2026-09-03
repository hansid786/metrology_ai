import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertOctagon, CheckCircle2,
  Download, ArrowLeft, Check, X, MessageSquare, Save,
  UserCheck
} from 'lucide-react';
import { persistenceService } from '../services/persistenceService';
import { authService } from '../services/authService';
import { generateLegalInspectionReportPDF } from '../utils/pdfGenerator';
import { StatusBadge } from '../components/common/Badge';
import { SavedInspection, InspectorDecision, ReviewActionType } from '../types/inspection';
import { useLanguage } from '../context/LanguageContext';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { lang, t } = useLanguage();

  const [inspection, setInspection] = useState<SavedInspection | null>(null);
  const [decisions, setDecisions] = useState<Record<string, InspectorDecision>>({});
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    if (id) {
      const found = persistenceService.get(id);
      if (found) {
        setInspection(found);
        const map: Record<string, InspectorDecision> = {};
        found.decisions.forEach(d => {
          map[d.findingId] = d;
        });
        setDecisions(map);
      }
    }
  }, [id]);

  if (!inspection) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-base font-bold text-slate-800">
          {lang === 'hi' ? 'निरीक्षण डॉकेट नहीं मिला' : 'Inspection Docket Not Found'}
        </h2>
        <p className="text-xs text-slate-500">
          {lang === 'hi' ? `अनुरोधित निरीक्षण डॉकेट आईडी ${id} स्थानीय रिकॉर्ड में मौजूद नहीं है।` : `The requested inspection docket ID ${id} does not exist in local records.`}
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          {lang === 'hi' ? 'डैशबोर्ड पर लौटें' : 'Return to Dashboard'}
        </button>
      </div>
    );
  }

  const { result, metadata } = inspection;

  const handleDecision = (findingId: string, action: ReviewActionType, declarationKey?: string) => {
    const decision: InspectorDecision = {
      findingId,
      declarationKey,
      action,
      comment: decisions[findingId]?.comment,
      timestamp: new Date().toISOString(),
      officerId: user?.inspectorId || 'LMO-DEL-2024-0042',
      officerName: user?.name || 'Officer Ravi Kumar',
    };

    const newMap = { ...decisions, [findingId]: decision };
    setDecisions(newMap);

    // Update persisted inspection
    const updatedInspection: SavedInspection = {
      ...inspection,
      decisions: Object.values(newMap),
      status: 'IN_REVIEW',
      updatedAt: new Date().toISOString(),
      auditTrail: [
        ...inspection.auditTrail,
        {
          id: `ae-${Date.now()}`,
          type: 'FINDING_REVIEWED',
          description: `Finding ${findingId} marked as ${action} by ${user?.name}`,
          timestamp: new Date().toISOString(),
          actor: user?.name || 'Inspector',
        },
      ],
    };
    setInspection(updatedInspection);
    persistenceService.save(updatedInspection);
  };

  const handleSaveComment = (findingId: string) => {
    if (!commentText.trim()) return;
    const existing = decisions[findingId] || {
      findingId,
      action: 'PENDING' as ReviewActionType,
      timestamp: new Date().toISOString(),
      officerId: user?.inspectorId || 'LMO-DEL-2024-0042',
      officerName: user?.name || 'Officer Ravi Kumar',
    };

    const updated: InspectorDecision = {
      ...existing,
      comment: commentText,
      timestamp: new Date().toISOString(),
    };

    const newMap = { ...decisions, [findingId]: updated };
    setDecisions(newMap);

    const updatedInspection: SavedInspection = {
      ...inspection,
      decisions: Object.values(newMap),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        ...inspection.auditTrail,
        {
          id: `ae-${Date.now()}`,
          type: 'FINDING_REVIEWED',
          description: `Officer note updated by ${user?.name} for ${findingId}`,
          timestamp: new Date().toISOString(),
          actor: user?.name || 'Inspector',
        },
      ],
    };
    setInspection(updatedInspection);
    persistenceService.save(updatedInspection);
    setActiveCommentId(null);
    setCommentText('');
  };

  const handleCompleteAndSave = () => {
    const updatedInspection: SavedInspection = {
      ...inspection,
      status: 'COMPLETED',
      updatedAt: new Date().toISOString(),
      auditTrail: [
        ...inspection.auditTrail,
        {
          id: `ae-${Date.now()}`,
          type: 'INSPECTION_SAVED',
          description: `Inspection completed and ratified by ${user?.name} (${user?.designation})`,
          timestamp: new Date().toISOString(),
          actor: user?.name || 'Inspector',
        },
      ],
    };
    setInspection(updatedInspection);
    persistenceService.save(updatedInspection);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleDownloadPDF = () => {
    const doc = generateLegalInspectionReportPDF(result);
    doc.save(`Form_PC1_Report_${metadata.inspectionId}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToHistory')}</span>
        </button>

        <div className="flex items-center gap-2">
          {isSavedToast && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'निरीक्षण सफलतापूर्वक सहेजा गया!' : 'Inspection Saved Successfully!'}</span>
            </span>
          )}

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('generatePdfReport')}</span>
          </button>

          <button
            onClick={handleCompleteAndSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('ratifyDocket')}</span>
          </button>
        </div>
      </div>

      {/* COMPLIANCE SCORECARD HERO */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {metadata.inspectionId}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {new Date(metadata.dateTime).toLocaleDateString('en-IN', { dateStyle: 'full' })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {metadata.productName}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {t('establishment')}: <strong className="text-slate-900">{metadata.establishmentName}</strong> • {metadata.location}
            </p>
          </div>

          {/* Big Score Gauge */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('statutoryScore')}</div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {result.compliancePercentage}%
              </div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <StatusBadge status={result.overallStatus} size="lg" />
              <div className="text-[10px] text-slate-400 font-bold mt-1">
                {result.verifiedCount} {lang === 'hi' ? `में से ${result.totalCount} अनिवार्य जांच मान्य` : `of ${result.totalCount} Mandatory Checks Passed`}
              </div>
            </div>
          </div>
        </div>

        {/* Human-in-the-loop Statutory Advisory Notice */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs">
          <UserCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-amber-900">
              {lang === 'hi' ? 'वैधानिक सलाह: AI-सहायता प्राप्त मूल्यांकन' : 'Statutory Advisory: AI-Assisted Assessment'}
            </span>
            <p className="text-amber-800 leading-relaxed font-medium">
              {lang === 'hi'
                ? 'यह रिपोर्ट विधिक मापविज्ञान (PC) नियम, 2011 के तहत स्वचालित न्यूरल ऑप्टिकल पहचान और गणितीय नियमों द्वारा बनाई गई है। वैधानिक नोटिस जारी करने से पहले निरीक्षण अधिकारी को सभी निष्कर्षों की समीक्षा और सत्यापन करना होगा।'
                : 'This report is generated via automated neural optical recognition and mathematical rule checks under the Legal Metrology (PC) Rules, 2011. The inspecting officer must review, accept, reject or annotate all AI findings prior to statutory notice issuance.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: STATUTORY FINDINGS & HUMAN REVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{t('statutoryFindings')}</h3>
            <p className="text-xs text-slate-500 font-medium">{t('adjudicateBreach')}</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
            {result.findings.length} {lang === 'hi' ? 'निष्कर्ष दर्ज' : (result.findings.length === 1 ? 'Finding Generated' : 'Findings Generated')}
          </span>
        </div>

        <div className="space-y-4">
          {result.findings.map((finding) => {
            const decision = decisions[finding.id];
            const isCritical = finding.severity === 'CRITICAL';
            const isSuccess = finding.severity === 'SUCCESS';

            return (
              <div
                key={finding.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                  isCritical ? 'border-rose-200 shadow-sm' :
                  isSuccess ? 'border-emerald-200 shadow-sm' :
                  'border-amber-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge
                        status={isCritical ? 'VIOLATION' : isSuccess ? 'PASS' : 'WARNING'}
                        size="sm"
                      />
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {finding.legalActClause}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">{finding.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{finding.description}</p>

                    {/* Officer Comments / Notes Display */}
                    {decision?.comment && (
                      <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-blue-800">
                          <span>{lang === 'hi' ? `अधिकारी टिप्पणी: ${decision.officerName}` : `Officer Note by ${decision.officerName}`}</span>
                          <span>{new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-800 italic">"{decision.comment}"</p>
                      </div>
                    )}

                    {/* Active Comment Input Form */}
                    {activeCommentId === finding.id && (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <label className="text-xs font-bold text-slate-700">
                          {lang === 'hi' ? 'आधिकारिक निरीक्षक टिप्पणी जोड़ें:' : 'Add Official Inspector Annotation:'}
                        </label>
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder={lang === 'hi' ? 'सत्यापन संदर्भ, कारण या नोटिस धारा दर्ज करें...' : 'Enter reason for overriding, inspection context, or notice citation...'}
                          rows={2}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveCommentId(null)}
                            className="px-3 py-1 text-slate-600 text-xs font-bold rounded-lg cursor-pointer"
                          >
                            {t('cancel')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveComment(finding.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                          >
                            {t('saveNote')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inspector Decision Panel */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 shrink-0 md:w-64">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>{t('officerDecision')}</span>
                      {decision?.action && decision.action !== 'PENDING' && (
                        <span className="text-blue-600 font-bold">{decision.action}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleDecision(finding.id, 'ACCEPTED', finding.declarationKey)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          decision?.action === 'ACCEPTED'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t('accept')}</span>
                      </button>

                      <button
                        onClick={() => handleDecision(finding.id, 'REJECTED', finding.declarationKey)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          decision?.action === 'REJECTED'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        <X className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t('reject')}</span>
                      </button>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleDecision(finding.id, 'MANUAL_REVIEW', finding.declarationKey)}
                        className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          decision?.action === 'MANUAL_REVIEW'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t('manualReview')}
                      </button>

                      <button
                        onClick={() => {
                          setActiveCommentId(finding.id);
                          setCommentText(decision?.comment || '');
                        }}
                        className="py-1 px-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title={t('note')}
                      >
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        <span>{t('note')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: 8 MANDATORY DECLARATIONS AUDIT TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {lang === 'hi' ? '8 अनिवार्य विधिक घोषणाएं ऑडिट मैट्रिक्स' : '8 Mandatory Statutory Declarations Matrix'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'hi' ? 'विधिक मापविज्ञान (पैकेज्ड कमोडिटीज) नियम, 2011 के तहत सत्यापन' : 'Compliance verification under Legal Metrology (Packaged Commodities) Rules, 2011'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'अनिवार्य घोषणा' : 'Mandatory Declaration'}</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'निकाला गया टेक्स्ट' : 'Extracted Text'}</th>
                <th className="py-2.5 px-3 text-center">{lang === 'hi' ? 'फॉन्ट आकार (R7/8)' : 'Font Size (R7/8)'}</th>
                <th className="py-2.5 px-3 text-center">{lang === 'hi' ? 'PDP स्थिति' : 'PDP Placement'}</th>
                <th className="py-2.5 px-3 text-center">OCR Conf.</th>
                <th className="py-2.5 px-3 text-right">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.declarations.map((decl, idx) => (
                <tr key={decl.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-slate-900 block">{decl.name}</span>
                    <span className="text-[10px] font-mono text-blue-700 font-bold block">{decl.legalReference.split('-')[0].trim()}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs text-slate-900 bg-slate-50 border border-slate-200 px-2 py-1 rounded font-bold inline-block max-w-[200px] truncate">
                      {decl.extractedValue}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {decl.fontCompliance ? (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        decl.fontCompliance.isCompliant ? 'bg-slate-50 text-slate-800 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {decl.fontCompliance.measuredHeightMm}mm <span className="text-[9px] text-slate-400 font-normal">(&ge;{decl.fontCompliance.requiredMinHeightMm})</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">2.4mm</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      decl.pdpPlacement?.isInsidePDP !== false ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {decl.pdpPlacement?.isInsidePDP !== false ? (lang === 'hi' ? '✓ PDP में' : '✓ In PDP') : (lang === 'hi' ? '⚠️ सील मार्जिन' : '⚠️ Seal Flange')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {decl.confidence}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge status={decl.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
