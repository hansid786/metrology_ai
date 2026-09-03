import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode, X, Download, Copy, Check, ExternalLink, ShieldCheck,
  Smartphone, Share2, Sparkles, Building2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PortalQrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortalQrCodeModal: React.FC<PortalQrCodeModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic portal URL
  const portalUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://metrologylens-ai.vercel.app';

  useEffect(() => {
    if (isOpen && portalUrl) {
      QRCode.toDataURL(
        portalUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a', // slate-900
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [isOpen, portalUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'MetrologyLens_AI_Portal_QRCode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Top Tricolor Strip */}
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-amber-500" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-emerald-500" />
        </div>

        {/* Modal Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>{lang === 'hi' ? 'पोर्टल QR कोड स्कैनर' : 'Portal QR Code Scanner'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <p className="text-[10px] text-blue-300 font-medium">
                SIH PS: 26034 • Dept. of Consumer Affairs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-center flex flex-col items-center">
          {/* Instructions text */}
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-800">
              {lang === 'hi'
                ? 'अपने फोन के कैमरा या Google Lens से स्कैन करें'
                : 'Scan with any Phone Camera or Google Lens'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'hi'
                ? 'यह QR कोड सीधे आपके स्मार्टफोन पर इस वेबसाइट को खोल देगा।'
                : 'Instantly opens the National Legal Metrology portal on your mobile device.'}
            </p>
          </div>

          {/* QR Code Container with Frame */}
          <div className="p-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 shadow-inner flex flex-col items-center justify-center relative group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="MetrologyLens AI QR Code"
                className="w-56 h-56 rounded-2xl shadow-sm bg-white p-2"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}

            {/* Floating Live Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
              <Smartphone className="w-3 h-3 text-emerald-600" />
              <span>{lang === 'hi' ? 'लाइव मोबाइल एक्सेस' : 'Live Mobile Web App'}</span>
            </div>
          </div>

          {/* Current URL Pill */}
          <div className="w-full p-2.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[11px] text-slate-700 truncate text-left pl-1">
              {portalUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className={`p-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white font-bold text-[10px] px-2.5'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied && <span>{lang === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex gap-3">
            {/* Download QR Poster */}
            <button
              onClick={handleDownloadQR}
              className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-98"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? 'QR पोस्टर डाउनलोड करें' : 'Download QR Image'}</span>
            </button>

            {/* Direct Open Button */}
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{lang === 'hi' ? 'खोलें' : 'Open'}</span>
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          Legal Metrology (Packaged Commodities) Rules, 2011 • SIH 2026 Prototype
        </div>
      </div>
    </div>
  );
};
