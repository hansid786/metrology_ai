import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { apiSubmitKYC } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function KYCVerificationModal({ worker, onClose, onVerificationSubmitted }) {
  const { updateUserSession } = useAuth();
  const { showToast } = useNotifications();
  
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idDocUrl, setIdDocUrl] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80');
  const [selfieUrl, setSelfieUrl] = useState(worker?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=250&auto=format&fit=crop&q=80');
  const [tradeCertUrl, setTradeCertUrl] = useState('https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiSubmitKYC({
        workerId: worker.id,
        workerName: worker.name,
        trade: worker.trade,
        idType,
        idDocUrl,
        selfieUrl,
        tradeCertUrl
      });

      if (res.success) {
        updateUserSession({ verificationStatus: 'pending' });
        showToast('Verification documents submitted! Under review by platform operators.');
        onVerificationSubmitted(res.verification);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Professional Trust & KYC Verification</h3>
              <p className="text-xs text-slate-500">Unlock the Verified Pro badge & customer trust score.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-2xl text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Why Verification Matters</span>
              <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                Verified workers receive 3.4x more customer bookings, zero fee deductions, and access to the ₹2,00,000 Suraksha Health Cover policy.
              </p>
            </div>
          </div>

          {/* Document Type */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">1. Select Government ID Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Aadhaar Card', 'Driving License', 'Voter ID'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setIdType(t)}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    idType === t
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ID Document Upload */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">2. Upload Front & Back of {idType}</label>
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/60 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <span className="font-semibold text-slate-800 block text-xs">Official Document Attached</span>
              <span className="text-[10px] text-slate-400">PDF, JPG or PNG (Max 5MB)</span>
            </div>
          </div>

          {/* Live Selfie Verification */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">3. Live Photo & Face Verification</label>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <img
                src={selfieUrl}
                alt="Selfie preview"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="text-left">
                <span className="font-bold text-slate-900 block text-xs">Live Face Capture Verified</span>
                <span className="text-[10px] text-emerald-800 font-semibold">Matched with Profile Avatar</span>
              </div>
            </div>
          </div>

          {/* Trade Certificate */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">4. Trade License / ITI / Skill Certificate (Optional)</label>
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700 font-medium text-xs truncate">Govt_ITI_Wireman_License_88219.pdf</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-slate-900 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-xs"
            >
              {isSubmitting ? <span>Submitting Documents...</span> : <span>Submit for Verification</span>}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
