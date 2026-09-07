import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard,
  Sparkles,
  Phone,
  User,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingCheckoutModal({ 
  serviceItem, 
  selectedWorker, 
  workers, 
  onClose, 
  onConfirmBooking 
}) {
  const [step, setStep] = useState(1); // 1: Schedule & Address, 2: Review & Confirm
  
  // Form State
  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 77123');
  const [addressLine, setAddressLine] = useState('Flat 304, Green Heights, 5th Cross');
  const [locality, setLocality] = useState('Koramangala 4th Block, Bengaluru - 560034');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('2:00 PM – 3:30 PM');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const worker = selectedWorker || workers[0];
  const servicePrice = serviceItem ? serviceItem.price : worker.baseRate;
  const platformFee = 10;
  const welfareFee = 10;
  const workerPayout = servicePrice;
  const totalAmount = servicePrice + platformFee + welfareFee;

  const handleComplete = (e) => {
    e.preventDefault();

    const newOrder = {
      id: `ORD-${Math.floor(8900 + Math.random() * 1000)}`,
      customerName: customerName,
      customerPhone: customerPhone,
      serviceCategory: serviceItem ? serviceItem.title : `${worker.trade} Visit`,
      serviceTitle: serviceItem ? serviceItem.title : `${worker.trade} Inspection & Repair`,
      workerId: worker.id,
      workerName: worker.name,
      workerTrade: worker.trade,
      workerPhone: worker.phone,
      address: `${addressLine}, ${locality}`,
      scheduledSlot: `${selectedDate}, ${selectedSlot}`,
      distanceKm: worker.distanceKm || '1.2 km away',
      status: 'In Progress',
      totalAmount: totalAmount,
      workerPayout: workerPayout,
      platformFee: platformFee,
      welfareFundFee: welfareFee,
      paymentMode: 'Direct UPI upon Completion',
      createdAt: 'Just now',
      steps: [
        { title: 'Request Confirmed', time: 'Just now', done: true },
        { title: `Assigned to ${worker.name}`, time: 'Just now', done: true },
        { title: 'Worker on the Way', time: 'Estimated 20 mins', done: false },
        { title: 'Service in Progress', time: 'Pending', done: false },
        { title: 'Direct Settlement', time: 'Pending', done: false }
      ]
    };

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    onConfirmBooking(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Direct Fair Booking
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {serviceItem ? serviceItem.title : `${worker.trade} Service`}
            </h3>
            <p className="text-xs text-slate-500">Assigned Professional: <strong>{worker.name}</strong> ({worker.distanceKm || '1.2 km away'})</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleComplete} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Step 1: Slot Picker */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Select Preferred Date</label>
            <div className="grid grid-cols-3 gap-2">
              {['Today', 'Tomorrow', 'Day After'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedDate === d
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Select Arrival Time Slot</label>
            <div className="grid grid-cols-2 gap-2">
              {['9:00 AM – 11:00 AM', '11:30 AM – 1:30 PM', '2:00 PM – 3:30 PM', '4:00 PM – 6:00 PM'].map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer text-left ${
                    selectedSlot === slot
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-400 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3 h-3 inline mr-1 text-slate-400" />
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Address & Contact */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs">Service Address & Contact</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="font-medium text-slate-600 block mb-1">Mobile (for Worker Call)</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-600 block mb-1">House / Flat / Building</label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="font-medium text-slate-600 block mb-1">Locality / Area Pincode</label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Transparent Fair Price Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-slate-700">
              <span>Direct Labor & Inspection:</span>
              <span className="font-mono font-bold text-slate-900">₹{servicePrice}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Cooperative Worker Welfare Fund:</span>
              <span className="font-mono text-slate-700">₹{welfareFee}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Platform Cloud & Dispatch Fee:</span>
              <span className="font-mono text-slate-700">₹{platformFee}</span>
            </div>
            
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
              <span className="text-slate-900 text-xs">Total Payable to Worker:</span>
              <span className="text-base font-extrabold text-emerald-800 font-mono">₹{totalAmount}</span>
            </div>
            <p className="text-[10px] text-emerald-700 pt-0.5">
              💡 100% pay after service via UPI directly to worker's phone. No advance deduction.
            </p>
          </div>

          {/* Action Buttons */}
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
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-xs"
            >
              <span>Confirm & Dispatch Worker</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
