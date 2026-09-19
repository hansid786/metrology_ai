import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera, X, RefreshCw, AlertCircle, Sparkles, Zap,
  SwitchCamera, Grid, Image, ShieldCheck, CheckCircle2, SlidersHorizontal
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const { lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCalledRef = useRef(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFlash, setIsFlash] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setTorchOn(false);
    setHasTorch(false);
    setDetectedBarcode(null);
    captureCalledRef.current = false;
  };

  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setError(null);
    setDetectedBarcode(null);
    captureCalledRef.current = false;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }

      // Check available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);

      // Stop previous stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const track = mediaStream.getVideoTracks()[0];
      const capabilities = (track as any).getCapabilities?.();
      if (capabilities && 'torch' in capabilities) {
        setHasTorch(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(
        err.name === 'NotAllowedError'
          ? (lang === 'hi'
              ? 'कैमरा अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में कैमरा की अनुमति दें।'
              : 'Camera permission denied. Please allow camera access in browser permissions.')
          : (lang === 'hi'
              ? 'कैमरा कनेक्ट नहीं हो सका। आप नीचे दिए गए गैलरी बटन से सीधे फोटो चुन सकते हैं।'
              : 'Unable to connect to camera. You can select a photo directly from your gallery.')
      );
    }
  };

  const handleCapture = useCallback(() => {
    if (!videoRef.current || captureCalledRef.current) return;
    captureCalledRef.current = true;
    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      stopCamera();
      onCapture(dataUrl);
      onClose();
    }
  }, [onCapture, onClose]);

  // Barcode detector hook
  useEffect(() => {
    if (!stream || !("BarcodeDetector" in window)) return;
    let active = true;
    const barcodeDetector = new (window as any).BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code', 'code_128', 'code_39']
    });

    const scanInterval = setInterval(async () => {
      if (!videoRef.current || !active || videoRef.current.readyState < 2) return;
      try {
        const barcodes = await barcodeDetector.detect(videoRef.current);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          setDetectedBarcode(barcodes[0].rawValue);
          setTimeout(() => { if (active) handleCapture(); }, 450);
        }
      } catch (e) { /* ignore */ }
    }, 300);

    return () => { active = false; clearInterval(scanInterval); };
  }, [stream, handleCapture]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      const next = !torchOn;
      await (track as any).applyConstraints?.({ advanced: [{ torch: next }] });
      setTorchOn(next);
    } catch (e) { console.warn('Torch not supported', e); }
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          stopCamera();
          onCapture(result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => { stopCamera(); };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] relative">

        {/* ── Professional AI HUD Header ── */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between border-b border-slate-800/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] font-black tracking-wider text-emerald-400 uppercase">
                  AI Optical Metrology Scanner
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {lang === 'hi' ? 'विधिक मापविज्ञान नियम 2011 अनुपालन स्कैनर' : 'Legal Metrology (PC) Rules, 2011 Compliance HUD'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Grid Toggle */}
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                showGrid
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle Alignment Grid"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* Switch Camera */}
            {hasMultipleCameras && (
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Switch Camera (Front/Rear)"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}

            {/* Torch toggle */}
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  torchOn
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Toggle Torch"
              >
                <Zap className="w-4 h-4" />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => { stopCamera(); onClose(); }}
              className="text-slate-400 hover:text-white p-2 bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 rounded-xl border border-slate-700 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Viewfinder Area with HUD Overlay ── */}
        <div className="relative bg-black flex items-center justify-center overflow-hidden min-h-[360px] sm:min-h-[440px]">
          {error ? (
            <div className="p-8 text-center text-slate-300 max-w-md space-y-4">
              <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {lang === 'hi' ? 'कैमरा उपलब्ध नहीं है' : 'Camera Unavailable'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => startCamera()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'पुनः प्रयास करें' : 'Retry Camera'}</span>
                </button>

                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/25"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'गैलरी से चुनें' : 'Pick from Gallery'}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover min-h-[360px] sm:min-h-[440px]"
              />

              {/* ── Precision Metrology HUD Overlay ── */}
              <div className="absolute inset-4 sm:inset-7 pointer-events-none flex flex-col justify-between overflow-hidden">

                {/* Top Status & Instructions Pill */}
                <div className="flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>{lang === 'hi' ? 'AI पैकेजिंग पहचान सक्रिय' : 'AI OPTICAL OCR & RETICLE ACTIVE'}</span>
                  </div>

                  {detectedBarcode ? (
                    <div className="text-[10px] font-mono font-black text-amber-300 bg-amber-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/60 animate-bounce">
                      BARCODE: {detectedBarcode}
                    </div>
                  ) : (
                    <div className="hidden sm:flex items-center text-[10px] font-mono text-cyan-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30">
                      1080P • 60FPS
                    </div>
                  )}
                </div>

                {/* Target Frame Reticle */}
                <div className="relative flex-1 my-3 flex items-center justify-center">
                  {/* Outer Bounding Box */}
                  <div className="absolute inset-0 border border-emerald-500/30 rounded-3xl">
                    {/* Glowing Precision Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-emerald-400 rounded-tl-2xl shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-emerald-400 rounded-tr-2xl shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-emerald-400 rounded-bl-2xl shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-emerald-400 rounded-br-2xl shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                    {/* Rule of Thirds Grid */}
                    {showGrid && (
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
                        <div className="border-r border-b border-emerald-400/50" />
                        <div className="border-r border-b border-emerald-400/50" />
                        <div className="border-b border-emerald-400/50" />
                        <div className="border-r border-b border-emerald-400/50" />
                        <div className="border-r border-b border-emerald-400/50" />
                        <div className="border-b border-emerald-400/50" />
                        <div className="border-r border-emerald-400/50" />
                        <div className="border-r border-emerald-400/50" />
                        <div className="" />
                      </div>
                    )}

                    {/* Center Crosshair Target */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border border-emerald-400/40 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
                      </div>
                    </div>

                    {/* Animated Sweeping Laser Line */}
                    <div
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-pulse"
                      style={{
                        top: '48%',
                        animation: 'pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    />

                    {/* Inspection Guide Markers */}
                    <div className="absolute top-3 left-4 text-[9px] font-mono uppercase tracking-wider text-emerald-400/80 bg-slate-950/70 px-2 py-0.5 rounded">
                      [ MANDATORY DECLARATION ZONE ]
                    </div>
                    <div className="absolute bottom-3 right-4 text-[9px] font-mono uppercase tracking-wider text-amber-400/80 bg-slate-950/70 px-2 py-0.5 rounded">
                      [ MRP • USP • EXPIRY • BARCODE ]
                    </div>
                  </div>
                </div>

                {/* Bottom Guidance Message */}
                <div className="text-center z-10">
                  <span className="inline-block text-[11px] font-semibold text-slate-100 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 shadow-lg">
                    {detectedBarcode
                      ? (lang === 'hi' ? 'बारकोड लॉक! स्वतः विश्लेषण किया जा रहा है...' : 'Barcode locked! Auto-verifying...')
                      : (lang === 'hi' ? 'पैकेज के MRP, वजन व बारकोड को फ्रेम के बीच में रखें' : 'Align MRP, Net Weight & Barcode inside the frame')}
                  </span>
                </div>
              </div>

              {/* Shutter Flash Effect */}
              {isFlash && <div className="absolute inset-0 bg-white opacity-95 pointer-events-none transition-opacity duration-150" />}
            </>
          )}
        </div>

        {/* ── Professional Control Deck ── */}
        <div className="p-4 sm:p-5 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-between gap-3">
          {/* Gallery Upload Fallback */}
          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleGalleryFile}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all btn-press shadow-xs"
            title="Upload from Device Gallery"
          >
            <Image className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'गैलरी' : 'Gallery'}</span>
          </button>

          {/* Large Shutter Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleCapture}
              disabled={!stream}
              className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-slate-800 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-xl ${
                stream
                  ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 shadow-emerald-500/35 ring-4 ring-emerald-400/20'
                  : 'bg-slate-800 opacity-50 cursor-not-allowed'
              }`}
              title="Capture Frame"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-white/80 bg-white/20 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs font-bold transition-colors cursor-pointer btn-press"
          >
            {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};