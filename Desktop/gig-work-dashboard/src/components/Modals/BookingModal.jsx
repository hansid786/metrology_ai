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
  Info,
  Camera,
  AlertCircle,
  Navigation,
  Lock,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiCreateBooking } from '../../services/api';
import { calculateServiceFeeBreakdown } from '../../services/paymentGateway';
import { sendCustomerBookingWhatsApp } from '../../services/whatsappService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function BookingModal({ 
  worker, 
  preselectedService, 
  onClose, 
  onBookingSuccess 
}) {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  
  const [selectedService, setSelectedService] = useState(preselectedService || null);
  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledSlot, setScheduledSlot] = useState('2:00 PM – 3:30 PM');
  const [addressText, setAddressText] = useState(
    currentUser?.savedAddresses?.[0]?.addressLine1 
      ? `${currentUser.savedAddresses[0].addressLine1}, ${currentUser.savedAddresses[0].locality}, ${currentUser.savedAddresses[0].city}`
      : 'Flat 304, Green Heights, Gomti Nagar, Lucknow'
  );
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Hanzala');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+91 98450 77123');
  const [problemDesc, setProblemDesc] = useState('');
  const [paymentPreference, setPaymentPreference] = useState('pay_on_completion'); // 'pay_on_completion' | 'pay_now'
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basePrice = selectedService ? selectedService.basePrice : worker.baseRate;
  const feeBreakdown = calculateServiceFeeBreakdown(basePrice);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddressText(`Current GPS: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Gomti Nagar Hub, Lucknow)`);
        setIsLocating(false);
        showToast('📍 Exact GPS coordinates detected and attached to dispatch!');
      },
      (error) => {
        setIsLocating(false);
        setAddressText('Flat 304, Green Heights, Gomti Nagar, Lucknow - 226010');
        showToast('Location defaulted to Gomti Nagar, Lucknow.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiCreateBooking({
        customerId: currentUser?.id || 'u-cust-1',
        customerName,
        customerPhone,
        workerId: worker.id,
        workerUserId: worker.userId,
        workerName: worker.name,
        workerPhone: worker.phone,
        workerTrade: worker.trade,
        serviceTitle: selectedService ? selectedService.name : `${worker.trade} Inspection & Diagnostic Visit`,
        servicePrice: basePrice,
        scheduledDate,
        scheduledSlot,
        addressText,
        problemDescription: problemDesc,
        paymentMode: paymentPreference === 'pay_now' ? 'Razorpay Instant Online Escrow' : 'Direct UPI upon Completion'
      });

      if (res.success) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (err) {}

        showToast(`⚡ Order #${res.booking.bookingRef} dispatched to ${worker.name}!`);
        
        try {
          sendCustomerBookingWhatsApp(res.booking);
        } catch (e) {}

        onBookingSuccess(res.booking);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-[2rem] max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">{worker.name}</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Verified Pro
                </span>
              </div>
              <p className="text-xs text-emerald-200">{worker.trade} • {worker.distanceKm || '1.4 km away'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Selected Service Title */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider block">Selected Service</span>
              <span className="font-extrabold text-slate-900 text-xs">
                {selectedService ? selectedService.name : `${worker.trade} Diagnostic & Doorstep Service`}
              </span>
            </div>
            <span className="font-mono font-black text-emerald-800 text-base">₹{basePrice}</span>
          </div>

          {/* Date Picker */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">1. Select Preferred Date</label>
            <div className="grid grid-cols-3 gap-2">
              {['Today', 'Tomorrow', 'This Weekend'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setScheduledDate(d)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    scheduledDate === d
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">2. Select Arrival Slot</label>
            <div className="grid grid-cols-2 gap-2">
              {['9:00 AM – 11:00 AM', '11:30 AM – 1:30 PM', '2:00 PM – 3:30 PM', '4:30 PM – 6:30 PM'].map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setScheduledSlot(slot)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    scheduledSlot === slot
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-black shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 block">3. Service Location & Contact</label>
              
              <button
                type="button"
                onClick={handleDetectGPS}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting GPS...' : 'Use Live GPS'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 text-[11px] block mb-1 font-semibold">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 text-[11px] block mb-1 font-semibold">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 text-[11px] block mb-1 font-semibold">Door / Flat / Street Address</label>
              <input
                type="text"
                required
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="text-slate-600 text-[11px] block mb-1 font-semibold">Problem Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="E.g., AC not blowing cold air, outdoor fan makes clicking sound."
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>
          </div>

          {/* Payment Choice */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 block">4. Payment Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentPreference('pay_on_completion')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  paymentPreference === 'pay_on_completion'
                    ? 'border-emerald-600 bg-emerald-50 text-slate-900 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-xs font-black block">Pay on Completion</span>
                    <span className="text-[10px] text-slate-500">Direct UPI / Cash to Pro</span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentPreference('pay_now')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  paymentPreference === 'pay_now'
                    ? 'border-emerald-600 bg-emerald-50 text-slate-900 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-xs font-black block">Prepay to Escrow</span>
                    <span className="text-[10px] text-slate-500">Razorpay / Card</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center text-slate-700">
              <span>Direct Labor & Inspection:</span>
              <span className="font-mono font-bold text-slate-900">₹{feeBreakdown.laborPrice}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Technician Safety Fund (Co-op):</span>
              <span className="font-mono text-slate-700">₹{feeBreakdown.workerWelfareFund}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Platform Cloud Dispatch Fee:</span>
              <span className="font-mono text-slate-700">₹{feeBreakdown.platformTechFee}</span>
            </div>
            
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
              <span className="text-slate-900 text-xs">Total Amount:</span>
              <span className="text-base font-black text-emerald-800 font-mono">₹{feeBreakdown.totalCustomerPays}</span>
            </div>
            <p className="text-[10px] text-emerald-800 pt-0.5">
              💡 {feeBreakdown.workerPayoutPercentage}% goes directly to {worker.name}. No hidden surge fees.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer text-xs"
            >
              {isSubmitting ? (
                <span>Dispatching Professional...</span>
              ) : (
                <>
                  <span>Confirm & Dispatch Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
