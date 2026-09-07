import React from 'react';
import { 
  X, 
  Receipt, 
  CheckCircle2, 
  Building2, 
  Info 
} from 'lucide-react';

export default function InvoiceBreakdownModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Direct Settlement Receipt</span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Booking #{booking.id}</h3>
            <p className="text-xs text-slate-500">{booking.serviceTitle}</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
            <span>Customer:</span>
            <span className="font-semibold text-slate-900">{booking.customerName}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
            <span>Assigned Worker:</span>
            <span className="font-semibold text-slate-900">{booking.workerName} ({booking.trade})</span>
          </div>

          {/* Itemized Numbers */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Customer Invoiced Total:</span>
              <span className="font-mono font-bold text-slate-900">₹{booking.totalAmount}</span>
            </div>

            <div className="flex justify-between text-emerald-800 font-bold pt-1 border-t border-slate-200/60">
              <span>Worker Direct Payout (95%):</span>
              <span className="font-mono text-sm">₹{booking.workerPayout}</span>
            </div>

            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Platform Maintenance (5%):</span>
              <span className="font-mono">₹{booking.platformTechFee + booking.coopWelfareFee}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero middleman commission deducted from worker.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Close Receipt
          </button>

        </div>

      </div>
    </div>
  );
}
