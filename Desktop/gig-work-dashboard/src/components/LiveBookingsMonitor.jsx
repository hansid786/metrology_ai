import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Receipt, 
  CheckCircle2, 
  PlayCircle, 
  Search, 
  PlusCircle
} from 'lucide-react';

export default function LiveBookingsMonitor({ 
  bookings, 
  onViewInvoice, 
  onSimulateBooking 
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerLocality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Dispatches & Settlements</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time log of transparent neighborhood service dispatches.</p>
        </div>

        <button
          onClick={onSimulateBooking}
          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Dispatch</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, worker, or locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {['All', 'Completed', 'In Progress', 'Scheduled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Card List */}
      <div className="space-y-3">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-slate-900">{b.id}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{b.timestamp}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  b.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                  b.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {b.status}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{b.serviceTitle}</h4>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                <span>Customer: <strong className="text-slate-700 font-medium">{b.customerName}</strong></span>
                <span>•</span>
                <span>Worker: <strong className="text-slate-700 font-medium">{b.workerName} ({b.trade})</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Worker Payout</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-extrabold text-emerald-800 font-mono">₹{b.workerPayout}</span>
                  <span className="text-[10px] text-slate-400">/ ₹{b.totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => onViewInvoice(b)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Receipt</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
