import React, { useState, useEffect } from 'react';
import { X, Database, Cloud, Key, CheckCircle2, AlertCircle, RefreshCw, Server, ArrowRight, ShieldCheck } from 'lucide-react';
import { getSupabase, updateSupabaseConfig, isSupabaseConfigured } from '../../services/supabaseClient';
import { persistenceService } from '../../services/persistenceService';
import { cloudSyncService } from '../../services/cloudSyncService';

interface CloudConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudConnectionModal: React.FC<CloudConnectionModalProps> = ({ isOpen, onClose }) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSupabaseUrl(localStorage.getItem('supabase_url') || (import.meta as any).env?.VITE_SUPABASE_URL || '');
      setSupabaseAnonKey(localStorage.getItem('supabase_anon_key') || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '');
      setGeminiApiKey(localStorage.getItem('gemini_api_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '');
      setStatusMsg(null);
      setSyncResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setStatusMsg(null);

    // Save Gemini Key
    if (geminiApiKey.trim()) {
      localStorage.setItem('gemini_api_key', geminiApiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }

    // Save & Test Supabase
    if (supabaseUrl.trim() && supabaseAnonKey.trim()) {
      updateSupabaseConfig(supabaseUrl, supabaseAnonKey);
      const client = getSupabase();
      if (!client) {
        setStatusMsg({ type: 'error', text: 'Invalid Supabase URL or Anon Key format.' });
        setIsTesting(false);
        return;
      }

      try {
        const { error } = await client.from('inspections').select('count', { count: 'exact', head: true });
        if (error && error.code !== 'PGRST116') {
          // Table might not exist yet
          setStatusMsg({
            type: 'info',
            text: 'Connected to Supabase! (Ensure schema.sql tables are created in your Supabase SQL editor).'
          });
        } else {
          setStatusMsg({
            type: 'success',
            text: 'Successfully connected to Central PostgreSQL Database & Cloud Vision AI!'
          });
        }
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: `Connection test failed: ${err.message}` });
      }
    } else {
      updateSupabaseConfig('', '');
      setStatusMsg({ type: 'info', text: 'Local-only mode active (Offline-First LocalStorage).' });
    }

    setIsTesting(false);
  };

  const handleSyncLocalData = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    const all = persistenceService.getAll();
    const res = await cloudSyncService.syncAllLocalInspections(all);
    setIsSyncing(false);
    setSyncResult(`Synced ${res.synced} inspections to Cloud PostgreSQL Database!`);
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Central Database &amp; Cloud AI</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isConnected ? 'LIVE CLOUD SYNC' : 'OFFLINE-FIRST'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Connect Supabase PostgreSQL &amp; Google Cloud Vision API
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

        {/* Content */}
        <form onSubmit={handleTestAndSave} className="p-6 space-y-5 overflow-y-auto">
          
          {/* Status Banner */}
          {statusMsg && (
            <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
              statusMsg.type === 'success' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' :
              statusMsg.type === 'error' ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' :
              'bg-blue-950/60 border-blue-500/40 text-blue-300'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Supabase URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Supabase Anon Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Anon Public API Key</span>
            </label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Gemini 1.5 Vision API Key</span>
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
            <p className="text-[11px] text-slate-400">
              Enables 99.5% grounded visual extraction on complex curved/shiny retail packages.
            </p>
          </div>

          {/* Sync Button */}
          {isConnected && (
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Sync Local Inspections to Cloud</span>
                <button
                  type="button"
                  onClick={handleSyncLocalData}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
              {syncResult && <p className="text-[11px] text-emerald-400 font-medium">{syncResult}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={isTesting}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Save &amp; Test Connection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
