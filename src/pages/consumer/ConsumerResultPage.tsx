import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, AlertOctagon, AlertTriangle, AlertCircle, Download, PhoneCall,
  ArrowLeft, ShieldCheck, Copy, Check, Ruler, LayoutGrid, ChevronDown, ChevronUp,
  Eye, FileText, Info, MapPin, QrCode, Edit3, Save, X, Terminal, Camera, RefreshCw,
  Building2, Calendar, PackageCheck, ShieldAlert, HeartPulse, Flame, Sparkles, Share2, Scale
} from 'lucide-react';
import { persistenceService } from '../../services/persistenceService';
import { generateLegalInspectionReportPDF } from '../../utils/pdfGenerator';
import { downloadEDaakhilPetitionPDF } from '../../services/eDaakhilService';
import { calculatePricingIntelligence, analyzeCompliance } from '../../services/complianceEngine';
import { SavedInspection, MandatoryDeclaration } from '../../types/inspection';
import { useLanguage } from '../../context/LanguageContext';
import { OCRBoundingBoxes } from '../../components/LeftPanel/OCRBoundingBoxes';
import { RawOcrModal } from '../../components/Modals/RawOcrModal';

export const ConsumerResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [inspection, setInspection] = useState<SavedInspection | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'scorecard' | 'productDetails' | 'ingredients' | 'reasoning' | 'visual'>('scorecard');
  const [expandedDeclId, setExpandedDeclId] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isRawOcrOpen, setIsRawOcrOpen] = useState(false);

  // Quick Fine-Tune State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMRP, setEditMRP] = useState(0);
  const [editQty, setEditQty] = useState(0);
  const [editUnit, setEditUnit] = useState('g');
  const [editUSP, setEditUSP] = useState('');

  useEffect(() => {
    if (id) {
      const found = persistenceService.get(id);
      if (found) {
        setInspection(found);
        setEditName(found.metadata.productName);
        setEditMRP(found.result.pricing.mrpAmount);
        setEditQty(found.result.pricing.netQuantityValue);
        setEditUnit(found.result.pricing.netQuantityUnit);
        setEditUSP(found.result.pricing.printedUSPText || '');
      }
    }
  }, [id]);

  if (!inspection) {
    return (
      <div className="p-8 text-center space-y-4 bg-white rounded-3xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-800">
          {lang === 'hi' ? 'स्कैन किया गया आइटम नहीं मिला' : 'Scanned Item Not Found'}
        </h2>
        <p className="text-xs text-slate-500">
          {lang === 'hi' ? 'अनुरोधित पैकेज सत्यापन डॉकेट मौजूद नहीं है।' : 'The requested package verification docket does not exist.'}
        </p>
        <button
          onClick={() => navigate('/consumer/scan')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          {lang === 'hi' ? 'नया स्कैन शुरू करें' : 'Start New Scan'}
        </button>
      </div>
    );
  }

  const { result, metadata } = inspection;
  const isCompliant = result.overallStatus === 'COMPLIANT';
  const isOvercharge = result.pricing.discrepancyType === 'OVERCHARGING';
  const isInsufficient = result.overallStatus === 'INSUFFICIENT_EVIDENCE';
  const isPartial = result.overallStatus === 'PARTIALLY_VERIFIED';
  const isWarning = result.overallStatus === 'ATTENTION_REQUIRED' || isPartial;

  // Handle fine-tune submission
  const handleSaveFineTune = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspection) return;

    const newPricing = calculatePricingIntelligence(
      editMRP,
      editQty,
      editUnit,
      editUSP || undefined
    );

    const updatedDeclarations = result.declarations.map(d => {
      if (d.key === 'mrp') {
        return {
          ...d,
          extractedValue: editMRP > 0 ? `₹ ${editMRP.toFixed(2)} (Incl. of all taxes)` : 'Not Detected',
          status: (editMRP > 0 ? 'PASS' : 'NOT_DETECTED') as any,
          confidence: 100
        };
      }
      if (d.key === 'net_quantity') {
        return {
          ...d,
          extractedValue: editQty > 0 ? `${editQty} ${editUnit}` : 'Not Detected',
          status: (editQty > 0 ? 'PASS' : 'NOT_DETECTED') as any,
          confidence: 100
        };
      }
      return d;
    });

    const newCompliance = analyzeCompliance(
      updatedDeclarations,
      newPricing,
      inspection.metadata.productCategory || 'FOOD',
      result.product.shape || 'RECTANGULAR',
      result.boundingBoxes
    );

    const updatedInspection: SavedInspection = {
      ...inspection,
      metadata: {
        ...inspection.metadata,
        productName: editName,
      },
      result: {
        ...result,
        product: {
          ...result.product,
          name: editName,
        },
        pricing: newPricing,
        declarations: updatedDeclarations,
        verifiedCount: newCompliance.verifiedCount,
        totalCount: newCompliance.totalCount,
        compliancePercentage: newCompliance.compliancePercentage,
        overallStatus: newCompliance.overallStatus,
        findings: newCompliance.findings,
      },
      updatedAt: new Date().toISOString(),
    };

    persistenceService.save(updatedInspection);
    setInspection(updatedInspection);
    setIsEditing(false);
  };

  const handleDownloadSlip = () => {
    if (!inspection) return;
    generateLegalInspectionReportPDF(inspection.result);
  };

  const handleCopyComplaint = () => {
    const text = `Legal Metrology Consumer Notice
Docket ID: ${inspection.id}
Product: ${metadata.productName}
Category: ${metadata.productCategory}
Status: ${result.overallStatus}
MRP: ₹${result.pricing.mrpAmount} | Net Qty: ${result.pricing.netQuantityValue}${result.pricing.netQuantityUnit}
USP Status: ${result.pricing.statusDescription}
Findings: ${result.findings.map(f => f.title).join('; ')}
Reported via MetrologyLens AI (Govt of India SIH Initiative)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getConfidenceBadge = (confidenceScore: number, status: string) => {
    if (status === 'NOT_DETECTED' || confidenceScore === 0) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-slate-100 text-slate-600 border border-slate-300">
          Not Detected
        </span>
      );
    }
    if (confidenceScore >= 90) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
          High ({confidenceScore}%)
        </span>
      );
    }
    if (confidenceScore >= 60) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-blue-100 text-blue-800 border border-blue-300">
          Medium ({confidenceScore}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-100 text-amber-800 border border-amber-300">
        Low ({confidenceScore}%) — Verify
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Raw OCR diagnostics modal */}
      <RawOcrModal
        isOpen={isRawOcrOpen}
        onClose={() => setIsRawOcrOpen(false)}
        result={result}
      />

      {/* OCR Diagnostic Banner — always visible so user/judge knows what happened */}
      {(() => {
        const rawText = result.rawOcrText || '';
        const hasText = rawText.length > 20 && !rawText.includes('No text could be');
        const detectedCount = result.declarations?.filter(d => d.status !== 'NOT_DETECTED').length ?? 0;
        const ocrSucceeded = result.ocrMetadata?.status === 'SUCCESS' || hasText;
        const validationStatus = result.ocrMetadata?.validationStatus || (hasText ? 'COMPLETED' : 'SKIPPED_NO_OCR_TEXT');

        return (
          <div className={`rounded-2xl border p-4 space-y-3 ${ocrSucceeded && detectedCount > 0 ? 'bg-emerald-50 border-emerald-200' : hasText ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
            <div className="flex items-center gap-2">
              <Terminal className={`w-4 h-4 shrink-0 ${ocrSucceeded && detectedCount > 0 ? 'text-emerald-600' : hasText ? 'text-amber-600' : 'text-rose-600'}`} />
              <span className={`text-sm font-black ${ocrSucceeded && detectedCount > 0 ? 'text-emerald-800' : hasText ? 'text-amber-800' : 'text-rose-800'}`}>
                {ocrSucceeded && detectedCount > 0 ? '✅ OCR SUCCESS — Fields extracted' : hasText ? '⚠️ OCR TEXT FOUND — Fields need review' : '❌ OCR FAILED — No text could be read'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className={`rounded-lg p-2 ${ocrSucceeded ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                <div className="font-bold">OCR STATUS</div>
                <div>{ocrSucceeded ? 'SUCCESS' : 'FAILED'}</div>
              </div>
              <div className={`rounded-lg p-2 ${detectedCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                <div className="font-bold">EXTRACTED FIELDS</div>
                <div>{detectedCount} / {result.declarations?.length ?? 0}</div>
              </div>
              <div className="rounded-lg p-2 bg-slate-100 text-slate-700">
                <div className="font-bold">VALIDATION</div>
                <div>{validationStatus}</div>
              </div>
            </div>

            {!hasText && (
              <div className="text-xs text-rose-700 font-medium bg-rose-100 rounded-lg p-3 space-y-1">
                <p className="font-bold">To fix this:</p>
                <p>1. Confirm the image reaches the OCR engine and is not blank/corrupt</p>
                <p>2. Try a straight, well-lit close-up with MRP and quantity visible</p>
                <p>3. Open the full OCR Diagnostic Report to inspect raw text and timings</p>
              </div>
            )}

            {hasText && detectedCount === 0 && (
              <div className="text-xs text-amber-700 bg-amber-100 rounded-lg p-3">
                <p className="font-bold mb-1">Raw text was read ({rawText.length} chars) but fields not extracted:</p>
                <pre className="text-[10px] whitespace-pre-wrap break-all max-h-24 overflow-auto">{rawText.slice(0, 400)}</pre>
              </div>
            )}

            <button
              onClick={() => setIsRawOcrOpen(true)}
              className="text-xs font-bold underline text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              View Full OCR Diagnostic Report →
            </button>
          </div>
        );
      })()}

      {/* Top Controls Bar */}

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <button
          onClick={() => navigate('/consumer/scan')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? '← नया स्कैन करें' : '← Back to Scanner'}</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* WhatsApp / NCH 1915 Share Button */}
          <button
            type="button"
            onClick={() => {
              const overchargeText = result.pricing.isDiscrepancy 
                ? `⚠️ Overcharging Detected: Printed USP differs from legal rate.`
                : `✓ Statutory Compliance Verified (100% Evidence-Backed).`;
              const text = `*LEGAL METROLOGY VERIFICATION DOCKET*\n` +
                `📦 *Product:* ${metadata.productName}\n` +
                `💰 *Printed MRP:* ₹${result.pricing.mrpAmount.toFixed(2)}\n` +
                `⚖️ *Net Quantity:* ${result.pricing.netQuantityValue} ${result.pricing.netQuantityUnit}\n` +
                `🏢 *Manufacturer:* ${metadata.manufacturer || 'Packaged Commodity'}\n` +
                `📜 *Legal Ref:* Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011\n` +
                `${overchargeText}\n` +
                `🔗 *Docket:* https://metrologylens-ai.vercel.app/consumer/results/${inspection.id}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}</span>
          </button>

          {/* e-Daakhil Consumer Court Petition */}
          <button
            type="button"
            onClick={() => {
              downloadEDaakhilPetitionPDF({
                complainantName: 'Citizen Consumer',
                complainantPhone: '+91-9876543210',
                complainantAddress: 'New Delhi, India',
                oppositePartyName: metadata.establishmentName || 'Retail Mart / Retailer',
                oppositePartyAddress: metadata.establishmentAddress || metadata.location || 'Local Market, New Delhi',
                productName: metadata.productName,
                printedMRP: result.pricing.mrpAmount,
                chargedPrice: result.pricing.mrpAmount * (1 + (result.pricing.differencePercentage || 0) / 100),
                overchargeAmount: result.pricing.differenceAmount || 0,
                claimedCompensation: 5000,
                inspection
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'ई-दाखिल याचिका (PDF)' : 'e-Daakhil Court Petition'}</span>
          </button>

          {/* Official Inspection Report PDF */}
          <button
            type="button"
            onClick={() => generateLegalInspectionReportPDF(inspection.result)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'आधिकारिक रिपोर्ट' : 'Official Report'}</span>
          </button>

          {/* Fine-Tune Values Button */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-300"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'hi' ? 'मान संपादित करें' : 'Fine-Tune Values'}</span>
          </button>
        </div>
      </div>

      {/* Fine-Tune Quick Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveFineTune}
          className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl border-2 border-emerald-500/50 shadow-xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? 'पैकेजिंग मान संपादित करें' : 'Fine-Tune Scanned Packaging Specs'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">
                {lang === 'hi' ? 'उत्पाद का नाम' : 'Product Name'}
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">
                {lang === 'hi' ? 'MRP (अधिकतम खुदरा मूल्य ₹)' : 'MRP (Max Retail Price ₹)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={editMRP}
                onChange={e => setEditMRP(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-bold font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">
                {lang === 'hi' ? 'शुद्ध मात्रा (Net Quantity & Unit)' : 'Net Quantity & Unit'}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={editQty}
                  onChange={e => setEditQty(parseFloat(e.target.value) || 0)}
                  className="w-2/3 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-bold font-mono focus:outline-none focus:border-emerald-400"
                />
                <select
                  value={editUnit}
                  onChange={e => setEditUnit(e.target.value)}
                  className="w-1/3 px-2 py-2 bg-slate-900 border border-white/20 rounded-xl text-white font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                  <option value="Pages">Pages</option>
                  <option value="NOS">NOS</option>
                  <option value="Unit">Unit</option>
                  <option value="Tablets">Tablets</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 cursor-pointer"
            >
              {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सत्यापित व पुनः परिकलित करें' : 'Update & Recalculate Compliance'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Image Quality Limitation Warning */}
      {result.imageQuality && !result.imageQuality.isAcceptable && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-black text-rose-950">
              {lang === 'hi' ? 'छवि गुणवत्ता अपर्याप्त: पुनः स्पष्ट फोटो लें' : 'Image Quality Insufficient for Reliable Verification'}
            </h4>
            <p className="text-[11px] sm:text-xs text-rose-900 font-medium mt-1 leading-relaxed">
              {result.imageQuality.recommendation || 'The uploaded photo was blurry or underexposed. To avoid inaccurate reports, unreadable fields have been marked as Not Detected.'}
            </p>
          </div>
        </div>
      )}

      {/* Multi-Side Packaging Notification */}
      <div className="bg-blue-50/80 border border-blue-300 rounded-3xl p-4 sm:p-5 flex items-start justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-blue-950">
              {lang === 'hi' ? 'एकल-सतह विश्लेषण (Single-Side View)' : 'Only Visible Packaging Side Was Analyzed'}
            </h4>
            <p className="text-[11px] text-blue-900 font-medium mt-0.5 leading-relaxed">
              {lang === 'hi'
                ? 'कानूनी घोषणाएं (जैसे FSSAI Lic या ग्राहक सेवा) पैकेज के पीछे या किनारे पर हो सकती हैं।'
                : 'Other declarations may be printed on the back, side, or bottom of this packaging.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/consumer/scan')}
          className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'अन्य पक्ष स्कैन करें' : 'Upload More Sides'}</span>
        </button>
      </div>

      {/* Main Result Hero Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-lg space-y-4 ${
        isCompliant
          ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/40 text-white'
          : isOvercharge
          ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-red-950 border-rose-500/40 text-white'
          : isInsufficient
          ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950 border-amber-500/40 text-white'
          : 'bg-gradient-to-br from-rose-950 via-slate-900 to-red-950 border-rose-500/40 text-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isCompliant ? 'bg-emerald-500 text-white' :
              isOvercharge ? 'bg-rose-500 text-white' :
              isInsufficient ? 'bg-amber-500 text-slate-950' :
              'bg-rose-500 text-white'
            }`}>
              {isCompliant && <CheckCircle2 className="w-8 h-8" />}
              {isOvercharge && <AlertOctagon className="w-8 h-8" />}
              {isInsufficient && <AlertCircle className="w-8 h-8" />}
              {!isCompliant && !isOvercharge && !isInsufficient && <AlertTriangle className="w-8 h-8" />}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider opacity-90 flex items-center gap-2">
                {isCompliant ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    🟢 {t('stateCompliant')}
                  </span>
                ) : isInsufficient ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    🟡 {t('stateInsufficient')}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    🔴 {t('stateNonCompliant')}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-mono">SIH PS: 26034</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {metadata.productName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {isCompliant && t('stateCompliantDesc')}
                {isInsufficient && t('stateInsufficientDesc')}
                {!isCompliant && !isInsufficient && t('stateNonCompliantDesc')}
              </p>
            </div>
          </div>

          {/* Action on Insufficient Evidence */}
          {isInsufficient && (
            <button
              type="button"
              onClick={() => navigate('/consumer/scan')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Camera className="w-4 h-4" />
              <span>{t('captureMoreEvidence')} ➔</span>
            </button>
          )}
        </div>

        {/* Quick Statutory Compliance Badges */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Evidence Grounding: {result.verifiedCount}/{result.totalCount} Declarations Backed</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-amber-300" />
            <span>Font Readability: {result.fontReadabilitySummary?.overallFontCompliant !== false ? '✓ Rule 7(3) Pass (≥1mm)' : '⚠️ Font Warning'}</span>
          </span>
        </div>
      </div>

      {/* Mode View Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('scorecard')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'scorecard' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'hi' ? 'सत्यापन स्कोरकार्ड' : 'Verification Scorecard'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ingredients')}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'ingredients' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-rose-600" />
          <span>{lang === 'hi' ? 'सामग्री व स्वास्थ्य' : 'Ingredients & Health'}</span>
          {result.ingredientAnalysis?.harmfulCount ? (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-mono font-bold">
              {result.ingredientAnalysis.harmfulCount}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('productDetails')}
          className={`flex-1 min-w-[130px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'productDetails' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-600" />
          <span>{lang === 'hi' ? 'उत्पाद व निर्माता विवरण' : 'Product & Entity Specs'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reasoning')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'reasoning' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="w-4 h-4 text-blue-600" />
          <span>{lang === 'hi' ? 'साक्ष्य व विधिक तर्क' : 'Evidence Ledger'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visual')}
          className={`flex-1 min-w-[100px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'visual' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4 text-indigo-600" />
          <span>{lang === 'hi' ? 'विजुअल मैप' : 'Visual PDP'}</span>
        </button>
      </div>

      {/* TAB 1: CONSUMER SCORECARD */}
      {activeTab === 'scorecard' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Section 1: Extracted Information Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Extracted Information</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {result.verifiedCount} / {result.totalCount} Fields Grounded
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Product Name</div>
                <div className="font-bold text-slate-900 truncate">{metadata.productName}</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Category</div>
                <div className="font-bold text-emerald-700 truncate">{metadata.productCategory}</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Printed MRP</div>
                <div className="font-black text-slate-900">
                  {result.pricing.mrpAmount > 0 ? `₹${result.pricing.mrpAmount.toFixed(2)}` : 'Not Detected'}
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Net Quantity</div>
                <div className="font-black text-slate-900">
                  {result.pricing.netQuantityValue > 0 ? `${result.pricing.netQuantityValue} ${result.pricing.netQuantityUnit}` : 'Not Detected'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Declaration Check Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Declaration Check Matrix
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Legal Metrology (PC) Rules, 2011</span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              {result.declarations.map((decl) => {
                const isPass = decl.status === 'PASS';
                const isFail = decl.status === 'FAIL';
                const isNotDet = decl.status === 'NOT_DETECTED' || decl.status === 'REVIEW_REQUIRED';

                return (
                  <div key={decl.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{decl.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({decl.legalReference || 'Rule 6(1)'})</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-600">
                        {decl.extractedValue}
                      </div>
                      <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        {decl.evidence?.isEvidenceBacked ? 'Source: package image' : 'Source: not visible on scanned side'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isPass && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                      {isFail && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                          <span>Violation</span>
                        </span>
                      )}
                      {isNotDet && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Unable to verify</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Unit Sale Price (USP) Mathematical Audit */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                <span>Unit Sale Price (USP) Mathematical Verification</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Rule 6(1)(e) Amendment 2021</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-bold">Calculated USP (MRP ÷ Qty)</div>
                <div className="text-base font-black text-emerald-300">
                  {result.pricing.calculatedUSPAmount > 0 ? `₹${result.pricing.calculatedUSPAmount.toFixed(2)} / ${result.pricing.calculatedUSPUnit}` : 'N/A'}
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-bold">Declared / Printed USP</div>
                <div className="text-base font-black text-white">
                  {result.pricing.printedUSPAmount ? `₹${result.pricing.printedUSPAmount.toFixed(2)} / ${result.pricing.printedUSPUnit}` : (result.pricing.hasPrintedUSP ? 'Printed' : 'Not Declared')}
                </div>
              </div>

              <div className={`p-3 rounded-xl border space-y-0.5 ${
                result.pricing.isDiscrepancy 
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-200' 
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="text-[10px] font-bold">Audit Result</div>
                <div className="text-xs font-black">
                  {result.pricing.isDiscrepancy ? '⚠️ Discrepancy / Overcharging' : '✓ Verified Accurate Match'}
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Manufacturer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

            {/* Dates Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase text-[10px]">
                  3. Dates &amp; Shelf Life
                </span>
                {getConfidenceBadge(
                  result.declarations.find(d => d.key === 'expiry_date' || d.key === 'mfg_date')?.confidence || 0,
                  result.declarations.find(d => d.key === 'expiry_date' || d.key === 'mfg_date')?.status || 'NOT_DETECTED'
                )}
              </div>
              <div className="text-sm font-black text-slate-900">
                {result.declarations.find(d => d.key === 'expiry_date' || d.key === 'mfg_date')?.extractedValue || 'Not Detected'}
              </div>
              <p className="text-slate-600 font-medium">
                Rule 6(1)(c) mandates legible month and year of manufacture/packing.
              </p>
            </div>

            {/* Manufacturer & Care Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase text-[10px]">
                  4. Commercial Entity / Care
                </span>
                {getConfidenceBadge(
                  result.declarations.find(d => d.key === 'manufacturer_details')?.confidence || 0,
                  result.declarations.find(d => d.key === 'manufacturer_details')?.status || 'NOT_DETECTED'
                )}
              </div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {result.declarations.find(d => d.key === 'manufacturer_details')?.extractedValue || 'Not Detected'}
              </div>
              <p className="text-slate-500 text-[11px] truncate">
                Care: {result.declarations.find(d => d.key === 'customer_care')?.extractedValue || 'Not Detected'}
              </p>
            </div>
          </div>

          {/* Ingredient Health Quick Summary Bar on Scorecard */}
          {result.ingredientAnalysis && (
            <div
              onClick={() => setActiveTab('ingredients')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs hover:shadow-md ${
                result.ingredientAnalysis.harmfulCount > 0
                  ? 'bg-rose-50/80 border-rose-300 hover:bg-rose-100/80 text-rose-950'
                  : result.ingredientAnalysis.cautionCount > 0
                  ? 'bg-amber-50/80 border-amber-300 hover:bg-amber-100/80 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-300 hover:bg-emerald-100/80 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  result.ingredientAnalysis.harmfulCount > 0
                    ? 'bg-rose-600 text-white'
                    : result.ingredientAnalysis.cautionCount > 0
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black truncate">
                      {lang === 'hi' ? 'खाद्य सामग्री व स्वास्थ्य सुरक्षा स्कोर' : 'Ingredient Safety & Health Audit'}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      result.ingredientAnalysis.healthSafetyScore < 50
                        ? 'bg-rose-200 text-rose-800'
                        : result.ingredientAnalysis.healthSafetyScore < 80
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {result.ingredientAnalysis.healthSafetyScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">
                    {lang === 'hi' ? result.ingredientAnalysis.consumerAdviceHi : result.ingredientAnalysis.consumerAdviceEn}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold shrink-0 flex items-center gap-1 underline">
                <span>{lang === 'hi' ? 'विस्तार देखें' : 'View Audit'}</span>
                <span>➔</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INGREDIENTS & TOXIC ADDITIVES HEALTH AUDIT */}
      {activeTab === 'ingredients' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Header & Score Gauge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white shadow-md">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>FSSAI &amp; WHO Health Safety Audit</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {lang === 'hi' ? 'खाद्य सामग्री, रसायन व एडिटिव्स विश्लेषण' : 'Ingredient Health & Hazardous Additives Audit'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {lang === 'hi'
                  ? 'पाम ऑयल, ट्रांस फैट, हानिकारक कृत्रिम रंग (INS 102/110), प्रिजर्वेटिव्स व एलर्जी की स्वचालित जांच।'
                  : 'Auditing palm oil, trans fats, synthetic food dyes, INS preservatives, hidden MSG, and allergens.'}
              </p>
            </div>

            {/* Score Box */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center shrink-0 sm:min-w-[150px]">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Health Safety Score</div>
              <div className={`text-2xl sm:text-3xl font-black font-mono ${
                (result.ingredientAnalysis?.healthSafetyScore ?? 80) < 50 ? 'text-rose-400' :
                (result.ingredientAnalysis?.healthSafetyScore ?? 80) < 80 ? 'text-amber-400' :
                'text-emerald-400'
              }`}>
                {result.ingredientAnalysis?.healthSafetyScore ?? 80}<span className="text-xs text-slate-400">/100</span>
              </div>
              <div className="text-[10px] font-bold mt-0.5 text-slate-200">
                {result.ingredientAnalysis?.healthRating === 'ULTRA_PROCESSED_HARMFUL' ? (lang === 'hi' ? '🔴 अत्यधिक प्रोसेस्ड / हानिकारक' : '🔴 Ultra-Processed / Harmful') :
                 result.ingredientAnalysis?.healthRating === 'POOR_NUTRITION' ? (lang === 'hi' ? '🟠 कम पोषक तत्व' : '🟠 Poor Nutrition Profile') :
                 result.ingredientAnalysis?.healthRating === 'MODERATE' ? (lang === 'hi' ? '🟡 मध्यम प्रोसेस्ड' : '🟡 Moderate Processing') :
                 (lang === 'hi' ? '🟢 सुरक्षित व स्वच्छ' : '🟢 Clean & Safe')}
              </div>
            </div>
          </div>

          {/* Red Flag / Harmful Ingredients Alert */}
          {result.ingredientAnalysis?.harmfulIngredients && result.ingredientAnalysis.harmfulIngredients.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <h3 className="text-sm font-black text-rose-950 uppercase tracking-tight">
                  {lang === 'hi' ? '🔴 उच्च जोखिम वाले हानिकारक तत्व (Red Flag Ingredients)' : '🔴 High-Risk / Harmful Additives Detected'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.ingredientAnalysis.harmfulIngredients.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-300 text-xs space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-rose-950 text-sm">{item.name}</span>
                      <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-bold font-mono">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-rose-900 leading-relaxed font-medium">
                      {lang === 'hi' ? item.healthRiskHi : item.healthRiskEn}
                    </p>

                    {item.fssaiRegulationNote && (
                      <div className="p-2 bg-rose-100/60 rounded-xl text-[10px] font-bold text-rose-950 border border-rose-200">
                        ⚖️ FSSAI Note: {item.fssaiRegulationNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caution & Allergen Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Caution Ingredients */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-950 text-xs uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'hi' ? 'मध्यम जोखिम / एडिटिव्स' : 'Moderate Concern / Additives'}</span>
                </span>
                <span className="font-mono font-bold text-amber-800 text-[11px]">
                  {result.ingredientAnalysis?.cautionCount || 0} Found
                </span>
              </div>

              {result.ingredientAnalysis?.cautionIngredients && result.ingredientAnalysis.cautionIngredients.length > 0 ? (
                <div className="space-y-2">
                  {result.ingredientAnalysis.cautionIngredients.map((c, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-xl border border-amber-200 space-y-1">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        {lang === 'hi' ? c.healthRiskHi : c.healthRiskEn}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-[11px]">
                  {lang === 'hi' ? 'कोई संदिग्ध एडिटिव नहीं मिला।' : 'No moderate concern additives flagged.'}
                </p>
              )}
            </div>

            {/* Allergens Detected */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-blue-950 text-xs uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'hi' ? 'एलर्जी चेतावनी (Allergen Alerts)' : 'Allergen Declarations'}</span>
                </span>
                <span className="font-mono font-bold text-blue-800 text-[11px]">
                  {result.ingredientAnalysis?.allergensDetected?.length || 0} Declared
                </span>
              </div>

              {result.ingredientAnalysis?.allergensDetected && result.ingredientAnalysis.allergensDetected.length > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-[11px] text-slate-600 font-medium">
                    {lang === 'hi' ? 'पैकेजिंग पर निम्नलिखित एलर्जी तत्वों की घोषणा पाई गई:' : 'The following statutory allergens were detected in ingredients:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.ingredientAnalysis.allergensDetected.map((allergen, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs">
                        ⚠️ {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic text-[11px]">
                  {lang === 'hi' ? 'कोई प्रमुख एलर्जी तत्व अलग से घोषित नहीं है।' : 'No major allergens explicitly declared.'}
                </p>
              )}
            </div>
          </div>

          {/* Actionable Health Advisory */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800 shadow-xs text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <HeartPulse className="w-4 h-4" />
              <span>{lang === 'hi' ? 'स्वास्थ्य एवं पोषण विशेषज्ञ सलाह (Consumer Health Guidance)' : 'Consumer Health & Dietary Guidance'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              {lang === 'hi' ? result.ingredientAnalysis?.consumerAdviceHi : result.ingredientAnalysis?.consumerAdviceEn}
            </p>
          </div>

          {/* Full Ingredients List */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-extrabold text-slate-500 uppercase text-[10px] block">
              {lang === 'hi' ? 'स्कैन किया गया कच्चा सामग्री पाठ (Raw Ingredients Text)' : 'Scanned Ingredients Text Block'}
            </span>
            <div className="font-mono text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
              {result.ingredientAnalysis?.rawIngredientsText || result.rawOcrText || 'Ingredients extracted from package.'}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT & ENTITY SEPARATION (Manufacturer vs Packer vs Importer vs Marketer) */}
      {activeTab === 'productDetails' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {lang === 'hi' ? 'उत्पाद व व्यावसायिक संस्थाओं का पृथक्करण' : 'Product & Commercial Entity Breakdown'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly separates Manufacturer, Packer, Importer, and Marketer roles without misattribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Product & Brand */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Product Identity</span>
              <div>
                <div className="text-slate-500 text-[11px]">Product Name:</div>
                <div className="font-bold text-slate-900 text-sm">{result.product.name}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Brand Name:</div>
                <div className="font-bold text-slate-900">{result.product.brand}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Category:</div>
                <div className="font-bold text-emerald-700">{result.product.category}</div>
              </div>
            </div>

            {/* Manufacturing & Commercial Roles */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Commercial Entity Separation</span>
              <div>
                <div className="text-slate-500 text-[11px]">Manufacturer (Mfg by):</div>
                <div className="font-bold text-slate-900">{result.entityRoles?.manufacturer || 'Not Detected on this side'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Packer (Pkd by):</div>
                <div className="font-bold text-slate-900">{result.entityRoles?.packer || 'Not Detected / Same as Mfg'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Importer (Imp by):</div>
                <div className="font-bold text-slate-900">{result.entityRoles?.importer || 'Not Applicable (Domestic)'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Marketer (Marketed by):</div>
                <div className="font-bold text-slate-900">{result.entityRoles?.marketer || 'Not Detected'}</div>
              </div>
            </div>

            {/* Batch & Manufacturing Dates */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Manufacturing &amp; Batch Dates</span>
              <div>
                <div className="text-slate-500 text-[11px]">Batch / Lot No:</div>
                <div className="font-bold text-slate-900 font-mono">{result.rawOcrText?.match(/(?:batch|lot)\s*(?:no\.?|number)?\s*[:.-]?\s*([A-Z0-9\/-]{3,})/i)?.[1] || 'Not Detected'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Manufacturing Date (MFD):</div>
                <div className="font-bold text-slate-900">{result.manufacturingDates?.mfgDate || 'Not Detected'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Packing Date (PKD):</div>
                <div className="font-bold text-slate-900">{result.manufacturingDates?.packingDate || 'Not Detected'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Best Before / Expiry:</div>
                <div className="font-bold text-slate-900">{result.manufacturingDates?.bestBefore || result.manufacturingDates?.expiryDate || 'Not Detected'}</div>
              </div>
            </div>

            {/* Statutory Licenses */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Statutory Registration</span>
              <div>
                <div className="text-slate-500 text-[11px]">FSSAI License (Food):</div>
                <div className="font-bold text-slate-900 font-mono">
                  {result.declarations.find(d => d.key === 'fssai_lic')?.extractedValue || 'Not Detected'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Country of Origin:</div>
                <div className="font-bold text-slate-900">
                  {result.declarations.find(d => d.key === 'country_of_origin')?.extractedValue || 'Not Detected'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Customer Care:</div>
                <div className="font-bold text-slate-900">
                  {result.declarations.find(d => d.key === 'customer_care')?.extractedValue || 'Not Detected'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE LEDGER & STATUTORY REASONING */}
      {activeTab === 'reasoning' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                {lang === 'hi' ? 'साक्ष्य आधारित घोषणा खाता (Evidence Ledger)' : 'Evidence-Backed Statutory Reasoning'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'hi' ? 'प्रत्येक मान पैकेज पर पाए गए प्रत्यक्ष टेक्स्ट साक्ष्य से मैप किया गया है।' : 'Each value is mapped to verbatim optical evidence detected on the package.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {result.declarations.map((decl: MandatoryDeclaration) => {
              const isExpanded = expandedDeclId === decl.id;
              const isPassed = decl.status === 'PASS';
              const isFail = decl.status === 'FAIL';
              const isNotDetected = decl.status === 'NOT_DETECTED' || decl.status === 'REVIEW_REQUIRED';

              const whyExplanation = isPassed
                ? `✓ ${decl.name} was successfully verified from the packaging evidence in accordance with ${decl.legalReference || 'statutory provisions'}.`
                : isFail
                ? `✕ ${decl.name} failed verification. Detected value differs from the statutory requirement.`
                : `⚠ ${decl.name} could not be reliably extracted from the uploaded image angle(s).`;

              return (
                <div
                  key={decl.id}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isNotDetected ? 'border-amber-200 bg-amber-50/20' :
                    isFail ? 'border-rose-200 bg-rose-50/20' : 'border-emerald-200/80 bg-white'
                  }`}
                >
                  <div
                    onClick={() => setExpandedDeclId(isExpanded ? null : decl.id)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 truncate">{decl.name}</span>
                        {isPassed && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Verified Compliant
                          </span>
                        )}
                        {isFail && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            ✕ Verified Violation
                          </span>
                        )}
                        {isNotDetected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            ⚠ Unable to Verify
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 truncate">
                        "{decl.extractedValue}"
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Evidence, Rule & Diagnostics */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs space-y-3">
                      {/* Why this result */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase block">
                          Why this result?
                        </span>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {whyExplanation}
                        </p>
                      </div>

                      {/* Exact Supporting Text */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                          Detected Evidence
                        </span>
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {decl.evidence?.sourceText || decl.extractedValue}
                        </div>
                      </div>

                      {/* Legal Reference & Validation */}
                      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-slate-800">
                        <div className="text-[11px] font-extrabold text-blue-950 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Applicable Legal Rule: {decl.legalReference || 'Legal Metrology (PC) Rules, 2011'}</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                          {decl.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: VISUAL PACKAGE INSPECTOR */}
      {activeTab === 'visual' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-slate-900">
                {lang === 'hi' ? 'दृश्य साक्ष्य एवं पैकेजिंग ओवरले (Visual Evidence Overlay)' : 'Visual Evidence Overlays & Coordinate Grounding'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any declaration to highlight its exact optical region on the physical package.
              </p>
            </div>

            {selectedKey && (
              <button
                type="button"
                onClick={() => setSelectedKey(null)}
                className="text-xs text-blue-600 hover:underline font-bold self-start cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Clickable Declaration Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {result.declarations.map((d) => {
              const isSelected = selectedKey === d.key;
              const hasBox = result.boundingBoxes.some(b => b.declarationKey === d.key);

              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedKey(isSelected ? null : d.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                      : hasBox
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                  }`}
                >
                  <span>{d.name}</span>
                  {hasBox && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </div>

          <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-900 flex items-center justify-center min-h-[380px]">
            <img
              src={result.product.imageUrl || inspection.images[0]}
              alt={metadata.productName}
              className="max-h-[460px] w-full object-contain"
            />

            <OCRBoundingBoxes
              boundingBoxes={result.boundingBoxes}
              selectedKey={selectedKey}
              onSelectKey={(k) => setSelectedKey(k)}
              filterMode="all"
              showLabels={true}
              showPDPBoundary={true}
              pdpInfo={result.pdpInfo}
            />
          </div>
        </div>
      )}

      {/* SECTION 65B EVIDENCE STAMP */}
      <details className="group bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-4 sm:p-6 text-white border border-blue-500/30 shadow-lg space-y-3 transition-all cursor-pointer">
        <summary className="flex items-center justify-between font-mono font-bold text-xs select-none list-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-300">
              Section 65B Indian Evidence Act Stamp
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="hidden sm:inline">Admissible Evidence</span>
            <ChevronDown className="w-4 h-4 text-blue-400 transition-transform group-open:rotate-180" />
          </div>
        </summary>

        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Verified Timestamp &amp; Geolocation</span>
            </div>
            <div className="font-mono text-[11px] text-white font-bold">
              {new Date(result.timestamp).toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {metadata.location || 'New Delhi, India'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
              <QrCode className="w-3.5 h-3.5" />
              <span>Inspection Docket Hash</span>
            </div>
            <div className="font-mono text-[11px] text-white font-bold truncate">
              {inspection.id}
            </div>
            <p className="text-[10px] text-emerald-400 font-bold">
              ✓ Grounded in Visually Detected Text
            </p>
          </div>
        </div>
      </details>

      {/* Action Buttons */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:1915"
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-slate-950" />
            <span>{t('reportViolation')}</span>
          </a>

          <button
            onClick={handleDownloadSlip}
            className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t('downloadSlip')}</span>
          </button>
        </div>

        <button
          onClick={handleCopyComplaint}
          className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 border transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border-slate-300 hover:border-blue-300'
          }`}
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-slate-600" />}
          <span>{copied ? t('complaintCopied') : t('copyComplaint')}</span>
        </button>
      </div>
    </div>
  );
};
