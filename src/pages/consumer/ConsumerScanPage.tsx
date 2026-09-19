import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Upload, Sparkles, AlertCircle,
  ShoppingBag, Zap, PhoneCall, ExternalLink,
  CheckCircle2, Edit3, ShieldAlert, ArrowRight, X, RefreshCw, Plus, Layers, Database
} from 'lucide-react';
import { ProductCategory, InspectionResult, SavedInspection, PackageSideTag, ImageQualityInfo } from '../../types/inspection';
import { DEMO_PRESETS } from '../../data/demoProducts';
import { ocrService } from '../../services/ocrService';
import { persistenceService } from '../../services/persistenceService';
import { CameraCaptureModal } from '../../components/Modals/CameraCaptureModal';
import { CloudConnectionModal } from '../../components/Modals/CloudConnectionModal';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { sanitizeProductName } from '../../utils/sanitize';
import { aggregateMultiSideScans, MultiSideScanPayload } from '../../services/multiSideAggregator';
import { prewarmTesseractWorker } from '../../services/tesseractEngine';
import { convertToJpegDataUrl } from '../../utils/imagePreprocessor';
import { calculatePricingIntelligence } from '../../services/complianceEngine';

interface QueuedSidePhoto {
  id: string;
  tag: PackageSideTag;
  dataUrl: string;
  name: string;
}

