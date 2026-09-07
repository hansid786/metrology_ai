import React, { useState } from 'react';
import { 
  X, 
  CalendarCheck, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NewBookingModal({ worker, workers, onClose, onCreateBookingSuccess }) {
  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerLocality, setCustomerLocality] = useState('Koramangala, Bengaluru');
  const [selectedWorkerId, setSelectedWorkerId] = useState(worker?.id || workers[0]?.id || 'w-101');
  const [serviceTitle, setServiceTitle] = useState(worker ? `${worker.trade} Inspection & Repair` : 'Electrical Switch & Wiring Fix');
  const [serviceAmount, setServiceAmount] = useState(worker?.baseRate || 350);

  const activeWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];
  const workerPayout = Math.round(serviceAmount * 0.95);
  const platformFee = serviceAmount - workerPayout;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      id: `BK-${Math.floor(8900 + Math.random() * 1000)}`,
      customerName: customerName,
      customerLocality: customerLocality,
      workerId: activeWorker.id,
      workerName: activeWorker.name,
      trade: activeWorker.trade,
      serviceTitle: serviceTitle,
      totalAmount: Number(serviceAmount),
      workerPayout: workerPayout,
      coopWelfareFee: Math.round(serviceAmount * 0.03),
      platformTechFee: Math.round(serviceAmount * 0.02),
      status: 'In Progress',
      paymentMethod: 'Direct UPI Settlement',
      timestamp: 'Just now',
      ratingGiven: null,
      feedback: null
    };

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {}

    onCreateBookingSuccess(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Direct Service Booking</h3>
            <p className="text-xs text-slate-500 mt-0.5">Direct connection with verified neighborhood worker.</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Professional</label>
            <select
              value={selectedWorkerId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedWorkerId(id);
                const w = workers.find(item => item.id === id);
                if (w) setServiceAmount(w.baseRate);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.trade} (₹{w.baseRate})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Your Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Service Fee (₹)</label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={serviceAmount}
                onChange={(e) => setServiceAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Address / Ward Location</label>
            <input
              type="text"
              required
              value={customerLocality}
              onChange={(e) => setCustomerLocality(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Service Description</label>
            <input
              type="text"
              required
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center text-[11px] text-slate-600">
            <span>Worker Receives (95%):</span>
            <span className="font-mono font-bold text-emerald-800 text-xs">₹{workerPayout}</span>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>Confirm Direct Booking</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
