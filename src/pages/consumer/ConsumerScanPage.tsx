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
          productCategory: categoryToUse,
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
      setIsScanning(false);
      setScanError(
        lang === 'hi'
          ? 'छवि से पर्याप्त पाठ पढ़ने में असमर्थ। कृपया अधिक स्पष्ट और केंद्रित फोटो अपलोड करें।'
          : 'Unable to read sufficient text from this image. Please upload a clearer, well-lit image.'
      );
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
      executeScan('FOOD', dataUrl, camFileName);
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
      <div
        ref={scanBoxRef}
        className="scroll-mt-4 bg-white rounded-3xl p-5 sm:p-8 border-2 border-emerald-500/40 shadow-xl shadow-emerald-600/5 space-y-6 relative overflow-hidden"
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
            {scanError ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-md">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{lang === 'hi' ? 'स्कैन त्रुटि' : 'Scan Error'}</h3>
                  <p className="text-xs text-rose-600 font-medium mt-1">{scanError}</p>
                </div>
                <button
                  onClick={() => setIsScanning(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Live Camera Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveSideCapturing('FRONT');
                  setIsCameraOpen(true);
                }}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-98 border border-emerald-400/40 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-sm sm:text-base font-black tracking-tight block">
                    {lang === 'hi' ? '📸 लाइव कैमरा से स्कैन करें' : '📸 1-Tap Live Camera Scan'}
                  </span>
                  <span className="text-[11px] text-emerald-100 font-medium block mt-0.5">
                    {lang === 'hi' ? 'कैमरा खोलें और सीधे पैकेट की फोटो लें' : 'Point camera directly at packaging label'}
                  </span>
                </div>
              </button>

              {/* Gallery Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-xl flex items-center justify-center gap-3.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-98 border border-slate-700 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-sm sm:text-base font-black tracking-tight block">
                    {lang === 'hi' ? '🖼️ गैलरी से फोटो चुनें' : '🖼️ Upload from Gallery'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                    {lang === 'hi' ? 'फोन या कंप्यूटर से पैकेजिंग इमेज चुनें' : 'Select JPG, PNG, WebP image'}
                  </span>
                </div>
              </button>

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
            </div>

            {/* Quick Manual Entry / Fine-Tuning Drawer */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
              <button
                type="button"
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-emerald-700 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? '⚡ वैकल्पिक: उत्पाद का नाम या MRP सीधे दर्ज करें (Manual Entry / Fine-Tune)' : '⚡ Optional: Direct Product Name, MRP or Quantity Input'}</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold font-mono">
                  {showManualEntry ? '▲ Hide' : '▼ Expand'}
                </span>
              </button>

              {showManualEntry && (
                <div className="pt-2 border-t border-slate-200/70 space-y-3 animate-in fade-in">
                  {/* Barcode Fast Lookup */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-emerald-950 flex items-center gap-1.5">
                        <span>⚡ 1-Tap Barcode / EAN-13 Instant Lookup</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">GS1 India Master</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Maggi (8901058852393)', code: '8901058852393', cat: 'FOOD' as ProductCategory },
                        { name: 'Parle-G (8901719101037)', code: '8901719101037', cat: 'FOOD' as ProductCategory },
                        { name: "Lay's (8901491101830)", code: '8901491101830', cat: 'FOOD' as ProductCategory },
                        { name: 'Fortune Oil (8906007280014)', code: '8906007280014', cat: 'FOOD' as ProductCategory },
                        { name: 'Amul Butter (8901262010025)', code: '8901262010025', cat: 'FOOD' as ProductCategory },
                        { name: 'Dolo 650 (8901117002014)', code: '8901117002014', cat: 'PHARMA' as ProductCategory },
                        { name: 'VoltMax 20K (8908849201994)', code: '8908849201994', cat: 'ELECTRONICS' as ProductCategory }
                      ].map(item => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setCustomName(item.name.split(' (')[0]);
                            setSelectedCategory(item.cat);
                            executeScan(item.cat, undefined, `${item.code}.jpg`, undefined);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-lg text-[10px] font-bold text-emerald-900 transition-colors cursor-pointer"
                        >
                          🏷️ {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10px] font-black text-slate-600 block mb-1">Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Marie Gold Biscuit"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-600 block mb-1">Printed MRP (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={customMRP}
                        onChange={(e) => setCustomMRP(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-600 block mb-1">Net Quantity</label>
                      <input
                        type="number"
                        placeholder="e.g. 250"
                        value={customQty}
                        onChange={(e) => setCustomQty(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-600 block mb-1">Metric Unit</label>
                      <select
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-emerald-500 outline-hidden"
                      >
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

            {/* Guided 4-Angle Stepper & Evidence Completeness Indicator */}
            <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-3.5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-black tracking-tight text-white block">
                      {lang === 'hi' ? 'गाइडेड मल्टी-एंगल पैकेजिंग स्कैनर' : 'Guided Multi-Angle Packaging Workflow'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {lang === 'hi' ? 'सटीक कानूनी सत्यापन के लिए पैकेट की आवश्यक सतहें जोड़ें' : 'Capture required panels for 100% evidence-backed verification'}
                    </span>
                  </div>
                </div>

                {/* Evidence Completeness Pill */}
                {(() => {
                  const requiredViewsCount = selectedCategory === 'FOOD' ? 4 : selectedCategory === 'COSMETICS' ? 3 : 2;
                  const capturedCount = (uploadedImage ? 1 : 0) + queuedSides.length;
                  const isComplete = capturedCount >= requiredViewsCount;
                  return (
                    <div className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border shadow-sm ${
                      isComplete 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                        : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>Evidence Completeness: {capturedCount}/{requiredViewsCount} views captured</span>
                    </div>
                  );
                })()}
              </div>

              {/* 4 Guided Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    step: '1/4',
                    tag: 'FRONT' as PackageSideTag,
                    title: 'FRONT',
                    desc: 'Brand, name, net quantity',
                    icon: '🏷️',
                    isUploaded: Boolean(uploadedImage)
                  },
                  {
                    step: '2/4',
                    tag: 'BACK' as PackageSideTag,
                    title: 'BACK',
                    desc: 'Mfg / FSSAI / declarations',
                    icon: '🏭',
                    isUploaded: queuedSides.some(s => s.tag === 'BACK')
                  },
                  {
                    step: '3/4',
                    tag: 'TOP' as PackageSideTag,
                    title: 'MRP & CRIMP',
                    desc: 'MRP, USP & date stamping',
                    icon: '💰',
                    isUploaded: queuedSides.some(s => s.tag === 'TOP')
                  },
                  {
                    step: '4/4',
                    tag: 'SIDE_LEFT' as PackageSideTag,
                    title: 'SIDE / NUTRITION',
                    desc: 'Nutrition & ingredients',
                    icon: '📋',
                    isUploaded: queuedSides.some(s => s.tag === 'SIDE_LEFT' || s.tag === 'SIDE_RIGHT')
                  }
                ].map((item) => {
                  const isCurrent = activeSideCapturing === item.tag;
                  return (
                    <div
                      key={item.tag}
                      className={`p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                        item.isUploaded
                          ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200'
                          : isCurrent
                          ? 'border-blue-500/60 bg-blue-950/40 text-blue-200'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          STEP {item.step}
                        </span>
                        <span className="text-sm">{item.icon}</span>
                      </div>

                      <div>
                        <div className="text-xs font-black text-white">{item.title}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
                      </div>

                      <div className="pt-1 flex items-center justify-between">
                        {item.isUploaded ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Captured
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500">
                            Required
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setActiveSideCapturing(item.tag);
                            setIsCameraOpen(true);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            item.isUploaded
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {item.isUploaded ? 'Retake' : 'Capture'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Analyze Package CTA when views are captured */}
              {(uploadedImage || queuedSides.length > 0) && (
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {(uploadedImage ? 1 : 0) + queuedSides.length} view(s) ready for statutory rule verification
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => executeScan(selectedCategory, uploadedImage || undefined, fileName, undefined, queuedSides)}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
                  >
                    <span>🔍 {lang === 'hi' ? 'पैकेज का विश्लेषण करें (Analyze Package)' : 'Analyze Package & Verify Rules'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Benchmark Presets Section (Strictly labeled as Demo Benchmark) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider mb-1">
              <span>Controlled Benchmark Library</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              {lang === 'hi' ? 'नियंत्रित बेंचमार्क टेस्ट सैंपल्स' : 'Controlled Benchmark Calibration Samples'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {DEMO_PRESETS.length} Benchmarks Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500/60 bg-white hover:bg-emerald-50/30 text-left transition-all cursor-pointer shadow-2xs hover:shadow-md flex items-center gap-3 group"
            >
              <img
                src={preset.imageUrl}
                alt={preset.title}
                className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{preset.title}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{preset.subtitle}</div>
                <div className="text-[9px] font-mono font-bold text-emerald-700 mt-1">
                  ₹{preset.mrp.toFixed(2)} • {preset.netQuantity}
                </div>
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
