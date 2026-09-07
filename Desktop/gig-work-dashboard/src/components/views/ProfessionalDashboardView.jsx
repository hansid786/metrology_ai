import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  User,
  Star,
  FileText,
  Navigation,
  Check,
  X
} from 'lucide-react';
import {
  getBookings,
  getProfessionalById,
  toggleProAvailability,
  advanceBookingStatus,
  submitOnSiteQuote,
  subscribeHommieState
} from '../../services/hommieState';

export default function ProfessionalDashboardView({
  proId = 'pro-arjun',
  onOpenChatModal,
  onNavigate
}) {
  const [pro, setPro] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs'); // jobs, earnings, ratecard, profile
  const [isOnline, setIsOnline] = useState(true);

  // Quote Creation Form Modal
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedJobForQuote, setSelectedJobForQuote] = useState(null);
  const [quoteDescription, setQuoteDescription] = useState('');
  const [quotePartsCost, setQuotePartsCost] = useState(0);
  const [quoteLaborCost, setQuoteLaborCost] = useState(0);

  const refreshData = () => {
    const currentPro = getProfessionalById(proId);
    if (currentPro) {
      setPro(currentPro);
      setIsOnline(currentPro.isAvailable);
    }
    setBookings(getBookings({ workerId: proId }));
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeHommieState(refreshData);
    return unsub;
  }, [proId]);

  const handleToggleOnline = () => {
    const newState = !isOnline;
    setIsOnline(newState);
    toggleProAvailability(proId, newState);
  };

  const handleAdvanceStatus = (bookingId, nextStatus) => {
    advanceBookingStatus(bookingId, nextStatus, {
      actor: pro?.name || 'Professional'
    });
  };

  const handleOpenQuoteForm = (booking) => {
    setSelectedJobForQuote(booking);
    setQuoteDescription('AC Compressor Capacitor replacement & deep foam cleaning');
    setQuotePartsCost(850);
    setQuoteLaborCost(450);
    setShowQuoteModal(true);
  };

  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!selectedJobForQuote) return;

    submitOnSiteQuote(selectedJobForQuote.id, {
      description: quoteDescription,
      partsCost: Number(quotePartsCost),
      laborCost: Number(quoteLaborCost),
      items: [
        { description: quoteDescription, qty: 1, rate: Number(quotePartsCost) + Number(quoteLaborCost) }
      ]
    });

    setShowQuoteModal(false);
  };

  // Active HUD Job: The most urgent/in-progress booking
  const activeJob = bookings.find((b) =>
    ['pro_assigned', 'scheduled_confirmed', 'en_route', 'arrived', 'inspection_in_progress', 'quote_submitted', 'quote_approved', 'work_in_progress', 'payment_pending'].includes(b.status)
  );

  const completedJobs = bookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedJobs.reduce((sum, b) => sum + (b.pricingSummary?.finalAmount || b.servicePrice || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-16">
      {/* 1. Pro Header Bar & Availability Toggle */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={pro?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200'}
                  alt={pro?.name || 'Pro'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold">{pro?.name || 'Arjun Singh'}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    KYC Verified
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{pro?.trade || 'AC Service & Repair Specialist'}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {pro?.ratingAvg?.toFixed(1) || '4.9'} ({pro?.ratingCount || 148} reviews)
                  </span>
                  <span>•</span>
                  <span>{pro?.jobsCompleted || 312} Completed Jobs</span>
                </div>
              </div>
            </div>

            {/* Availability Switch */}
            <div className="flex items-center gap-3 bg-slate-800/90 p-3 rounded-2xl border border-slate-700 self-start md:self-auto">
              <div className="text-right">
                <span className="text-xs font-bold block">{isOnline ? 'You are ONLINE' : 'You are OFFLINE'}</span>
                <span className="text-[10px] text-slate-400">{isOnline ? 'Receiving urgent nearby leads' : 'Not visible in search'}</span>
              </div>
              <button
                onClick={handleToggleOnline}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                  isOnline ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    isOnline ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'jobs'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Job Dispatch & HUD
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'earnings'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Direct Payouts & Earnings
            </button>
            <button
              onClick={() => setActiveTab('ratecard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'ratecard'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              My Rate Card & Coverage
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* 2. ACTIVE JOB HUD */}
            {activeJob ? (
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-500/30">
                      <Zap className="w-3.5 h-3.5" />
                      <span>ACTIVE JOB HUD • {activeJob.bookingRef}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold">{activeJob.serviceTitle}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Customer: <strong>{activeJob.customerName}</strong> ({activeJob.customerPhone})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChatModal(activeJob)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>Chat</span>
                    </button>
                    <a
                      href={`tel:${activeJob.customerPhone}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Client</span>
                    </a>
                  </div>
                </div>

                {/* Status Stepper Progression */}
                <div className="py-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-3">
                    Advance Job Status:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Step 1: En Route */}
                    <button
                      disabled={['en_route', 'arrived', 'inspection_in_progress', 'quote_submitted', 'quote_approved', 'work_in_progress', 'payment_pending', 'completed'].includes(activeJob.status)}
                      onClick={() => handleAdvanceStatus(activeJob.id, 'en_route')}
                      className={`p-3 rounded-2xl text-left text-xs font-bold border transition ${
                        activeJob.status === 'en_route'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 ring-2 ring-amber-400'
                          : ['arrived', 'inspection_in_progress', 'quote_submitted', 'quote_approved', 'work_in_progress', 'payment_pending', 'completed'].includes(activeJob.status)
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>1. Start Driving</span>
                        {['arrived', 'inspection_in_progress', 'quote_submitted', 'quote_approved', 'work_in_progress', 'payment_pending', 'completed'].includes(activeJob.status) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block mt-1">Status: En Route</span>
                    </button>

                    {/* Step 2: Arrived */}
                    <button
                      disabled={['arrived', 'inspection_in_progress', 'quote_submitted', 'quote_approved', 'work_in_progress', 'payment_pending', 'completed'].includes(activeJob.status)}
                      onClick={() => handleAdvanceStatus(activeJob.id, 'arrived')}
                      className={`p-3 rounded-2xl text-left text-xs font-bold border transition ${
                        activeJob.status === 'arrived'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 ring-2 ring-amber-400'
                          : ['inspection_in_progress', 'quote_submitted', 'quote_approved', 'work_in_progress', 'payment_pending', 'completed'].includes(activeJob.status)
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>2. Mark Arrived</span>
                        {['inspection_in_progress', 'quote_submitted', 'quote_approved', 'work_in_progress', 'payment_pending', 'completed'].includes(activeJob.status) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block mt-1">Status: At Doorstep</span>
                    </button>

                    {/* Step 3: Diagnose / Quote */}
                    <button
                      onClick={() => handleOpenQuoteForm(activeJob)}
                      className={`p-3 rounded-2xl text-left text-xs font-bold border transition ${
                        activeJob.status === 'quote_submitted'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 ring-2 ring-amber-400'
                          : ['quote_approved', 'work_in_progress', 'payment_pending', 'completed'].includes(activeJob.status)
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>3. Send Quote</span>
                        {['quote_approved', 'work_in_progress', 'payment_pending', 'completed'].includes(activeJob.status) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block mt-1">
                        {activeJob.quote ? `Quote: ₹${activeJob.quote.totalAmount}` : 'Create on-site estimate'}
                      </span>
                    </button>

                    {/* Step 4: Finish Work */}
                    <button
                      onClick={() => handleAdvanceStatus(activeJob.id, 'payment_pending')}
                      className={`p-3 rounded-2xl text-left text-xs font-bold border transition ${
                        activeJob.status === 'payment_pending'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500 ring-2 ring-emerald-400'
                          : activeJob.status === 'completed'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>4. Complete Work</span>
                        {activeJob.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block mt-1">Request Payment</span>
                    </button>
                  </div>
                </div>

                {/* Location & Instructions */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold">{activeJob.address?.formattedAddress || 'Indiranagar 100ft Road, Bengaluru'}</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">Special note: "{activeJob.notes || 'Please call before ringing bell.'}"</p>
                    </div>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(activeJob.address?.formattedAddress || 'Indiranagar Bengaluru')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition inline-flex items-center gap-1.5 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">No active jobs right now</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You are {isOnline ? 'ONLINE and ready to receive bookings' : 'OFFLINE. Switch online above to get requests'}.
                </p>
              </div>
            )}

            {/* 3. TODAY'S QUEUE & UPCOMING BOOKINGS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">All Assigned Bookings</h3>
                <span className="text-xs text-slate-500 font-medium">{bookings.length} Total</span>
              </div>

              {bookings.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No assigned bookings in history.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{b.bookingRef}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-1">{b.serviceTitle}</h4>
                        <p className="text-xs text-slate-500">
                          {b.customerName} • {b.scheduledDate} ({b.scheduledTimeSlot})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-slate-900">₹{b.pricingSummary?.finalAmount || b.servicePrice}</span>
                          <p className="text-[10px] text-slate-400 capitalize">{b.payment?.status || 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Completed Revenue</span>
                <h3 className="text-3xl font-extrabold text-slate-950 mt-1">₹{totalEarnings}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1">100% Direct Payout (Zero Commission)</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Completed Jobs</span>
                <h3 className="text-3xl font-extrabold text-slate-950 mt-1">{completedJobs.length}</h3>
                <p className="text-xs text-slate-500 mt-1">Average rating: {pro?.ratingAvg?.toFixed(1) || '4.9'} ★</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Registered UPI ID</span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 truncate">{pro?.payoutBank?.upiId || 'arjun.singh@okhdfcbank'}</h3>
                <p className="text-xs text-slate-500 mt-1">Bank: {pro?.payoutBank?.accountMasked || '•••• 8842'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ratecard' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">My Standard Rate Card</h3>
                <p className="text-xs text-slate-500">Customers see these rates upfront before booking</p>
              </div>
            </div>

            <div className="space-y-3">
              {pro?.rateCard?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.service}</h4>
                    <p className="text-xs text-slate-500">Est. Time: {item.estimatedTime} • Warranty: {item.warranty}</p>
                  </div>
                  <span className="font-extrabold text-sm text-slate-900">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* On-Site Quote Modal Form */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Generate On-Site Quote</h3>
              <button onClick={() => setShowQuoteModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Diagnosis / Work Description *</label>
                <textarea
                  rows={3}
                  required
                  value={quoteDescription}
                  onChange={(e) => setQuoteDescription(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Spare Parts Cost (₹)</label>
                  <input
                    type="number"
                    value={quotePartsCost}
                    onChange={(e) => setQuotePartsCost(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Labor / Service Fee (₹)</label>
                  <input
                    type="number"
                    value={quoteLaborCost}
                    onChange={(e) => setQuoteLaborCost(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex justify-between font-bold text-amber-950">
                <span>Total Client Approval Quote:</span>
                <span>₹{Number(quotePartsCost) + Number(quoteLaborCost)}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Quote to Customer App</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
