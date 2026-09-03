import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Sparkles, Zap } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCalledRef = useRef(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFlash, setIsFlash] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);

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

  const startCamera = async () => {
    setError(null);
    setDetectedBarcode(null);
    captureCalledRef.current = false;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = (track as any).getCapabilities?.();
      if (capabilities && 'torch' in capabilities) setHasTorch(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings, then click Retry.'
          : 'Unable to connect to camera. Check no other app is using it, or upload a product image directly.'
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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      stopCamera();
      onCapture(dataUrl);
      onClose();
    }
  }, [onCapture, onClose]);

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
          setTimeout(() => { if (active) handleCapture(); }, 400);
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

  useEffect(() => {
    if (isOpen) { startCamera(); } else { stopCamera(); }
    return () => { stopCamera(); };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">Live Packaging Inspection Scanner</span>
          </div>
          <div className="flex items-center gap-2">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  torchOn
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Toggle Torch"
              >
                <Zap className="w-4 h-4" />
                <span>{torchOn ? 'Torch ON' : 'Torch'}</span>
              </button>
            )}
            <button
              onClick={() => { stopCamera(); onClose(); }}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative bg-black flex items-center justify-center overflow-hidden" style={{ aspectRatio: '4/3' }}>
          {error ? (
            <div className="p-6 text-center text-slate-300 max-w-md space-y-3">
              <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-white">{error}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-6 border border-emerald-500/30 rounded-2xl pointer-events-none flex flex-col justify-between p-4 overflow-hidden">
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" style={{ top: '45%' }} />
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 w-max">
                    <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                    <span>AI OPTICAL &amp; BARCODE SCANNER ACTIVE</span>
                  </div>
                  {detectedBarcode && (
                    <div className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 px-2.5 py-1 rounded-full border border-amber-500/50">
                      BARCODE: {detectedBarcode}
                    </div>
                  )}
                </div>
                <div className="text-center text-[11px] font-medium text-white/90 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700/60 w-max mx-auto">
                  {detectedBarcode ? 'Barcode locked! Auto-verifying...' : 'Align MRP label or Barcode in frame'}
                </div>
              </div>
              {isFlash && <div className="absolute inset-0 bg-white opacity-90 pointer-events-none" />}
            </>
          )}
        </div>

        <div className="p-4 bg-slate-950 flex items-center justify-between border-t border-slate-800">
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCapture}
            disabled={!stream}
            className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              stream
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-white animate-ping" />
            Capture &amp; Analyze
          </button>
          <div className="w-16" />
        </div>
      </div>
    </div>
  );
};