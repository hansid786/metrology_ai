import React, { useState } from 'react';
import { BoundingBox, PDPInfo } from '../../types/inspection';
import { CheckCircle2, AlertCircle, AlertTriangle, ShieldCheck, Ruler, LayoutGrid } from 'lucide-react';

interface OCRBoundingBoxesProps {
  boundingBoxes: BoundingBox[];
  selectedKey: string | null;
  onSelectKey: (key: string | null) => void;
  filterMode: 'all' | 'violations' | 'font_only' | 'none';
  showLabels: boolean;
  showPDPBoundary?: boolean;
  pdpInfo?: PDPInfo;
}

export const OCRBoundingBoxes: React.FC<OCRBoundingBoxesProps> = ({
  boundingBoxes,
  selectedKey,
  onSelectKey,
  filterMode,
  showLabels,
  showPDPBoundary = true,
  pdpInfo,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (filterMode === 'none') return null;

  const filteredBoxes = boundingBoxes.filter((box) => {
    if (filterMode === 'violations') {
      const isFontFail = box.fontCompliance && !box.fontCompliance.isCompliant;
      const isPdpFail = box.isInsidePDP === false;
      return box.status === 'FAIL' || box.status === 'WARNING' || isFontFail || isPdpFail;
    }
    if (filterMode === 'font_only') {
      return box.fontCompliance !== undefined;
    }
    return true;
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Principal Display Panel (PDP) Overlay Boundary */}
      {showPDPBoundary && pdpInfo && (
        <div
          className="absolute pointer-events-none border-2 border-dashed border-cyan-400/80 bg-cyan-500/5 z-10 transition-all"
          style={{
            left: `${pdpInfo.pdpBoundingBox.x}%`,
            top: `${pdpInfo.pdpBoundingBox.y}%`,
            width: `${pdpInfo.pdpBoundingBox.width}%`,
            height: `${pdpInfo.pdpBoundingBox.height}%`,
          }}
        >
          <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[8px] font-black uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
            <LayoutGrid className="w-2.5 h-2.5" />
            <span>PDP ({pdpInfo.pdpAreaPercentage}% Area)</span>
          </div>
        </div>
      )}

      {/* OCR Bounding Boxes with Font Size mm Measurement Overlay */}
      {filteredBoxes.map((box) => {
        const isSelected = selectedKey === box.declarationKey;
        const isHovered = hoveredId === box.id;

        const isFontFail = box.fontCompliance && !box.fontCompliance.isCompliant;
        const isPdpFail = box.isInsidePDP === false;

        let borderColor = 'border-emerald-400';
        let bgColor = 'bg-emerald-500/20';
        let badgeBg = 'bg-emerald-600 text-white';
        let glowColor = 'shadow-[0_0_12px_rgba(16,185,129,0.5)]';

        if (box.status === 'FAIL' || isFontFail || isPdpFail) {
          borderColor = 'border-rose-500';
          bgColor = 'bg-rose-600/25';
          badgeBg = 'bg-rose-600 text-white';
          glowColor = 'shadow-[0_0_15px_rgba(225,29,72,0.6)]';
        } else if (box.status === 'WARNING') {
          borderColor = 'border-amber-400';
          bgColor = 'bg-amber-500/20';
          badgeBg = 'bg-amber-600 text-white';
          glowColor = 'shadow-[0_0_12px_rgba(245,158,11,0.5)]';
        }

        if (isSelected) {
          bgColor = (box.status === 'FAIL' || isFontFail) ? 'bg-rose-600/35' : 'bg-blue-600/35';
          borderColor = (box.status === 'FAIL' || isFontFail) ? 'border-rose-400' : 'border-blue-400';
          glowColor = (box.status === 'FAIL' || isFontFail) ? 'shadow-[0_0_20px_rgba(244,63,94,0.8)]' : 'shadow-[0_0_20px_rgba(59,130,246,0.8)]';
        }

        return (
          <div
            key={box.id}
            onClick={() => onSelectKey(isSelected ? null : box.declarationKey)}
            onMouseEnter={() => setHoveredId(box.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 border-2 rounded-xs ${borderColor} ${bgColor} ${
              isSelected || isHovered ? `scale-[1.02] z-30 ring-2 ring-white ${glowColor}` : 'z-10 shadow-xs'
            }`}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          >
            {/* Box Header Label & mm Font Badge */}
            {showLabels && (
              <div
                className={`absolute -top-5.5 left-0 max-w-[200px] truncate px-1.5 py-0.5 rounded text-[9px] font-black tracking-tight whitespace-nowrap shadow-md flex items-center gap-1 z-20 ${badgeBg} ${
                  isSelected ? 'ring-2 ring-white scale-105 animate-pulse' : ''
                }`}
              >
                {box.status === 'PASS' && !isFontFail && <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />}
                {(box.status === 'FAIL' || isFontFail) && <AlertCircle className="w-2.5 h-2.5 shrink-0 text-amber-200" />}
                {box.status === 'WARNING' && <AlertTriangle className="w-2.5 h-2.5 shrink-0" />}
                <span className="truncate">{box.label}</span>
                {box.fontCompliance && (
                  <span className="font-mono text-[8px] bg-black/40 px-1 rounded font-extrabold text-amber-200">
                    {box.fontCompliance.measuredHeightMm}mm
                  </span>
                )}
              </div>
            )}

            {/* Hover Tooltip Diagnostic Popup */}
            {isHovered && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 w-64 p-3 bg-slate-950/95 backdrop-blur-md text-white text-xs rounded-xl shadow-2xl border border-slate-700 pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-b border-slate-800 pb-1">
                  <span className="text-white uppercase tracking-wider">{box.label}</span>
                  <span className="font-mono text-emerald-400">{box.confidence}% OCR conf.</span>
                </div>

                <div className="font-mono text-[10px] bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-cyan-200 font-semibold break-words">
                  "{box.extractedText}"
                </div>

                {/* Font Compliance Details */}
                {box.fontCompliance && (
                  <div className={`p-1.5 rounded text-[10px] flex items-center justify-between font-bold ${
                    box.fontCompliance.isCompliant ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      <span>Font Height: {box.fontCompliance.measuredHeightMm}mm</span>
                    </span>
                    <span>(Min: {box.fontCompliance.requiredMinHeightMm}mm {box.fontCompliance.isCompliant ? '✓ PASS' : '✗ FAIL'})</span>
                  </div>
                )}

                {/* PDP Placement */}
                <div className="text-[9px] text-slate-400 flex items-center justify-between">
                  <span>Placement: {box.isInsidePDP ? '✓ Inside PDP' : '⚠️ Outside PDP'}</span>
                  <span className="text-blue-300 font-medium">Click to inspect</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
