import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, X, Send } from 'lucide-react';
import { fileSafetyReport } from '../../services/hommieState';

export default function SafetyReportModal({ isOpen, onClose, target }) {
  const [category, setCategory] = useState('unprofessional_behavior');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    fileSafetyReport({
      bookingId: target?.bookingId,
      proId: target?.proId,
      category,
      description
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Trust & Safety Escalation</h3>
              <p className="text-xs text-slate-500">Confidential investigation by HOMMIE Ops</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Report Logged Under Priority</h3>
            <p className="text-xs text-slate-500">
              Our safety governance team will review the issue and contact both parties if required.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Issue Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
              >
                <option value="unprofessional_behavior">Unprofessional Behavior</option>
                <option value="quote_inflation">Overcharging / Off-platform Cash Demand</option>
                <option value="incomplete_work">Incomplete Work / Substandard Repair</option>
                <option value="safety_harassment">Safety / Harassment Concern</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Describe What Happened *</label>
              <textarea
                rows={4}
                required
                placeholder="Provide specific details so our team can review timestamps and chat history..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}