import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, ShieldAlert, Cpu, Activity, Eye, Play, CheckCircle2, XCircle, Clock, Zap, Layers } from 'lucide-react';
import { InspectionResult } from '../../types/inspection';
import { runPipelineQASuite, QASuiteReport } from '../../services/pipelineQA';

interface RawOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: InspectionResult;
}

export const RawOcrModal: React.FC<RawOcrModalProps> = ({ isOpen, onClose, result }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'rawText' | 'evidenceTree' | 'diagnostics' | 'trace' | 'qaSuite'>('rawText');
  const [qaReport, setQaReport] = useState<QASuiteReport | null>(null);
  const [isRunningQA, setIsRunningQA] = useState(false);

  if (!isOpen) return null;

  const trace = result.diagnosticTrace;

  const handleCopy = () => {
    const textToCopy = result.rawOcrText || 'No raw OCR text available.';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunQASuite = async () => {
    setIsRunningQA(true);
    try {
      const report = await runPipelineQASuite();
      setQaReport(report);
    } catch (err) {
      console.error('[MetrologyLens] QA Suite error:', err);
    } finally {
      setIsRunningQA(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Developer &amp; Optical Pipeline Inspector
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                  {result.ocrMetadata?.engine || 'Tesseract.js'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Live trace of image quality, raw OCR tokens, AI vision latency &amp; rejection reasons
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950/30 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('rawText')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'rawText'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Raw OCR Text ({result.rawOcrText ? result.rawOcrText.split('\n').length : 0} lines)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trace')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'trace'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Pipeline Trace &amp; Latency</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evidenceTree')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'evidenceTree'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Evidence Ledger ({result.declarations?.length || 0} fields)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diagnostics')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'diagnostics'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Image Diagnostics</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('qaSuite');
              if (!qaReport) handleRunQASuite();
            }}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'qaSuite'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Automated QA Suite (15 Tests)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'rawText' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Verbatim Text Output from Uploaded Image:
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Raw Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300/90 whitespace-pre-wrap border border-slate-800 max-h-96 overflow-y-auto leading-relaxed shadow-inner">
                {result.rawOcrText || 'No text detected on packaging surface.'}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Processing Time</div>
                  <div className="font-bold text-slate-200 mt-0.5">{result.ocrMetadata?.processingTimeMs || 0} ms</div>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Tokens Read</div>
                  <div className="font-bold text-slate-200 mt-0.5">{result.ocrMetadata?.tokensDetected || 0}</div>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Average Confidence</div>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    {Math.round(result.ocrMetadata?.averageConfidence || 0)}%
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Inspection ID</div>
                  <div className="font-bold text-slate-300 truncate mt-0.5">{result.inspectionId}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trace' && (
            <div className="space-y-4">
              {/* Latency Breakdown Bar */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Stage Latency Breakdown</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Total: {trace?.timings?.totalMs || result.ocrMetadata?.processingTimeMs || 0} ms
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">1. Quality Gate</div>
                    <div className="font-bold text-slate-200 mt-0.5">{trace?.timings?.qualityCheckMs || 15} ms</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">2. OCR Engine</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{trace?.timings?.ocrMs || 0} ms</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">3. AI Vision</div>
                    <div className="font-bold text-blue-400 mt-0.5">{trace?.timings?.aiMs || 0} ms</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">4. Field Extractor</div>
                    <div className="font-bold text-slate-200 mt-0.5">{trace?.timings?.extractionMs || 5} ms</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">5. Compliance</div>
                    <div className="font-bold text-slate-200 mt-0.5">{trace?.timings?.complianceMs || 5} ms</div>
                  </div>
                </div>
              </div>

              {/* Status Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Image Status */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-300 flex items-center justify-between">
                    <span>🖼️ Image Status</span>
                    <span className="text-emerald-400 font-mono">OK</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-400">
                    <div>Resolution: <span className="text-slate-200">{trace?.imageStatus?.resolution || 'N/A'}</span></div>
                    <div>Sharpness Score: <span className="text-slate-200">{trace?.imageStatus?.sharpness ?? 85}/100</span></div>
                    <div>File Size: <span className="text-slate-200">{Math.round((trace?.imageStatus?.sizeBytes || 0) / 1024)} KB</span></div>
                  </div>
                </div>

                {/* AI & OCR Status */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-300 flex items-center justify-between">
                    <span>⚡ Optical &amp; AI Engine Status</span>
                    <span className="text-emerald-400 font-mono">ACTIVE</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-400">
                    <div>Engine: <span className="text-slate-200">{trace?.ocrStatus?.engine || 'Tesseract.js'}</span></div>
                    <div>Lines Decoded: <span className="text-slate-200">{trace?.ocrStatus?.linesCount || 0}</span></div>
                    <div>AI Vision Called: <span className="text-slate-200">{trace?.aiStatus?.called ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>
              </div>

              {/* Rejected Candidates & Hallucination Prevention Log */}
              {trace?.validationStatus?.rejectedCandidates && trace.validationStatus.rejectedCandidates.length > 0 && (
                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Rejected Candidate Values (Anti-Hallucination &amp; Negative Lookaheads):</span>
                  </div>
                  <div className="space-y-1.5">
                    {trace.validationStatus.rejectedCandidates.map((rej, idx) => (
                      <div key={idx} className="p-2 bg-slate-950/80 rounded-lg text-[11px] font-mono text-slate-300 space-y-0.5 border border-amber-500/20">
                        <div className="text-amber-400 font-bold">Field: {rej.field}</div>
                        <div className="text-slate-400">Candidate Text: "{rej.candidateText}"</div>
                        <div className="text-rose-400">Rejection Reason: {rej.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'evidenceTree' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Evidence-Backed Field Ledger (Strict Visual Grounding):
              </span>

              <div className="space-y-2">
                {result.declarations?.map((decl) => (
                  <div
                    key={decl.id}
                    className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{decl.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          decl.status === 'PASS'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : decl.status === 'NOT_DETECTED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {decl.status} ({decl.confidence}%)
                      </span>
                    </div>

                    <div className="text-slate-300 font-medium">
                      Extracted Value: <span className="font-bold text-white font-mono">{decl.extractedValue}</span>
                    </div>

                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400 font-mono text-[11px] border border-slate-800/80">
                      🔎 Source Evidence: <span className="text-emerald-400">"{decl.evidence?.sourceText || decl.extractedValue}"</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Image Quality Metrics</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      result.imageQuality?.isAcceptable
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    Quality Score: {result.imageQuality?.qualityScore ?? 80}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Sharpness / Focus</div>
                    <div className="font-bold text-emerald-400">{result.imageQuality?.sharpness ?? 60}/100</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Brightness</div>
                    <div className="font-bold text-slate-200">{result.imageQuality?.brightness ?? 128} / 255</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Contrast StdDev</div>
                    <div className="font-bold text-slate-200">{result.imageQuality?.contrast ?? 50}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Dimensions</div>
                    <div className="font-bold text-slate-200">
                      {result.imageQuality?.width || 0} × {result.imageQuality?.height || 0} px
                    </div>
                  </div>
                </div>

                {result.imageQuality?.issues && result.imageQuality.issues.length > 0 && (
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Identified Image Clarity Limitations:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90 pl-1">
                      {result.imageQuality.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'qaSuite' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Pipeline Accuracy &amp; Hallucination-Resistance QA</h4>
                  <p className="text-xs text-slate-400">15 automated test cases validating negative lookaheads, zero-guesswork, and entity separation.</p>
                </div>
                <button
                  type="button"
                  onClick={handleRunQASuite}
                  disabled={isRunningQA}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunningQA ? 'Running...' : 'Re-Run QA Suite'}</span>
                </button>
              </div>

              {qaReport && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      Passed: <span className="text-emerald-400 font-bold">{qaReport.passedTests} / {qaReport.totalTests}</span> ({qaReport.successRatePercent}%)
                    </div>
                    <div className="text-slate-400">Duration: {qaReport.durationTotalMs} ms</div>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {qaReport.results.map(tc => (
                      <div
                        key={tc.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          tc.passed
                            ? 'bg-slate-950/60 border-emerald-500/30'
                            : 'bg-rose-950/30 border-rose-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {tc.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400" />
                            )}
                            <span className="font-bold text-white font-mono">{tc.id}: {tc.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{tc.category}</span>
                        </div>
                        <div className="text-slate-300 text-[11px]">{tc.details}</div>
                        <div className="text-[11px] font-mono text-slate-400 flex gap-3 pt-0.5">
                          <span>Expected: <span className="text-slate-200">{tc.expected}</span></span>
                          <span>Actual: <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>{tc.actual}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Zero-Guesswork Policy: Only visible text is extracted</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
