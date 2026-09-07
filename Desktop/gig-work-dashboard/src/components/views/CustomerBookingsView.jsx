import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Star,
  FileText,
  ChevronRight,
  ExternalLink,
  Ban,
  ArrowRight,
  Receipt
} from 'lucide-react';
import {
  getBookings,
  cancelBooking,
  subscribeHommieState
} from '../../services/hommieState';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  broadcasted: { label: 'Matching Pros', color: 'bg-amber-100 text-amber-800' },
  pro_assigned: { label: 'Pro Confirmed', color: 'bg-blue-100 text-blue-800' },
  scheduled_confirmed: { label: 'Scheduled', color: 'bg-sky-100 text-sky-800' },
  en_route: { label: 'Pro On the Way', color: 'bg-indigo-100 text-indigo-800' },
  arrived: { label: 'Pro Arrived On-Site', color: 'bg-purple-100 text-purple-800' },
  inspection_in_progress: { label: 'Inspecting / Diagnosing', color: 'bg-amber-100 text-amber-800' },
  quote_submitted: { label: 'Quote Pending Your Approval', color: 'bg-amber-500 text-slate-950 font-bold animate-pulse' },
  quote_approved: { label: 'Quote Approved', color: 'bg-emerald-100 text-emerald-800' },
  work_in_progress: { label: 'Work Underway', color: 'bg-blue-100 text-blue-800' },
  work_completed_pending_review: { label: 'Work Finished', color: 'bg-emerald-100 text-emerald-800' },
  payment_pending: { label: 'Payment Pending', color: 'bg-amber-500 text-slate-950 font-bold animate-pulse' },
  payment_processing: { label: 'Payment Processing', color: 'bg-amber-100 text-amber-800' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
  disputed: { label: 'Under Review', color: 'bg-rose-100 text-rose-800' },
  cancelled_by_customer: { label: 'Cancelled by You', color: 'bg-slate-100 text-slate-500' },
  cancelled_by_pro: { label: 'Cancelled by Pro', color: 'bg-slate-100 text-slate-500' }
};

