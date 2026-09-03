import React from 'react';
import { Shield, Sparkles, Settings, RotateCcw, Activity } from 'lucide-react';
import { InspectorSettings } from '../types/inspection';

interface HeaderProps {
  settings: InspectorSettings;
  onOpenSettings: () => void;
  onReset: () => void;
  onLoadDemo: (presetId?: string) => void;
  isAnalyzing: boolean;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onReset,
  onLoadDemo,
  isAnalyzing,
  hasResult,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg">
      {/* India Tricolor Top Strip */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-amber-500" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-emerald-500" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                  MetrologyLens <span className="text-blue-400">AI</span>
                </span>
                <span className="hidden sm:inline text-[9px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Govt. of India
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 leading-none hidden sm:block">
                Ministry of Consumer Affairs • Legal Metrology Enforcement
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Live Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Live</span>
            </div>

            {/* Officer Info — desktop only */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-bold">{settings.inspectorName}</span>
            </div>

            {/* Try Demo */}
            {!hasResult && (
              <button
                onClick={() => onLoadDemo()}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span className="hidden sm:inline">Try Demo</span>
                <span className="sm:hidden">Demo</span>
              </button>
            )}

            {/* New Inspection */}
            {hasResult && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Inspection</span>
                <span className="sm:hidden">Reset</span>
              </button>
            )}

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
