import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Camera, Shield, ArrowRight, CheckCircle2, AlertCircle,
  Building2, MapPin, Package, User, Calendar, FileText, Sparkles
} from 'lucide-react';
import { ocrService } from '../services/ocrService';
import { persistenceService } from '../services/persistenceService';
import { authService } from '../services/authService';
import { DEMO_PRESETS } from '../data/demoProducts';
import { ProductCategory, InspectionResult, SavedInspection, InspectionMetadata } from '../types/inspection';
import { CameraCaptureModal } from '../components/Modals/CameraCaptureModal';
import { useLanguage } from '../context/LanguageContext';

export const NewInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const { lang, t } = useLanguage();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Form Metadata
  const [metadata, setMetadata] = useState<InspectionMetadata>(() => ({
    inspectionId: `INS-GOI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    establishmentName: 'Apex Retail Mart',
    establishmentAddress: 'Shop 14, Block B, Connaught Place, New Delhi - 110001',
    productName: 'Crunchy Supreme Potato Chips 250g',
    productCategory: 'FOOD',
    manufacturer: 'Apex Snack Foods Pvt. Ltd., New Delhi',
    location: 'Connaught Place, New Delhi',
    inspectorId: currentUser?.inspectorId || 'LMO-DEL-2024-0042',
    inspectorName: currentUser?.name || 'Officer Ravi Kumar',
    inspectorDesignation: currentUser?.designation || 'Legal Metrology Officer',
    dateTime: new Date().toISOString().slice(0, 16),
    notes: 'Market survey inspection under Legal Metrology Enforcement Drive.',
  }));

  // Image & Preset state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('demo-potato-chips');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('demo-potato-chips');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // AI Processing State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<{ label: string; progressPercent: number; detail: string } | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setCustomImage(null);
    setFileName(presetId);

    const preset = DEMO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      const category: ProductCategory =
        presetId.includes('powerbank') ? 'ELECTRONICS' :
        presetId.includes('notebook') ? 'GENERAL' : 'FOOD';

      setMetadata(prev => ({
        ...prev,
        productName: preset.title,
        productCategory: category,
      }));
    }
  };

  // Handle Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        setSelectedPresetId('');
        setFileName(file.name);
        setMetadata(prev => ({
          ...prev,
          productName: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Full AI OCR Inspection
  const handleStartInspection = async () => {
    const imageToAnalyze = customImage || DEMO_PRESETS.find(p => p.id === selectedPresetId)?.imageUrl || '';
    const fileKey = customImage ? fileName : selectedPresetId;

    if (!imageToAnalyze) {
      setAnalysisError('Please upload an image or select a benchmark product preset.');
      return;
    }

    setCurrentStep(3);
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result: InspectionResult = await ocrService.processImage(
        imageToAnalyze,
        fileKey,
        metadata.productCategory,
        (stage) => {
          setAnalysisStage(stage);
        }
      );

      // Link inspection IDs
      result.inspectionId = metadata.inspectionId;
      result.inspector = {
        id: metadata.inspectorId,
        name: metadata.inspectorName,
        designation: metadata.inspectorDesignation,
        jurisdiction: metadata.location || 'NCT of Delhi, Zone-IV',
      };
      result.product.name = metadata.productName;
      result.product.category = metadata.productCategory;

      // Construct SavedInspection entity
      const savedItem: SavedInspection = {
        id: metadata.inspectionId,
        metadata: metadata,
        presetId: selectedPresetId || undefined,
        images: [imageToAnalyze],
        result: result,
        decisions: [],
        auditTrail: [
          {
            id: `ae-${Date.now()}-1`,
            type: 'INSPECTION_CREATED',
            description: `Inspection docket initiated for ${metadata.productName} at ${metadata.establishmentName}`,
            timestamp: new Date().toISOString(),
            actor: metadata.inspectorName,
          },
          {
            id: `ae-${Date.now()}-2`,
            type: 'AI_ANALYSIS_COMPLETED',
            description: `AI OCR & Rule Engine completed analysis. Score: ${result.compliancePercentage}%. ${result.findings.length} findings generated.`,
            timestamp: new Date().toISOString(),
            actor: 'MetrologyLens AI Engine',
          },
        ],
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'IN_REVIEW',
        pdfGenerated: false,
      };

      // Persist to localStorage
      persistenceService.save(savedItem);

      // Navigate to Results page
      navigate(`/inspect/${metadata.inspectionId}/results`);
    } catch (err: any) {
      console.error('Inspection error:', err);
      setAnalysisError(err?.message || 'Failed to complete AI OCR inspection. Please retry.');
      setIsAnalyzing(false);
    }
  };

  const handleCameraCapture = (dataUrl: string) => {
    setCustomImage(dataUrl);
    setSelectedPresetId('');
    setFileName(`officer_camera_${Date.now()}.jpg`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Live WebRTC Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Header & Steps Indicator */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                {lang === 'hi' ? 'नया विधिक मापविज्ञान निरीक्षण' : 'New Legal Metrology Inspection'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === 'hi' ? 'डॉकेट आईडी:' : 'Docket ID:'} <span className="font-mono font-bold text-blue-600">{metadata.inspectionId}</span> • {lang === 'hi' ? 'आधिकारिक फॉर्म PC-1' : 'Official Form PC-1'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className={`px-3 py-1 rounded-full ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {lang === 'hi' ? '1. डॉकेट विवरण' : '1. Docket Info'}
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-3 py-1 rounded-full ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {lang === 'hi' ? '2. उत्पाद फोटो' : '2. Product Media'}
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-3 py-1 rounded-full ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {lang === 'hi' ? '3. AI विश्लेषण' : '3. AI Analysis'}
            </span>
          </div>
        </div>

        {/* STEP 1: METADATA FORM */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'hi' ? 'प्रतिष्ठान / दुकान का नाम *' : 'Establishment / Retailer Name *'}</span>
                </label>
                <input
                  type="text"
                  value={metadata.establishmentName}
                  onChange={(e) => setMetadata({ ...metadata, establishmentName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Apex Supermarket Pvt. Ltd."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'hi' ? 'निरीक्षण स्थल / पता' : 'Inspection Location / Address'}</span>
                </label>
                <input
                  type="text"
                  value={metadata.location}
                  onChange={(e) => setMetadata({ ...metadata, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Connaught Place, New Delhi"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'hi' ? 'उत्पाद / वस्तु का नाम *' : 'Product / Commodity Name *'}</span>
                </label>
                <input
                  type="text"
                  value={metadata.productName}
                  onChange={(e) => setMetadata({ ...metadata, productName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Crunchy Supreme Potato Chips 250g"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {lang === 'hi' ? 'वस्तु श्रेणी (नियामक मानक) *' : 'Commodity Category (Regulatory Standard) *'}
                </label>
                <select
                  value={metadata.productCategory}
                  onChange={(e) => setMetadata({ ...metadata, productCategory: e.target.value as ProductCategory })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="FOOD">{lang === 'hi' ? '🥗 खाद्य एवं पेय (USP Math, एक्सपायरी, FSSAI)' : '🥗 Food & FMCG (Enforces USP Math, Expiry, FSSAI)'}</option>
                  <option value="ELECTRONICS">{lang === 'hi' ? '⚡ इलेक्ट्रॉनिक्स एवं IT (BIS मार्क, वोल्टेज, मॉडल)' : '⚡ Electronics & IT (Enforces BIS Mark, Voltage, Model)'}</option>
                  <option value="GENERAL">{lang === 'hi' ? '📦 सामान्य वस्तुएं / स्टेशनरी (माप, संख्या)' : '📦 General Goods / Stationery (Enforces Dimensions, Count)'}</option>
                  <option value="COSMETICS">{lang === 'hi' ? '💄 प्रसाधन सामग्री (बैच, MRP, एक्सपायरी)' : '💄 Cosmetics & Toiletries (Enforces Batch, MRP, Expiry)'}</option>
                  <option value="PHARMA">{lang === 'hi' ? '💊 दवा व स्वास्थ्य उत्पाद (AYUSH/Drug लाइसेंस)' : '💊 Ayurvedic / Pharmaceuticals (Enforces AYUSH/Drug Lic)'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'hi' ? 'निरीक्षण अधिकारी का नाम' : 'Inspecting Officer Name'}</span>
                </label>
                <input
                  type="text"
                  value={metadata.inspectorName}
                  onChange={(e) => setMetadata({ ...metadata, inspectorName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'hi' ? 'निरीक्षण की तिथि एवं समय' : 'Date & Time of Inspection'}</span>
                </label>
                <input
                  type="datetime-local"
                  value={metadata.dateTime}
                  onChange={(e) => setMetadata({ ...metadata, dateTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>{lang === 'hi' ? 'उत्पाद मीडिया चयन पर आगे बढ़ें' : 'Proceed to Product Media'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MEDIA CAPTURE & PRESETS */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            {/* Benchmark Samples Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  {lang === 'hi' ? '📦 मानक बेंचमार्क नमूना या संदर्भ केस चुनें' : '📦 Select Standard Benchmark Sample or Reference Case'}
                </span>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {lang === 'hi' ? 'मानक आधारभूत मॉडल' : 'Standard Baseline Models'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {DEMO_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <span className="text-xs font-extrabold text-slate-900 leading-snug">{preset.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{preset.subtitle}</p>
                      <div className="mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {preset.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Photo Upload Dropzone */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {lang === 'hi' ? '📷 क्षेत्रीय निरीक्षण पैकेजिंग फोटो अपलोड' : '📷 Field Inspection Packaging Photo Upload'}
              </span>

              <div className="p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl bg-slate-50 text-center space-y-3 transition-colors">
                {customImage ? (
                  <div className="space-y-3">
                    <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-md">
                      <img src={customImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">{fileName}</p>
                    <button
                      type="button"
                      onClick={() => setCustomImage(null)}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      {lang === 'hi' ? 'फोटो हटाएं और संदर्भ मॉडल चुनें' : 'Remove Custom Photo & Select Reference Model'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {lang === 'hi' ? 'पैकेज की स्पष्ट उच्च-रिज़ॉल्यूशन फोटो अपलोड करें' : 'Upload high-resolution packaging photo'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {lang === 'hi' ? 'JPG, PNG, WEBP समर्थित • विधिक घोषणाएं स्पष्ट होनी चाहिए' : 'Supports JPG, PNG, WEBP with legal declarations clearly visible'}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'कैमरा से फोटो लें' : 'Snap with Camera'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span>{lang === 'hi' ? 'फ़ाइल चुनें' : 'Choose File'}</span>
                      </button>
                    </div>
                  </>
                )}

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-xl cursor-pointer"
              >
                {lang === 'hi' ? '← विवरण पर वापस जाएं' : '← Back to Details'}
              </button>

              <button
                type="button"
                onClick={handleStartInspection}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>{lang === 'hi' ? 'विधिक मापविज्ञान AI ऑडिट शुरू करें' : 'Start Legal Metrology AI Audit'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LIVE AI PROCESSING STAGE OVERLAY */}
        {currentStep === 3 && (
          <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-6 animate-in fade-in">
            {analysisError ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-md">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {lang === 'hi' ? 'निरीक्षण इंजन त्रुटि' : 'Inspection Engine Error'}
                  </h3>
                  <p className="text-xs text-rose-600 font-medium mt-1">{analysisError}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {lang === 'hi' ? 'मीडिया चयन पर वापस जाएं' : 'Back to Media Selection'}
                </button>
              </div>
            ) : (
              <>
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-3xl bg-blue-600/10 animate-ping" />
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                    <Shield className="w-10 h-10 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {analysisStage?.label || (lang === 'hi' ? 'OCR पाइपलाइन प्रारंभ हो रही है...' : 'Initializing Neural OCR Pipeline...')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    {analysisStage?.detail || (lang === 'hi' ? 'छवि सामान्यीकरण एवं वैधानिक नियमों का मिलान किया जा रहा है।' : 'Performing image normalization and statutory clause pattern matching.')}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${analysisStage?.progressPercent || 15}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400">
                    <span>{lang === 'hi' ? 'विधिक मापविज्ञान ऑडिट' : 'Legal Metrology Audit'}</span>
                    <span className="text-blue-600">{analysisStage?.progressPercent || 15}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