export const ConsumerScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sideFileInputRef = useRef<HTMLInputElement>(null);
  const scanBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    prewarmTesseractWorker();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('FOOD');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('demo-potato-chips');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('demo-potato-chips');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [activeSideCapturing, setActiveSideCapturing] = useState<PackageSideTag>('FRONT');

  // Multi-Side Packaging Queue
  const [queuedSides, setQueuedSides] = useState<QueuedSidePhoto[]>([]);

  // Custom package specs (allows instant fine-tuning)
  const [customName, setCustomName] = useState<string>('');
  const [customMRP, setCustomMRP] = useState<string>('');
  const [customQty, setCustomQty] = useState<string>('');
  const [customUnit, setCustomUnit] = useState<string>('g');
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);

  // Scanner state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStage, setScanStage] = useState<{ label: string; progressPercent: number; detail: string } | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState<boolean>(false);

  const executeScan = async (
    categoryToUse: ProductCategory = selectedCategory,
    overrideImage?: string,
    overrideFileName?: string,
    presetIdToUse?: string,
    additionalSides: QueuedSidePhoto[] = queuedSides
  ) => {
    const capturedImage = overrideImage || uploadedImage;
    const capturedPresetId = presetIdToUse !== undefined ? presetIdToUse : selectedPresetId;
    const capturedFileName = overrideFileName || fileName;

    const imageToScan = capturedImage
      || (capturedPresetId ? DEMO_PRESETS.find(p => p.id === capturedPresetId)?.imageUrl : undefined)
      || DEMO_PRESETS[0].imageUrl;

    setIsScanning(true);
    setScanError(null);

    setTimeout(() => {
      scanBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    const inspectionId = `SCAN-CITIZEN-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const fileKey = capturedImage ? capturedFileName : (capturedPresetId || 'uploaded_image.jpg');
      
      // Step 1: Process primary image
      let primaryResult: InspectionResult = await ocrService.processImage(
        imageToScan,
        fileKey,
        categoryToUse,
        (stage) => setScanStage(stage)
      );

      // Step 2: If multi-side photos were added, scan additional sides and aggregate
      if (additionalSides.length > 0) {
        setScanStage({
          label: 'Aggregating Multi-Side Evidence',
          detail: `Combining declarations across ${additionalSides.length + 1} packaging sides...`,
          progressPercent: 88
        });

        const additionalPayloads: MultiSideScanPayload[] = [];
        for (const side of additionalSides) {
          const sideResult = await ocrService.processImage(
            side.dataUrl,
            side.name,
            categoryToUse
          );
          additionalPayloads.push({
            sideTag: side.tag,
            imageUrl: side.dataUrl,
            result: sideResult
          });
        }

        primaryResult = aggregateMultiSideScans(primaryResult, additionalPayloads);
      }

      primaryResult.inspectionId = inspectionId;
      primaryResult.inspector = {
        id: 'CITIZEN-VERIFIED',
        name: lang === 'hi' ? 'नागरिक उपभोक्ता' : 'Citizen Consumer',
        designation: lang === 'hi' ? 'उपभोक्ता सत्यापन डेस्क' : 'Public Consumer (Jago Grahak Jago)',
        jurisdiction: 'Consumer Verification Desk',
      };

      const finalName = customName.trim() || primaryResult.product.name || sanitizeProductName(capturedFileName, inspectionId);
      primaryResult.product.name = finalName;

      if (customMRP && parseFloat(customMRP) > 0) {
        const mrpNum = parseFloat(customMRP);
        const qtyNum = parseFloat(customQty) || primaryResult.pricing.netQuantityValue || 100;
        const unitStr = customUnit || primaryResult.pricing.netQuantityUnit || 'g';
        primaryResult.pricing.mrpAmount = mrpNum;
        primaryResult.pricing.netQuantityValue = qtyNum;
        primaryResult.pricing.netQuantityUnit = unitStr;
        primaryResult.pricing = calculatePricingIntelligence(
          mrpNum,
          qtyNum,
          unitStr,
          primaryResult.pricing.printedUSPText
        );
      }

      const savedItem: SavedInspection = {
        id: inspectionId,
        metadata: {
          inspectionId,
          establishmentName: lang === 'hi' ? 'खुदरा बाजार (उपभोक्ता जांच)' : 'Retail Market (Consumer Scan)',
          productName: finalName,
          productCategory: primaryResult.product.category as ProductCategory,
          location: 'Consumer Purchase Check',
          inspectorId: 'CITIZEN-PORTAL',
          inspectorName: 'Citizen Consumer',
          inspectorDesignation: 'Consumer',
          dateTime: new Date().toISOString(),
          notes: `Scanned via Citizen Desk. Analyzed ${additionalSides.length + 1} package surface(s).`,
        },
        presetId: capturedPresetId || undefined,
        images: [imageToScan, ...additionalSides.map(s => s.dataUrl)],
        result: primaryResult,
        decisions: [],
        auditTrail: [
          {
            id: `ae-${Date.now()}`,
            type: 'INSPECTION_CREATED',
            description: `Consumer verified packaging for ${finalName}`,
            timestamp: new Date().toISOString(),
            actor: 'Citizen Consumer',
          },
        ],
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'COMPLETED',
        pdfGenerated: false,
      };

      persistenceService.save(savedItem);
      navigate(`/consumer/result/${inspectionId}`);
    } catch (err: any) {
      console.error('[MetrologyLens] Scan pipeline error:', err);
      setScanError(
        err?.message === 'NO_READABLE_TEXT'
          ? (lang === 'hi'
            ? 'इस फोटो में पढ़ने योग्य पैकेजिंग टेक्स्ट नहीं मिला। MRP/quantity का close-up, सीधी और रोशनी वाली फोटो लें।'
            : 'No readable packaging text was found. Capture a straight, well-lit close-up of the MRP and quantity label.')
          : (lang === 'hi'
            ? 'छवि से पर्याप्त पाठ पढ़ने में असमर्थ। कृपया अधिक स्पष्ट और केंद्रित फोटो अपलोड करें।'
            : 'Unable to read sufficient text from this image. Please upload a clearer, well-lit image of the packaging label.')
      );
      setIsScanning(false);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setUploadedImage(null);
    setFileName(presetId);
    setQueuedSides([]);

    let cat: ProductCategory = 'FOOD';
    if (presetId.includes('powerbank')) cat = 'ELECTRONICS';
    else if (presetId.includes('notebook')) cat = 'GENERAL';
    else if (presetId.includes('pharma')) cat = 'PHARMA';

    executeScan(cat, undefined, presetId, presetId);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawDataUrl = event.target?.result as string;
        if (rawDataUrl) {
          try {
            const dataUrl = await convertToJpegDataUrl(rawDataUrl);
            setUploadedImage(dataUrl);
            setFileName(file.name);
            setQueuedSides([]);
            executeScan(selectedCategory, dataUrl, file.name);
          } catch {
            setUploadedImage(rawDataUrl);
            setFileName(file.name);
            setQueuedSides([]);
            executeScan(selectedCategory, rawDataUrl, file.name);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSideFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawDataUrl = event.target?.result as string;
        if (rawDataUrl) {
          const dataUrl = await convertToJpegDataUrl(rawDataUrl);
          const newSide: QueuedSidePhoto = {
            id: `side-${Date.now()}`,
            tag: activeSideCapturing,
            dataUrl,
            name: `${activeSideCapturing}_${file.name}`
          };
          setQueuedSides(prev => [...prev.filter(s => s.tag !== activeSideCapturing), newSide]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async (rawDataUrl: string) => {
    setIsCameraOpen(false);
    const dataUrl = await convertToJpegDataUrl(rawDataUrl);
    const camFileName = `camera_${activeSideCapturing.toLowerCase()}_${Date.now()}.jpg`;
    if (activeSideCapturing === 'FRONT' && queuedSides.length === 0) {
      setUploadedImage(dataUrl);
      setFileName(camFileName);
      executeScan(selectedCategory, dataUrl, camFileName);
    } else {
      const newSide: QueuedSidePhoto = {
        id: `side-${Date.now()}`,
        tag: activeSideCapturing,
        dataUrl,
        name: camFileName
      };
      setQueuedSides(prev => [...prev.filter(s => s.tag !== activeSideCapturing), newSide]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Live WebRTC Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Hero Banner: Jago Grahak Jago */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3 relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'hi' ? 'विधिक मापविज्ञान AI सत्यापन पोर्टल' : 'AI Legal Metrology Verification Portal'}</span>
            </div>
            <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
              {lang === 'hi' ? 'जागो ग्राहक जागो' : 'Jago Grahak Jago'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCloudModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-emerald-300 text-xs font-bold border border-emerald-400/40 shadow-md backdrop-blur-md cursor-pointer transition-all hover:scale-105"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSupabaseConfigured() ? 'Cloud DB: Live' : 'Configure Cloud'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
          {lang === 'hi'
            ? 'पैकेट स्कैन करें एवं असली MRP, USP और कानूनी नियमों की जांच करें'
            : 'Scan Any Packaging to Verify MRP, Unit Sale Price & Statutory Laws'}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl font-medium leading-relaxed">
          {lang === 'hi'
            ? 'भारत सरकार के Legal Metrology Rules, 2011 के तहत किसी भी खाद्य पदार्थ, दवा या इलेक्ट्रॉनिक वस्तु के पैकेट पर प्रत्यक्ष साक्ष्य के आधार पर MRP, USP और अनिवार्य घोषणाओं की जांच करें।'
            : 'Evidence-based statutory verification: extracts MRP, calculates accurate Unit Sale Price (USP), and audits 8 mandatory packaging declarations with zero synthetic guesswork.'}
        </p>
      </div>

      {/* Central Scanner Command Center */}
      {scanError && !isScanning && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-rose-800">
              {lang === 'hi' ? 'स्कैन विफल' : 'Scan Failed'}
            </p>
            <p className="text-xs text-rose-600 mt-0.5">{scanError}</p>
          </div>
          <button
            onClick={() => setScanError(null)}
            className="text-rose-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        ref={scanBoxRef}
        className="scroll-mt-4 glass-card p-5 sm:p-8 space-y-6 relative overflow-hidden card-hover"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                {lang === 'hi' ? 'स्मार्ट AI पैकेजिंग स्कैनर' : 'Smart AI Packaging Scanner'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'hi' ? 'कैमरे से फोटो लें, गैलरी से अपलोड करें या मल्टी-साइड स्कैन करें' : 'Capture photo, upload image, or run a multi-angle inspection'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'hi' ? 'लाइव AI सक्रिय' : 'Live AI Ready'}</span>
          </div>
        </div>

        {isScanning ? (
          <div className="py-12 px-4 max-w-md mx-auto text-center space-y-6 animate-in fade-in">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 flex items-center justify-center text-white shadow-2xl shadow-emerald-600/40 border border-emerald-400">
                <ShoppingBag className="w-12 h-12 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {scanStage?.label || (lang === 'hi' ? 'AI पैकेजिंग विश्लेषण चल रहा है...' : 'AI Packaging Verification in Progress...')}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                {scanStage?.detail || (lang === 'hi' ? 'MRP, USP, एक्सपायरी, FSSAI और निर्माता विवरण की जांच की जा रही है...' : 'Reading text blocks, extracting declarations, validating compliance...')}
              </p>
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden shadow-inner p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${scanStage?.progressPercent || 35}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                <span>{lang === 'hi' ? 'विधिक मापविज्ञान जांच' : 'Optical Evidence Engine'}</span>
                <span className="text-emerald-700 font-black">{scanStage?.progressPercent || 35}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* GPay-style Circular Scan Button */}
            <div className="flex flex-col items-center justify-center py-4 gap-6">

              {/* Main Circular Scan Button */}
              <div className="relative flex items-center justify-center">
                {/* Outer pulsing rings */}
                <span className="absolute w-44 h-44 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
                <span className="absolute w-36 h-36 rounded-full bg-emerald-500/15 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />

                {/* Inner static ring */}
                <span className="absolute w-32 h-32 rounded-full border-2 border-emerald-400/30" />

                {/* The main button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSideCapturing('FRONT');
                    setIsCameraOpen(true);
                  }}
                  className="relative w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-2xl shadow-emerald-600/50 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 border-4 border-white/30 z-10"
                >
                  {/* Scanner icon — like GPay viewfinder */}
                  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Viewfinder corners */}
                    <path d="M6 16V8h8" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M42 16V8h-8" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 32v8h8" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M42 32v8h-8" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Center scan line */}
                    <line x1="10" y1="24" x2="38" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3"/>
                  </svg>
                  <span className="text-[11px] font-black tracking-wider uppercase text-white/90">
                    {lang === 'hi' ? 'स्कैन' : 'Scan'}
                  </span>
                </button>
              </div>

              <p className="text-xs text-slate-500 font-medium text-center">
                {lang === 'hi'
                  ? 'बटन दबाएं और पैकेट पर कैमरा रखें'
                  : 'Tap to open camera · point at packaging label'}
              </p>

              {/* Secondary options row */}
              <div className="flex items-center gap-4 w-full max-w-xs">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] text-slate-400 font-medium shrink-0">
                  {lang === 'hi' ? 'या' : 'or'}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Upload from Gallery — secondary, smaller */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95 border border-slate-200"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>{lang === 'hi' ? 'गैलरी से चुनें' : 'Upload from Gallery'}</span>
              </button>

            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
              onChange={handleFileUpload}
              className="hidden"
            />

            <input
              ref={sideFileInputRef}
              type="file"
              accept="image/*"
              onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
              onChange={handleAddSideFile}
              className="hidden"
            />


            {/* ── Manual Entry Accordion ── */}
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white/60">
              <button
                type="button"
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50/80 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="font-semibold">{lang === 'hi' ? 'Manual Entry / Fine-Tune' : 'Optional: Enter Product Details Manually'}</span>
                </div>
                <div className={`w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-200 ${showManualEntry ? 'rotate-180' : ''}`}>
                  <span className="text-[10px] text-slate-500">▼</span>
                </div>
              </button>

              {showManualEntry && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-100 fade-in">
                  {/* Barcode Quick Lookup */}
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                    <span className="text-[11px] font-black text-emerald-900">⚡ Quick Barcode Lookup</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Maggi', code: '8901058852393', cat: 'FOOD' as ProductCategory },
                        { name: 'Parle-G', code: '8901719101037', cat: 'FOOD' as ProductCategory },
                        { name: "Lay's", code: '8901491101830', cat: 'FOOD' as ProductCategory },
                        { name: 'Fortune Oil', code: '8906007280014', cat: 'FOOD' as ProductCategory },
                        { name: 'Dolo 650', code: '8901117002014', cat: 'PHARMA' as ProductCategory },
                      ].map(item => (
                        <button key={item.code} type="button"
                          onClick={() => { setCustomName(item.name); setSelectedCategory(item.cat); executeScan(item.cat, undefined, `${item.code}.jpg`, undefined); }}
                          className="px-3 py-1 bg-white border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 cursor-pointer btn-press">
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Product Name', placeholder: 'Marie Gold...', value: customName, onChange: (v: string) => setCustomName(v), type: 'text' },
                      { label: 'MRP (₹)', placeholder: '50', value: customMRP, onChange: (v: string) => setCustomMRP(v), type: 'number' },
                      { label: 'Net Quantity', placeholder: '250', value: customQty, onChange: (v: string) => setCustomQty(v), type: 'number' },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={f.value}
                          onChange={(e) => f.onChange(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 outline-none transition-all duration-200" />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Unit</label>
                      <select value={customUnit} onChange={(e) => setCustomUnit(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 outline-none transition-all duration-200">
                        <option value="g">Grams (g)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="ml">Millilitres (ml)</option>
                        <option value="L">Litres (L)</option>
                        <option value="Unit">Unit / NOS</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Multi-Angle Steps ── */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{lang === 'hi' ? 'वैकल्पिक: और कोणों से फोटो' : 'Optional: Multi-Angle Photos'}</p>
                    <p className="text-[10px] text-slate-400">{lang === 'hi' ? '1 काफी है — ज़्यादा से बेहतर accuracy' : '1 photo is enough · more sides = higher accuracy'}</p>
                  </div>
                </div>
                {(() => {
                  const count = (uploadedImage ? 1 : 0) + queuedSides.length;
                  return count > 0 ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {count} ready
                    </span>
                  ) : null;
                })()}
              </div>

              <div className="p-3 grid grid-cols-4 gap-2">
                {[
                  { step: 1, tag: 'FRONT' as PackageSideTag, title: 'Front', icon: '🏷️', isUploaded: Boolean(uploadedImage) },
                  { step: 2, tag: 'BACK' as PackageSideTag, title: 'Back', icon: '🏭', isUploaded: queuedSides.some(s => s.tag === 'BACK') },
                  { step: 3, tag: 'TOP' as PackageSideTag, title: 'MRP', icon: '💰', isUploaded: queuedSides.some(s => s.tag === 'TOP') },
                  { step: 4, tag: 'SIDE_LEFT' as PackageSideTag, title: 'Side', icon: '📋', isUploaded: queuedSides.some(s => s.tag === 'SIDE_LEFT' || s.tag === 'SIDE_RIGHT') },
                ].map(item => (
                  <button key={item.tag} type="button"
                    onClick={() => { setActiveSideCapturing(item.tag); setIsCameraOpen(true); }}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all duration-200 btn-press cursor-pointer ${
                      item.isUploaded
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}>
                    <span className="text-lg">{item.isUploaded ? '✅' : item.icon}</span>
                    <span className="text-[10px] font-bold">{item.title}</span>
                    <span className={`text-[9px] font-semibold ${item.isUploaded ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {item.isUploaded ? 'Done' : 'Tap'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Analyze button — shown when photo ready */}
              {(uploadedImage || queuedSides.length > 0) && (
                <div className="px-3 pb-3 fade-in">
                  <button type="button"
                    onClick={() => executeScan(selectedCategory, uploadedImage || undefined, fileName, undefined, queuedSides)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all duration-200 btn-press cursor-pointer">
                    <span>🔍 {lang === 'hi' ? 'पैकेज का विश्लेषण करें' : 'Analyze Package'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Benchmark Presets Section */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider mb-1.5">
              📦 Demo Benchmarks
            </span>
            <h3 className="text-sm font-extrabold text-slate-900">
              {lang === 'hi' ? 'नियंत्रित बेंचमार्क सैंपल्स' : 'Try with Sample Products'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {DEMO_PRESETS.length} available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {DEMO_PRESETS.map((preset) => (
            <button key={preset.id} type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className="p-3 rounded-2xl border border-slate-200/80 bg-white/80 hover:border-emerald-400/60 hover:bg-emerald-50/40 text-left transition-all duration-200 cursor-pointer flex items-center gap-3 group card-hover">
              <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                <img src={preset.imageUrl} alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{preset.title}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{preset.subtitle}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-mono font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    ₹{preset.mrp.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">{preset.netQuantity}</span>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-all duration-200 shrink-0">
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>


      <CloudConnectionModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />
    </div>
  );
};
