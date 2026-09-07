import React, { useState } from 'react';
import { X, ShieldAlert, Flag, CheckCircle2, UserX, AlertOctagon } from 'lucide-react';
import { apiCreateReport } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

export default function ReportSafetyModal({ targetUser, reporterUser, onClose }) {
  const { showToast } = useNotifications();
  const [reason, setReason] = useState('Harassment / Inappropriate Behavior');
  const [details, setDetails] = useState('');
  const [blockUser, setBlockUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    'Harassment / Inappropriate Behavior',
    'Fraud / Fake Profile / Identity Misrepresentation',
    'Unsafe Physical Conduct on Premises',
    'Off-Platform Payment Extortion',
    'Spam / Unsolicited Advertising',
    'Other Safety Concern'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      alert('Please describe the safety incident.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiCreateReport({
        reporterId: reporterUser?.id || 'u-reporter',
        reporterName: reporterUser?.name || 'Concerned Member',
        targetUserId: targetUser?.id || 'u-target',
        targetUserName: targetUser?.name || 'Reported Individual',
        targetRole: targetUser?.role || 'worker',
        reason,
        details: blockUser ? `${details} [User Block Requested]` : details
      });

      if (res.success) {
        setSubmitted(true);
        showToast('Confidential report submitted. Trust & Safety team notified.');
      }
    } catch (err) {
      alert('Failed to submit report: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Report & Safety Incident</h3>
              <p className="text-xs text-slate-500">Confidential • Handled by Safety & Grievance Officer</p>
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
            <h4 className="text-lg font-black text-slate-900">Incident Report Received</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Thank you for keeping our community safe. Our trust operations lead reviews all flagged accounts immediately.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={targetUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80'}
                alt="Target user"
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Reporting Profile</span>
                <span className="text-xs font-black text-slate-900">{targetUser?.name || 'Local Service Provider'}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Violation Category</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-amber-600"
              >
                {reportReasons.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Incident Details</label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe what occurred in detail..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-amber-600 resize-none"
                required
              />
            </div>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={blockUser}
                onChange={(e) => setBlockUser(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
              <span className="text-xs font-semibold text-slate-700">
                Also block this user from contacting me or viewing my bookings
              </span>
            </label>

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
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Incident Report'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
