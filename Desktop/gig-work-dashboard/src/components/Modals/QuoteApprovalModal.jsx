import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, X, Receipt } from 'lucide-react';
import { respondToQuote } from '../../services/hommieState';

export default function QuoteApprovalModal({ isOpen, onClose, booking, onApproved, onRejected }) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !booking || !booking.quote) return null;

  const quote = booking.quote;

  const handleApprove = () => {
    respondToQuote(booking.id, true);
    onApproved?.();
  };

  const handleReject = () => {
    respondToQuote(booking.id, false, rejectReason || 'Quote price higher than expected');
    onRejected?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">On-Site Diagnostic Quote</h3>
              <p className="text-xs text-slate-500">Submitted by {booking.workerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diagnosis & Work Scope</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">{quote.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Spare Parts & Materials:</span>
                <span className="font-semibold text-slate-900">₹{quote.partsCost}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Labor & Service Work:</span>
                <span className="font-semibold text-slate-900">₹{quote.laborCost}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-950 text-sm">
                <span>Total Quote Amount:</span>
                <span className="text-amber-700">₹{quote.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Work will begin immediately upon your approval. All parts replaced come under the <strong>HOMMIE 30-Day Guarantee</strong>.
            </p>
          </div>

          {showRejectInput && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Reason for declining:</label>
              <input
                type="text"
                placeholder="e.g. Too high cost, will decide later..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div className="pt-3 flex items-center gap-3">
            {!showRejectInput ? (
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                className="flex-1 py-3 rounded-2xl border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-50 transition"
              >
                Decline Quote
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition"
              >
                Confirm Decline
              </button>
            )}

            <button
              type="button"
              onClick={handleApprove}
              className="flex-1 py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-amber-400 transition shadow-md flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Start Work</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}