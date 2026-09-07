import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Receipt, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Star,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function CustomerOrdersView({ orders, onViewInvoice, onBookNew }) {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">My Bookings & Dispatches</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking for local service requests.</p>
        </div>

        <button
          onClick={onBookNew}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span>Book New Service</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
          >
            {/* Top Bar: Order ID, Time & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-slate-900">{order.id}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{order.createdAt}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  order.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                  order.status === 'In Progress' ? 'bg-blue-50 text-blue-800 border border-blue-200 animate-pulse' :
                  'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  ● {order.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Total:</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Service & Worker Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Left Details */}
              <div className="md:col-span-7 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{order.serviceTitle}</h3>
                
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Slot: <strong>{order.scheduledSlot}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.address}</span>
                  </p>
                </div>

                {/* Worker Assigned Card */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 mt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                      {order.workerName ? order.workerName.charAt(0) : 'W'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{order.workerName}</h4>
                      <p className="text-[11px] text-emerald-800 font-medium">{order.workerTrade} • {order.distanceKm}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.workerPhone}`}
                    className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Call Worker</span>
                  </a>
                </div>
              </div>

              {/* Right: Live Stepper & Actions */}
              <div className="md:col-span-5 bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Live Dispatch Status
                </span>

                <div className="space-y-2 text-xs">
                  {order.steps?.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        step.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        {step.done ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>}
                      </div>
                      <span className={`flex-1 ${step.done ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{order.paymentMode}</span>
                  <button
                    onClick={() => onViewInvoice(order)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Bill</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
