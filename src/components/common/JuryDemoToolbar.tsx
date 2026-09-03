import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ChevronUp, ChevronDown, CheckCircle2, AlertOctagon,
  AlertTriangle, ShieldCheck, MapPin, QrCode, ArrowLeftRight, Download,
  ExternalLink, Trophy, Cpu, X
} from 'lucide-react';
import { persistenceService } from '../../services/persistenceService';
import { authService } from '../../services/authService';
import { DEMO_PRESETS } from '../../data/demoProducts';
import { generateLegalInspectionReportPDF } from '../../utils/pdfGenerator';
import { useLanguage } from '../../context/LanguageContext';

export const JuryDemoToolbar: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeCase, setActiveCase] = useState<string | null>(null);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-20 right-4 z-30 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
        title="Show SIH Jury Demo Toolbar"
      >
        <Trophy className="w-3 h-3 text-amber-400" />
        <span>Jury Demo</span>
      </button>
    );
  }

  const handleLaunchCase = (presetId: string, role: 'consumer' | 'officer') => {
    setActiveCase(presetId);
    const preset = DEMO_PRESETS.find(p => p.id === presetId) || DEMO_PRESETS[0];

    // Ensure it's in storage
    const docketId = `INS-GOI-2026-${presetId.replace('demo-', '').toUpperCase().slice(0, 4)}`;
    const saved = persistenceService.get(docketId);

    if (!saved) {
      persistenceService.save({
        id: docketId,
        metadata: {
          inspectionId: docketId,
          establishmentName: 'Apex Retail Supermart, Connaught Place',
          establishmentAddress: 'Block B, Connaught Place, New Delhi - 110001',
          productName: preset.title,
          productCategory: presetId.includes('powerbank') ? 'ELECTRONICS' : presetId.includes('notebook') ? 'GENERAL' : 'FOOD',
          location: 'Connaught Place, New Delhi',
          inspectorId: 'LMO-DEL-2024-0042',
          inspectorName: 'Officer Ravi Kumar',
          inspectorDesignation: 'Legal Metrology Officer (Grade II)',
          dateTime: new Date().toISOString(),
          geoLocation: {
            latitude: 28.6315,
            longitude: 77.2167,
            accuracyMeters: 4.2,
            addressText: 'Connaught Place, New Delhi - 110001',
            timestamp: new Date().toISOString(),
            isTamperProofSection65B: true,
          },
          barcodeInfo: {
            rawBarcode: '8901030829182',
            barcodeFormat: 'EAN-13',
            gs1Country: 'INDIA',
            manufacturerGTIN: '8901030',
            isRegisteredGS1India: true,
            matchesExtractedManufacturer: true,
            status: 'VERIFIED_MATCH',
            details: 'GS1 India Verified Manufacturer GTIN 8901030 (Apex Snack Foods Ltd)',
          },
        },
        presetId: presetId,
        images: [preset.imageUrl],
        result: {
          ...(preset.data as any),
          inspectionId: docketId,
          timestamp: new Date().toISOString(),
          geoLocation: {
            latitude: 28.6315,
            longitude: 77.2167,
            accuracyMeters: 4.2,
            addressText: 'Connaught Place, New Delhi - 110001',
            timestamp: new Date().toISOString(),
            isTamperProofSection65B: true,
          },
          barcodeInfo: {
            rawBarcode: '8901030829182',
            barcodeFormat: 'EAN-13',
            gs1Country: 'INDIA',
            manufacturerGTIN: '8901030',
            isRegisteredGS1India: true,
            matchesExtractedManufacturer: true,
            status: 'VERIFIED_MATCH',
            details: 'GS1 India Verified Manufacturer GTIN 8901030 (Apex Snack Foods Ltd)',
          },
        },
        decisions: [],
        auditTrail: [
          {
            id: `ae-${Date.now()}`,
            type: 'INSPECTION_CREATED',
            description: `Quick Jury Demo docket loaded for ${preset.title}`,
            timestamp: new Date().toISOString(),
            actor: 'SIH Jury Demo System',
          },
        ],
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'COMPLETED',
        pdfGenerated: true,
      });
    }

    if (role === 'consumer') {
      navigate(`/consumer/result/${docketId}`);
    } else {
      authService.loginAsRole('INSPECTOR');
      navigate(`/history/${docketId}`);
    }
  };

  const handleDownloadSampleReport = () => {
    const preset = DEMO_PRESETS[0];
    const doc = generateLegalInspectionReportPDF(preset.data as any);
    doc.save('SIH_2026_Form_PC1_TamperProof_Report.pdf');
  };

  return (
    <div className="fixed top-20 right-3 sm:right-6 z-30 max-w-[calc(100vw-24px)]">
      {/* Floating Header Pill Box */}
      <div className="bg-slate-950/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-indigo-500/40 p-1 flex flex-col transition-all duration-300">
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 select-none">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 min-w-0"
          >
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-xs shrink-0">
              <Trophy className="w-3 h-3" />
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-black tracking-tight text-amber-300 truncate">
                SIH 2026 Jury Showcase
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>

            <div className="text-slate-400 hover:text-white shrink-0">
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-1"
            title="Minimize toolbar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Expanded Showcase Controls */}
        {isExpanded && (
          <div className="p-3 pt-2 border-t border-slate-800 space-y-2.5 w-[310px] sm:w-[350px] animate-in slide-in-from-top-2 duration-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>1-Click Test Scenarios:</span>
              <span className="text-emerald-400 font-mono">PS 26034 Ready</span>
            </div>

            {/* 4 Key Cases */}
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {/* Case 1: Overcharging */}
              <button
                type="button"
                onClick={() => handleLaunchCase('demo-potato-chips', 'consumer')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/70 border border-slate-800 hover:border-rose-600 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-extrabold text-rose-300 flex items-center gap-1.5 truncate">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">1. Price Overcharging Discrepancy</span>
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">Crunchy Chips: ₹50 MRP vs ₹0.25/g USP (+25%)</div>
                </div>
                <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded ml-1 shrink-0">Sec 36(1)</span>
              </button>

              {/* Case 2: Missing USP */}
              <button
                type="button"
                onClick={() => handleLaunchCase('demo-coconut-oil', 'consumer')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950/70 border border-slate-800 hover:border-amber-600 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1.5 truncate">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">2. Missing Mandatory USP</span>
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">Coconut Oil 500ml: Rule 6(1)(e) Violation</div>
                </div>
                <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded ml-1 shrink-0">Rule 6</span>
              </button>

              {/* Case 3: 100% Compliant */}
              <button
                type="button"
                onClick={() => handleLaunchCase('demo-whole-wheat-atta', 'officer')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-600 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-extrabold text-emerald-300 flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">3. 100% Genuine Pass &amp; Officer Desk</span>
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">Shakti Bhog Atta 5kg: ₹275 / ₹55/kg (Compliant)</div>
                </div>
                <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded ml-1 shrink-0">Pass</span>
              </button>

              {/* Case 4: Electronics Exemption */}
              <button
                type="button"
                onClick={() => handleLaunchCase('demo-powerbank', 'officer')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-blue-950/70 border border-slate-800 hover:border-blue-600 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-extrabold text-blue-300 flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">4. Electronics BIS &amp; USP Exemption</span>
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">VoltMax Power Bank: BIS Marked • USP Exempt</div>
                </div>
                <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded ml-1 shrink-0">BIS R</span>
              </button>
            </div>

            {/* Quick Evidence Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSampleReport}
                className="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <Download className="w-3 h-3" />
                <span>Form PC-1 Report</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  authService.logout();
                  navigate('/login');
                }}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                title="Switch Portal Entry"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>Portals</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
