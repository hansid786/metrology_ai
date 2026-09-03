import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  Scan, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  AlertCircle,
  FileImage,
  SearchCheck,
  Zap,
  BookOpen,
  Apple
} from 'lucide-react';
import { InspectionResult, ProductCategory } from '../../types/inspection';
import { OCRBoundingBoxes } from './OCRBoundingBoxes';
import { OCRProcessingStage } from '../../services/ocrService';
import { DEMO_PRESETS } from '../../data/demoProducts';

interface ProductScanProps {
  currentImage: string | null;
  fileName: string | null;
  isAnalyzing: boolean;
  activeStage: OCRProcessingStage | null;
  inspectionResult: InspectionResult | null;
  selectedKey: string | null;
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  onSelectKey: (key: string | null) => void;
  onUploadImage: (file: File) => void;
  onOpenLiveCamera: () => void;
  onAnalyze: () => void;
  onSelectPreset: (presetId: string) => void;
  onResetImage: () => void;
  onUpdateScannedValues?: (mrp: number, qty: number, unit: string, printedUSP?: string, title?: string) => void;
}

export const ProductScan: React.FC<ProductScanProps> = ({
  currentImage,
  fileName,
  isAnalyzing,
  activeStage,
  inspectionResult,
  selectedKey,
  selectedCategory,
  onSelectCategory,
  onSelectKey,
  onUploadImage,
  onOpenLiveCamera,
  onAnalyze,
  onSelectPreset,
  onResetImage,
  onUpdateScannedValues,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterMode, setFilterMode] = useState<'all' | 'violations' | 'none'>('all');
  const [showLabels, setShowLabels] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Inspector Live Editable Values
  const [editMRP, setEditMRP] = useState<number>(50);
  const [editQty, setEditQty] = useState<number>(250);
  const [editUnit, setEditUnit] = useState<string>('g');
  const [editUSP, setEditUSP] = useState<string>('₹ 0.25 / g');
  const [editTitle, setEditTitle] = useState<string>('');
  const [showEditDrawer, setShowEditDrawer] = useState(true);

  // Sync edit state whenever a new inspection result arrives
  React.useEffect(() => {
    if (inspectionResult) {
      setEditMRP(inspectionResult.pricing.mrpAmount);
      setEditQty(inspectionResult.pricing.netQuantityValue);
      setEditUnit(inspectionResult.pricing.netQuantityUnit);
      setEditUSP(inspectionResult.pricing.printedUSPText || '');
      setEditTitle(inspectionResult.product.name);
    }
  }, [inspectionResult]);

  const handleApplyCustomValues = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateScannedValues) {
      onUpdateScannedValues(editMRP, editQty, editUnit, editUSP.trim() || undefined, editTitle.trim() || undefined);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isPreset = DEMO_PRESETS.some(
    p => fileName?.includes(p.id.replace('demo-', '')) || (currentImage && currentImage.includes(p.id))
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setUploadError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported format. Please upload JPG, PNG, WEBP, or SVG images.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File is too large. Maximum supported image size is 15 MB.');
      return;
    }
    onUploadImage(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden flex flex-col h-full">
      {/* 3-Way Category Engine Selector */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-900 text-white space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-black tracking-wider text-blue-300">
            1. Select Legal Category:
          </span>
          <span className="text-[10px] font-mono text-slate-300">
            PCR 2011 Standards
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800/90 rounded-xl border border-slate-700">
          <button
            onClick={() => onSelectCategory('FOOD')}
            className={`py-1.5 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'FOOD'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Food &amp; FMCG</span>
          </button>

          <button
            onClick={() => onSelectCategory('ELECTRONICS')}
            className={`py-1.5 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'ELECTRONICS'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">Electronics</span>
          </button>

          <button
            onClick={() => onSelectCategory('GENERAL')}
            className={`py-1.5 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'GENERAL'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">General / Books</span>
          </button>
        </div>
      </div>

      {/* Preset Demo Scenarios Selector Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col gap-2 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-blue-50/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-extrabold text-slate-600 tracking-wider">
            Presets for {selectedCategory === 'FOOD' ? 'Food & FMCG' : selectedCategory === 'ELECTRONICS' ? 'Electronics' : 'General & Stationery'}:
          </span>
          {inspectionResult && (
            <span className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold shadow-xs">
              {isPreset ? `${inspectionResult.boundingBoxes.length} Detected Tokens` : 'Custom Photo'}
            </span>
          )}
        </div>

        {/* Dynamic Category Preset Pills */}
        <div className="grid grid-cols-2 gap-2">
          {selectedCategory === 'FOOD' && (
            <>
              <button
                onClick={() => onSelectPreset('demo-potato-chips')}
                disabled={isAnalyzing}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  fileName?.includes('potato-chips')
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="text-xs font-black">🥔 Chips 250g</div>
                <div className={`text-[10px] font-bold mt-0.5 ${fileName?.includes('potato-chips') ? 'text-blue-100' : 'text-rose-600'}`}>
                  +25% Overcharge
                </div>
              </button>

              <button
                onClick={() => onSelectPreset('demo-coconut-oil')}
                disabled={isAnalyzing}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  fileName?.includes('coconut-oil')
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="text-xs font-black">🥥 Coconut Oil</div>
                <div className={`text-[10px] font-bold mt-0.5 ${fileName?.includes('coconut-oil') ? 'text-blue-100' : 'text-rose-600'}`}>
                  Missing USP
                </div>
              </button>

              <button
                onClick={() => onSelectPreset('demo-whole-wheat-atta')}
                disabled={isAnalyzing}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  fileName?.includes('whole-wheat-atta')
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="text-xs font-black">🌾 Atta 5kg</div>
                <div className={`text-[10px] font-bold mt-0.5 ${fileName?.includes('whole-wheat-atta') ? 'text-blue-100' : 'text-emerald-600'}`}>
                  100% Verified OK
                </div>
              </button>

              <button
                onClick={() => onSelectPreset('demo-aykara-pharma')}
                disabled={isAnalyzing}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  fileName?.includes('aykara-pharma')
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="text-xs font-black">💊 Aykara 120 Caps</div>
                <div className={`text-[10px] font-bold mt-0.5 ${fileName?.includes('aykara-pharma') ? 'text-emerald-100' : 'text-emerald-600'}`}>
                  100% Compliant ✓
                </div>
              </button>
            </>
          )}

          {selectedCategory === 'ELECTRONICS' && (
            <button
              onClick={() => onSelectPreset('demo-powerbank')}
              disabled={isAnalyzing}
              className="col-span-2 sm:col-span-3 p-2.5 rounded-xl border bg-blue-600 text-white border-blue-600 shadow-md text-left cursor-pointer"
            >
              <div className="text-xs font-black truncate">⚡ VoltMax Power Core 20,000mAh Power Bank</div>
              <div className="text-[10px] text-blue-100 font-bold mt-0.5">
                Model VM-20K • BIS Safety R-84001928 • USP Exempt
              </div>
            </button>
          )}

          {selectedCategory === 'GENERAL' && (
            <button
              onClick={() => onSelectPreset('demo-notebook')}
              disabled={isAnalyzing}
              className="col-span-2 sm:col-span-3 p-2.5 rounded-xl border bg-blue-600 text-white border-blue-600 shadow-md text-left cursor-pointer"
            >
              <div className="text-xs font-black truncate">📦 Classmate Pulse Exercise Notebook 172 Pgs</div>
              <div className="text-[10px] text-blue-100 font-bold mt-0.5">
                Pages: 172 • Dimensions: 24.0 x 18.0 cm (70 GSM) • FSSAI N/A
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Main Image Area / Scanner Viewport */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
        {uploadError && (
          <div className="w-full mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 shadow-md">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {!currentImage ? (
          /* EMPTY STATE DROPZONE */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full h-full min-h-[320px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all ${
              isDragOver
                ? 'border-blue-500 bg-blue-950/30 scale-[0.99]'
                : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="text-sm font-extrabold text-white mb-1 tracking-tight">Upload Packaged Product</h3>
            <p className="text-xs text-slate-300 max-w-sm mb-3 font-medium leading-relaxed">
              Use preset scenarios below for the demo, or upload any real package photo to try our OCR engine.
            </p>

            {/* Demo Mode Tip */}
            <div className="w-full max-w-xs mb-3 px-3 py-2 bg-amber-900/50 border border-amber-700/60 rounded-xl flex items-start gap-2 text-left">
              <span className="text-amber-400 text-base leading-none mt-0.5">⚡</span>
              <p className="text-[10px] text-amber-200 font-medium leading-relaxed">
                <span className="font-black text-amber-300">For Demo:</span> Use the preset buttons above — they show 100% accurate data with verified compliance scores. Custom photo OCR results may vary.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FileImage className="w-3.5 h-3.5" />
                Upload Image
              </button>

              <button
                type="button"
                onClick={() => onOpenLiveCamera ? onOpenLiveCamera() : cameraInputRef.current?.click()}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                Snap Photo
              </button>

              <button
                type="button"
                onClick={() => onSelectPreset('demo-potato-chips')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Load Preset
              </button>
            </div>

            <p className="text-[10px] text-slate-400 mt-3">
              Supported Formats: <span className="font-bold text-slate-300">JPG, PNG, WEBP, SVG</span> (Max 15MB)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
              onChange={handleFileInput}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
              onChange={handleFileInput}
            />
          </div>
        ) : (
          /* ACTIVE IMAGE PREVIEW & BOUNDING BOX VIEWER */
          <div className="w-full flex flex-col items-center">
            {/* Dedicated Top Controls Bar - Never overlaps the image */}
            {inspectionResult && !isAnalyzing && isPreset && (
              <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 mb-3 bg-slate-900 rounded-xl border border-slate-800 shadow-md">
                {/* Left: Filter Buttons */}
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1 rounded-lg font-extrabold transition-colors cursor-pointer ${
                      filterMode === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    All ({inspectionResult.boundingBoxes.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('violations')}
                    className={`px-2.5 py-1 rounded-lg font-extrabold transition-colors cursor-pointer ${
                      filterMode === 'violations' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Violations Only
                  </button>
                  <button
                    onClick={() => setShowLabels(!showLabels)}
                    className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {showLabels ? <Eye className="w-3 h-3 text-blue-400" /> : <EyeOff className="w-3 h-3" />}
                    Labels
                  </button>
                </div>

                {/* Right: Zoom Controls */}
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Image Container with precise aspect ratio for 1:1 box overlay */}
            <div className="relative w-full max-w-[340px] aspect-[3/4] mx-auto rounded-2xl bg-slate-900 border border-slate-700/90 overflow-hidden shadow-2xl flex items-center justify-center group">
              {/* Laser Scanning Animation Overlay during processing */}
              {isAnalyzing && (
                <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl">
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-scan-laser" />
                  <div className="absolute inset-0 bg-blue-950/50 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Product Image & Overlays matching dimensions */}
              <div 
                className="relative w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={currentImage}
                  alt={fileName || 'Product Preview'}
                  className="w-full h-full object-contain rounded-xl select-none"
                />

                {/* OCR Bounding Boxes - ONLY rendered for curated presets or when genuine tokens exist */}
                {inspectionResult && !isAnalyzing && isPreset && (
                  <OCRBoundingBoxes
                    boundingBoxes={inspectionResult.boundingBoxes}
                    selectedKey={selectedKey}
                    onSelectKey={onSelectKey}
                    filterMode={filterMode}
                    showLabels={showLabels}
                  />
                )}
              </div>
            </div>

            {/* Custom Photo Notice */}
            {inspectionResult && !isAnalyzing && !isPreset && (
              <div className="w-full max-w-[340px] mt-2.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-center text-[11px] text-cyan-300 font-bold shadow-md">
                📷 Custom Photo Scan Active • Analyzed under {selectedCategory} Standards
              </div>
            )}

            {/* INSPECTOR LIVE VERIFICATION & VALUE ADJUSTMENT DRAWER */}
            {inspectionResult && !isAnalyzing && (
              <div className="w-full mt-3.5 p-3 sm:p-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 text-white shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      Scanned Declarations (Verify / Correct)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditDrawer(!showEditDrawer)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                  >
                    {showEditDrawer ? 'Hide Form' : 'Adjust Values ✏️'}
                  </button>
                </div>

                {showEditDrawer && (
                  <form onSubmit={handleApplyCustomValues} className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* MRP Input */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-0.5">
                          Declared MRP (₹):
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editMRP}
                          onChange={(e) => setEditMRP(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-800 text-white font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                          placeholder="e.g. 50.00"
                        />
                      </div>

                      {/* Net Quantity Input + Unit */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-0.5">
                          Net Quantity &amp; Unit:
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            step="any"
                            value={editQty}
                            onChange={(e) => setEditQty(parseFloat(e.target.value) || 0)}
                            className="w-3/5 bg-slate-800 text-white font-mono font-bold text-xs px-2 py-1.5 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                            placeholder="250"
                          />
                          <select
                            value={editUnit}
                            onChange={(e) => setEditUnit(e.target.value)}
                            className="w-2/5 bg-slate-800 text-white font-bold text-[11px] px-1 py-1.5 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer"
                          >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="l">L</option>
                            <option value="Unit">Unit</option>
                            <option value="Pages">Pages</option>
                            <option value="pcs">pcs</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Printed USP */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-0.5">
                          Printed USP (Optional):
                        </label>
                        <input
                          type="text"
                          value={editUSP}
                          onChange={(e) => setEditUSP(e.target.value)}
                          className="w-full bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none font-mono"
                          placeholder="e.g. ₹ 0.25 / g"
                        />
                      </div>

                      {/* Product Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-0.5">
                          Product Name:
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                          placeholder="Product Name"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Apply Values &amp; Recalculate Compliance ⚡</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* PROCESSING PROGRESS BAR */}
            {isAnalyzing && activeStage && (
              <div className="w-full mt-4 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-extrabold text-white tracking-tight">{activeStage.label}</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-black text-sm">{activeStage.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-xs"
                    style={{ width: `${activeStage.progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-300 font-medium">{activeStage.detail}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls with Direct Live Snap Button */}
      {currentImage && (
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onResetImage}
              disabled={isAnalyzing}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Change Image
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isAnalyzing}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Snap</span>
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          <div className="flex items-center gap-2">
            {!inspectionResult ? (
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <SearchCheck className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Analyze Product</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Re-Analyze
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