export default function CustomerBookingsView({
  onOpenQuoteModal,
  onOpenPaymentModal,
  onOpenRatingModal,
  onOpenChatModal,
  onOpenSafetyModal,
  onNavigate
}) {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // active, completed, all

  const refreshBookings = () => {
    setBookings(getBookings());
  };

  useEffect(() => {
    refreshBookings();
    const unsub = subscribeHommieState(refreshBookings);
    return unsub;
  }, []);

  const activeBookings = bookings.filter((b) =>
    !['completed', 'cancelled_by_customer', 'cancelled_by_pro'].includes(b.status)
  );

  const completedBookings = bookings.filter((b) =>
    ['completed', 'cancelled_by_customer', 'cancelled_by_pro'].includes(b.status)
  );

  const displayedList =
    activeTab === 'active'
      ? activeBookings
      : activeTab === 'completed'
      ? completedBookings
      : bookings;

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? Free cancellation is allowed before pro departure.')) {
      cancelBooking(bookingId, 'Customer requested cancellation via dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-950">My Bookings & Service Visits</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time tracking, on-site quotes, direct payments, and 30-day warranty records
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'active'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({activeBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'completed'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed & Past ({completedBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({bookings.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No bookings found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'active'
                ? 'You currently have no active or scheduled service visits.'
                : 'You have no past service visits recorded yet.'}
            </p>
            <button
              onClick={() => onNavigate('discovery')}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
            >
              Browse Local Technicians
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {displayedList.map((booking) => {
              const statusInfo = STATUS_CONFIG[booking.status] || {
                label: booking.status,
                color: 'bg-slate-100 text-slate-700'
              };

              const hasPendingQuote = booking.status === 'quote_submitted' && booking.quote?.status === 'pending';
              const needsPayment = booking.status === 'payment_pending';
              const needsRating = booking.status === 'completed' && !booking.customerRating;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  {/* Top Bar: Booking Ref, Status & Date */}
                  <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {booking.bookingRef}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        {booking.bookingType === 'instant' ? '⚡ Urgent Instant Dispatch' : '📅 Scheduled Slot'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Column 1: Service & Pro Details */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-950">
                            {booking.serviceTitle}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {booking.scheduledDate} ({booking.scheduledTimeSlot})
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {booking.address?.locality || 'Indiranagar'}
                            </span>
                          </div>
                        </div>

                        {/* Pro Profile Card Inside Booking */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={booking.workerAvatar}
                              alt={booking.workerName}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                                {booking.workerName}
                              </h4>
                              <p className="text-[11px] text-slate-500">{booking.workerTrade}</p>
                              <span className="text-[10px] text-emerald-700 font-bold inline-flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> HOMMIE Verified Pro
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onOpenChatModal(booking)}
                              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm"
                              title="Chat with Pro"
                            >
                              <MessageSquare className="w-4 h-4 text-amber-600" />
                            </button>
                            <a
                              href={`tel:${booking.workerPhone}`}
                              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm"
                              title="Call Pro"
                            >
                              <Phone className="w-4 h-4 text-emerald-600" />
                            </a>
                          </div>
                        </div>

                        {/* Specific Action Alerts */}
                        {hasPendingQuote && (
                          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                                On-Site Quote Ready: ₹{booking.quote.totalAmount}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5">
                                Technician diagnosed the issue: "{booking.quote.items?.[0]?.description}". Please review and approve to start work.
                              </p>
                            </div>
                            <button
                              onClick={() => onOpenQuoteModal(booking)}
                              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shrink-0 shadow-sm"
                            >
                              Review Quote
                            </button>
                          </div>
                        )}

                        {needsPayment && (
                          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                                Work Completed • Amount Due: ₹{booking.pricingSummary?.finalAmount || booking.servicePrice}
                              </h4>
                              <p className="text-xs text-emerald-800 mt-0.5">
                                Service delivered successfully. Pay securely via UPI, Card, or Cash on Completion.
                              </p>
                            </div>
                            <button
                              onClick={() => onOpenPaymentModal(booking)}
                              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition shrink-0 shadow-md flex items-center gap-1.5"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Pay Now</span>
                            </button>
                          </div>
                        )}

                        {needsRating && (
                          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-amber-950">
                                How was your experience with {booking.workerName}?
                              </h4>
                              <p className="text-xs text-amber-800 mt-0.5">
                                Rate quality, punctuality, and behavior to help local pros grow.
                              </p>
                            </div>
                            <button
                              onClick={() => onOpenRatingModal(booking)}
                              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shrink-0 shadow-sm flex items-center gap-1"
                            >
                              <Star className="w-3.5 h-3.5 fill-slate-950" />
                              <span>Rate Service</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Column 2: Invoice / Financials Breakdown */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-xs font-bold text-slate-700">Billing Summary</span>
                            <Receipt className="w-4 h-4 text-slate-400" />
                          </div>

                          <div className="mt-3 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600">
                              <span>Service Base / Quote:</span>
                              <span className="font-medium text-slate-900">₹{booking.servicePrice}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Standard Diagnostic / Visit:</span>
                              <span className="font-medium text-slate-900">₹{booking.inspectionFee || 149}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Platform Fee:</span>
                              <span className="font-medium text-slate-900">₹{booking.platformFee || 15}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>30-Day Guarantee Cover:</span>
                              <span className="font-medium text-slate-900">₹{booking.safetyFee || 15}</span>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-950 text-sm">
                              <span>Total Amount:</span>
                              <span className="text-amber-700">
                                ₹{booking.pricingSummary?.finalAmount || booking.servicePrice + (booking.platformFee || 15) + (booking.safetyFee || 15)}
                              </span>
                            </div>

                            <div className="text-[10px] text-slate-500 pt-1">
                              Status: <strong className="uppercase text-slate-700">{booking.payment?.status || 'Pending'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Secondary Actions: Safety & Cancellation */}
                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                          <button
                            onClick={() => onOpenSafetyModal({ bookingId: booking.id, proName: booking.workerName })}
                            className="text-slate-400 hover:text-red-600 text-[11px] font-semibold"
                          >
                            Safety Help
                          </button>

                          {!['completed', 'cancelled_by_customer', 'cancelled_by_pro'].includes(booking.status) && (
                            <button
                              onClick={() => handleCancel(booking.id)}
                              className="text-red-600 hover:text-red-700 text-[11px] font-semibold"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
