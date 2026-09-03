import React, { useState } from 'react';
import {
  Settings, User, Cpu, Sliders, Shield, RotateCcw,
  CheckCircle2, Save, AlertCircle, Database
} from 'lucide-react';
import { authService } from '../services/authService';
import { InspectorSettings } from '../types/inspection';
import { CloudConnectionModal } from '../components/Modals/CloudConnectionModal';

const SETTINGS_KEY = 'metrologylens_settings';

export const SettingsPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  const [settings, setSettings] = useState<InspectorSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {
        inspectorId: user?.inspectorId || 'LMO-DEL-2024-0042',
        inspectorName: user?.name || 'Officer Ravi Kumar',
        designation: user?.designation || 'Legal Metrology Officer (Grade II)',
        zone: user?.zone || 'NCT of Delhi, Zone-IV',
        ocrEngine: 'demo-local',
        mathTolerancePercent: 1.0,
        strictCountryOriginCheck: true,
      };
    } catch {
      return {
        inspectorId: 'LMO-DEL-2024-0042',
        inspectorName: 'Officer Ravi Kumar',
        designation: 'Legal Metrology Officer (Grade II)',
        zone: 'NCT of Delhi, Zone-IV',
        ocrEngine: 'demo-local',
        mathTolerancePercent: 1.0,
        strictCountryOriginCheck: true,
      };
    }
  });

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo inspections and restore initial sample datasets?')) {
      localStorage.removeItem('metrologylens_inspections');
      localStorage.removeItem('metrologylens_seeded');
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Inspector Settings &amp; Engine Calibration</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Configure statutory officer identity, OCR model parameters, and mathematical tolerance thresholds.
        </p>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Inspector parameters saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Officer Identity */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Statutory Officer Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Official Officer Name</label>
              <input
                type="text"
                value={settings.inspectorName}
                onChange={(e) => setSettings({ ...settings, inspectorName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Officer License / Badge ID</label>
              <input
                type="text"
                value={settings.inspectorId}
                onChange={(e) => setSettings({ ...settings, inspectorId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Designation &amp; Rank</label>
              <input
                type="text"
                value={settings.designation}
                onChange={(e) => setSettings({ ...settings, designation: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Jurisdiction / Zone</label>
              <input
                type="text"
                value={settings.zone}
                onChange={(e) => setSettings({ ...settings, zone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* OCR & Rule Calibration */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Neural OCR &amp; Math Audit Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">USP Math Discrepancy Tolerance (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={settings.mathTolerancePercent}
                onChange={(e) => setSettings({ ...settings, mathTolerancePercent: parseFloat(e.target.value) || 1.0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500">Permissible rounding error under Rule 6(1)(e) (Default: 1.0%)</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">OCR Inference Engine</label>
              <select
                value={settings.ocrEngine}
                onChange={(e) => setSettings({ ...settings, ocrEngine: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="demo-local">Neural OCR Pipeline (Browser WebAssembly)</option>
                <option value="paddle-cloud">Cloud Transformer OCR (Government Private Cloud)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Central Database & Cloud Vision AI Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Central Database &amp; Cloud AI Vision</h3>
                <p className="text-[11px] text-slate-300">Supabase PostgreSQL, Barcode Master Registry &amp; Google Cloud Vision API</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCloudModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-105"
            >
              Configure Cloud
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      <CloudConnectionModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />
    </div>
  );
};
