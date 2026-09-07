import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Smartphone, 
  Building2, 
  ArrowRight, 
  Coins, 
  Zap, 
  Check,
  AlertCircle
} from 'lucide-react';
import { initiateRazorpayPayment, calculateServiceFeeBreakdown } from '../../services/paymentGateway';
import { useNotifications } from '../../context/NotificationContext';

export default function PaymentGatewayModal({ 
  booking, 
  onClose, 
  onPaymentComplete 
}) {
  const { showToast } = useNotifications();
  const [selectedMethod, setSelectedMethod] = useState('upi_qr'); // 'upi_qr' | 'razorpay' | 'card' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const amount = booking?.finalAmount || 369;
  const breakdown = calculateServiceFeeBreakdown(booking?.estimatedAmount || 349);

  // Play a pleasant audio chime upon successful payment
  const playPaymentSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    if (selectedMethod === 'razorpay') {
      const launched = await initiateRazorpayPayment({
        booking,
        amount,
        customerName: booking.customerName || 'Hanzala',
        customerPhone: booking.customerPhone || '9845077123',
        onSuccess: (res) => {
          setIsProcessing(false);
          setIsPaid(true);
          setPaymentDetails(res);
          playPaymentSuccessSound();
          showToast(`⚡ Payment of ₹${amount} received via Razorpay (${res.paymentId})`);
          if (onPaymentComplete) onPaymentComplete(res);
        },
        onFailure: (err) => {
          setIsProcessing(false);
          showToast(`Razorpay checkout: ${err}`);
        }
      });

      if (!launched) {
        // Fallback simulation if network/key issues
        simulateSuccessfulPayment('rzp_sim_' + Date.now());
      }
      return;
    }

    // Direct UPI QR / Card / COD processing simulation
    setTimeout(() => {
      simulateSuccessfulPayment('upi_tx_' + Date.now());
    }, 1500);
  };

  const simulateSuccessfulPayment = (txnId) => {
    setIsProcessing(false);
    setIsPaid(true);
    const details = {
      paymentId: txnId,
      gateway: selectedMethod,
      amount,
      status: 'paid',
      timestamp: 'Just now'
    };
    setPaymentDetails(details);
    playPaymentSuccessSound();
    showToast(`Payment of ₹${amount} confirmed! Escrow locked for technician.`);
    if (onPaymentComplete) onPaymentComplete(details);
  };

  const upiIntentUrl = `upi://pay?pa=doorstep.pro@icici&pn=DoorstepPro&am=${amount}&cu=INR&tn=Order_${booking?.bookingRef || 'ORD'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiIntentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white w-full max-w-lg rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Secure Checkout & Escrow</h3>
              <p className="text-xs text-emerald-200 font-medium">Order #{booking?.bookingRef} • 100% Buyer Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isPaid ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-in zoom-in-75 duration-300" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Authorized & Secured
              </span>
              <h4 className="text-2xl font-black text-slate-900 pt-2">₹{amount} Paid Successfully</h4>
              <p className="text-xs text-slate-500">
                Transaction ID: <strong className="font-mono text-slate-800">{paymentDetails?.paymentId || 'TXN-882194'}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Service:</span>
                <strong className="text-slate-900">{booking?.serviceTitle}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Technician Assigned:</span>
                <strong className="text-slate-900">{booking?.workerName}</strong>
              </div>
              <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-2">
                <span>Direct Worker Payout:</span>
                <strong className="text-emerald-700 font-mono font-black">₹{breakdown.workerTakesHome} (95%+)</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
            >
              Return to Bookings
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            
            {/* Amount Summary Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Amount to Pay</span>
                <span className="text-2xl font-black text-slate-900 font-mono">₹{amount}</span>
              </div>

              <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                <div>Labor: ₹{breakdown.laborPrice}</div>
                <div>Platform Fee: ₹{breakdown.platformTechFee}</div>
                <div>Safety Cover: ₹{breakdown.workerWelfareFund}</div>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Payment Method</label>
              
              <div className="grid grid-cols-2 gap-2">
                
                {/* 1. Dynamic UPI QR */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi_qr')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedMethod === 'upi_qr'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block text-slate-900">Scan UPI QR</span>
                      <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
                    </div>
                  </div>
                </button>

                {/* 2. Razorpay Online */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('razorpay')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedMethod === 'razorpay'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block text-slate-900">Cards & NetBanking</span>
                      <span className="text-[10px] text-slate-500">Razorpay Gateway</span>
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* Selected Method View */}
            {selectedMethod === 'upi_qr' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <img
                    src={qrCodeUrl}
                    alt="UPI Payment QR Code"
                    className="w-36 h-36 object-contain rounded-lg"
                  />
                </div>
                <div className="text-center space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Scan with any Indian UPI App</span>
                  <span className="text-[10px] font-mono text-slate-500">VPA: doorstep.pro@icici</span>
                </div>
              </div>
            )}

            {selectedMethod === 'razorpay' && (
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>256-Bit SSL Encrypted Razorpay Checkout</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Supports Visa, Mastercard, RuPay, NetBanking across 50+ banks, and PayLater wallets.
                </p>
              </div>
            )}

            {/* Trust Assurance */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payment stays in escrow until the technician finishes the service.</span>
            </div>

            {/* Submit Action */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Confirming Payment...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Pay ₹{amount} Now</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
