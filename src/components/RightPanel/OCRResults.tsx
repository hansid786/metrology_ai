import React, { useState } from 'react';
import { InspectionResult } from '../../types/inspection';
import { ChevronDown, ChevronUp, Cpu, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface OCRResultsProps {
  inspection: InspectionResult;
  selectedKey: string | null;
  onSelectKey: (key: string | null) => void;
}

export const OCRResults: React.FC<OCRResultsProps> = ({
  inspection,
  selectedKey,
  onSelectKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">OCR &amp; Extraction Results</h3>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                {inspection.ocrMetadata.tokensDetected} Tokens
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Neural OCR token streams, confidence vectors &amp; bounding box telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            Avg Conf: {inspection.ocrMetadata.averageConfidence}%
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-100 space-y-4 animate-in fade-in">
          {/* Metadata Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">OCR Engine</span>
              <span className="font-semibold text-slate-800 text-[11px] truncate block">PaddleOCR Transformer</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Processing Latency</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">{inspection.ocrMetadata.processingTimeMs} ms</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tokens Parsed</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">{inspection.ocrMetadata.tokensDetected} tokens</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mean Confidence</span>
              <span className="font-mono font-bold text-emerald-700 text-[11px]">{inspection.ocrMetadata.averageConfidence}%</span>
            </div>
          </div>

          {/* Tokens Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {inspection.boundingBoxes.map((box) => {
                const isSelected = selectedKey === box.declarationKey;

                return (
                  <div
                    key={box.id}
                    onClick={() => onSelectKey(isSelected ? null : box.declarationKey)}
                    className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{box.label}</span>
                        <span className="text-[10px] font-mono text-slate-400">[{box.declarationKey}]</span>
                      </div>
                      <p className="font-mono text-slate-600 text-[11px] truncate" title={box.extractedText}>
                        "{box.extractedText}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-right">
                      <div className="hidden sm:block text-[10px] text-slate-400 font-mono">
                        X:{box.x}% Y:{box.y}% W:{box.width}% H:{box.height}%
                      </div>
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        {box.status === 'PASS' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span className={box.confidence >= 95 ? 'text-emerald-700' : 'text-slate-700'}>
                          {box.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
