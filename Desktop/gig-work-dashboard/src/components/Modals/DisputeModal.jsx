import React, { useState } from 'react';
import { X, AlertTriangle, FileText, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiCreateDispute } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

export default function DisputeModal({ booking, raisedByRole = 'customer', raisedByUser, onClose, onDisputeSubmitted }) {
  const { showToast } = useNotifications();
  const [reason, setReason] = useState('Unsatisfactory Service Quality');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasonsList = raisedByRole === 'customer' ? [
    'Unsatisfactory Service Quality',
    'Professional Did Not Arrive',
    'Overcharging / Pricing Discrepancy',
    'Damage to Property / Appliances',
    'Unprofessional Behavior',
    'Other Issue'
  ] : [
    'Customer Refused Payment',
    'Customer Abusive / Unsafe Environment',
    'Scope of Work Significantly Different than Booked',
    'Customer Not Available at Address',
    'Other Issue'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide details explaining the dispute issue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiCreateDispute({
        bookingId: booking.id,
        raisedById: raisedByUser?.id || 'u-1',
        raisedByName: raisedByUser?.name || (raisedByRole === 'customer' ? booking.customerName : booking.workerName),
        raisedByRole,
        reason,
        description,
        evidenceUrls: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80']
      });

      if (res.success) {
        setSubmitted(true);
        showToast('Dispute ticket raised. Our safety & operations team will review within 2 hours.');
        if (onDisputeSubmitted) onDisputeSubmitted(res.dispute);
      }
    } catch (err) {
      alert('Failed to submit dispute: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Raise a Dispute</h3>
              <p className="text-xs text-slate-500">Order #{booking?.bookingRef || 'ORD'} • Mediated by Platform Trust Team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Dispute Claim Registered</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your dispute has been logged under ID <strong className="font-mono text-slate-900">DISP-{Date.now().toString().slice(-4)}</strong>. 
              The booking funds are held securely in escrow pending resolution.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Dispute</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
              >
                {reasonsList.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Description & What Happened</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain clearly what went wrong and what resolution you are requesting..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600 resize-none"
                required
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Fair Resolution Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Both parties will have 24 hours to provide statements. The platform will issue partial/full refund or release funds based on evidence.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Registering Claim...' : 'Submit Official Dispute'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
