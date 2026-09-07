import React, { useState } from 'react';
import {
  QrCode,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { processBookingPayment } from '../../services/hommieState';

export default function HommiePaymentModal({ isOpen, onClose, booking, onPaymentSuccess }) {
  const [method, setMethod] = useState('upi'); // upi, card, cash
  const [selectedUpiApp, setSelectedUpiApp] = useState('phonepe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen || !booking) return null;

  const finalAmount = booking.pricingSummary?.finalAmount || booking.servicePrice + 30;
  const upiId = 'hommie.pay@okhdfcbank';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=HOMMIE&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(booking.bookingRef)}`;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      processBookingPayment(booking.id, {
        method,
        upiApp: method === 'upi' ? selectedUpiApp : null
      });

      setIsProcessing(false);
      setPaymentDone(true);

      setTimeout(() => {
        onPaymentSuccess?.();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Settlement</span>
            <h3 className="font-extrabold text-slate-900 text-base">Pay for {booking.serviceTitle}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentDone ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950">Payment Successful!</h3>
            <p className="text-xs text-slate-500">
              ₹{finalAmount} settled directly. 30-day rework warranty is now activated.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {/* Amount Pill */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-900 font-semibold block">Total Amount Due</span>
                <span className="text-2xl font-extrabold text-amber-950">₹{finalAmount}</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                {booking.bookingRef}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition ${
                    method === 'upi'
                      ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span className="text-xs block">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition ${
                    method === 'card'
                      ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-slate-800" />
                  <span className="text-xs block">Card / NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('cash')}
                  className={`p-3 rounded-2xl border text-center transition ${
                    method === 'cash'
                      ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Banknote className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs block">Cash to Pro</span>
                </button>
              </div>
            </div>

            {/* UPI QR Display */}
            {method === 'upi' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-36 h-36 mx-auto rounded-xl border border-slate-300 shadow-xs"
                />
                <p className="text-[11px] text-slate-500">
                  Scan using <strong>GPay, PhonePe, Paytm</strong> or any UPI App
                </p>
                <div className="flex justify-center gap-2 text-xs">
                  {['PhonePe', 'Google Pay', 'Paytm'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.toLowerCase())}
                      className={`px-3 py-1 rounded-lg border text-[11px] font-semibold ${
                        selectedUpiApp === app.toLowerCase()
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Card Simulation */}
            {method === 'card' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  placeholder="Card Number (4111 2222 3333 4444)"
                  defaultValue="4532 •••• •••• 8920"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    defaultValue="08 / 29"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="821"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Cash Simulation */}
            {method === 'cash' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <p>
                  Hand over exactly <strong>₹{finalAmount}</strong> to {booking.workerName}. The professional will tap "Payment Received" on their phone to verify completion.
                </p>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-500 transition shadow-md flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Confirming Transaction...' : `Authorize ₹${finalAmount} Payment`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}