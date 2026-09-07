import React from 'react';
import { 
  X, 
  Receipt, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Wrench,
  HeartHandshake
} from 'lucide-react';
import { calculateServiceFeeBreakdown } from '../../services/paymentGateway';

export default function InvoiceModal({ booking, onClose }) {
  const breakdown = calculateServiceFeeBreakdown(booking.estimatedAmount || booking.finalAmount || 349);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Transparent Service Bill</h3>
              <p className="text-[11px] text-slate-400 font-mono">Invoice #{booking.bookingRef}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Service & Worker Details */}
          <div className="space-y-1.5 pb-3 border-b border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Service Rendered</span>
            <h4 className="font-extrabold text-slate-900 text-sm">{booking.serviceTitle}</h4>
            <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1">
              <span>Professional: <strong>{booking.workerName} ({booking.workerTrade})</strong></span>
              <span className="text-emerald-800 font-semibold font-mono">Direct Payout</span>
            </div>
          </div>

          {/* Time & Location */}
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100 text-[11px] text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Date & Slot</span>
              <span className="font-medium text-slate-800">{booking.scheduledDate}, {booking.scheduledSlot}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Method</span>
              <span className="font-medium text-slate-800">{booking.paymentMode}</span>
            </div>
          </div>

          {/* Itemized Transparent Breakdown */}
          <div className="space-y-2 py-2">
            <div className="flex justify-between items-center text-slate-700">
              <span>Direct Professional Labor Fee:</span>
              <span className="font-mono font-bold text-slate-900">₹{breakdown.laborPrice}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Cooperative Safety & Insurance Pool (3%):</span>
              <span className="font-mono text-slate-700">₹{breakdown.workerWelfareFund}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Cloud Server & Real-Time Dispatch Fee:</span>
              <span className="font-mono text-slate-700">₹{breakdown.platformTechFee}</span>
            </div>

            <div className="pt-2 border-t-2 border-dashed border-slate-200 flex justify-between items-baseline font-bold">
              <span className="text-slate-900 text-sm">Total Paid:</span>
              <span className="text-lg font-black text-emerald-800 font-mono">₹{breakdown.totalCustomerPays}</span>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-[11px] text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>{breakdown.workerPayoutPercentage}% of this payment</strong> went directly to {booking.workerName}'s bank account.
            </span>
          </div>

          {/* Close Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
