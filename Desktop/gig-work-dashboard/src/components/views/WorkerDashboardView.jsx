import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench, 
  QrCode, 
  ArrowRight, 
  Building2, 
  Check, 
  X, 
  Sparkles,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Upload,
  Star,
  Zap,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { 
  apiGetBookings, 
  apiUpdateBookingStatus, 
  apiUpdateWorkerAvailability, 
  apiGetWorkerById,
  apiAddPortfolioPhoto 
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function WorkerDashboardView({ 
  onOpenKYCModal, 
  onRateCustomer,
  onDisputeBooking 
}) {
  const { currentUser, updateUserSession } = useAuth();
  const { openChatForBooking, showToast } = useNotifications();
  
  const [workerProfile, setWorkerProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [portfolioPhotos, setPortfolioPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'passbook' | 'portfolio'
  const [isLoading, setIsLoading] = useState(true);

  // New photo state
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const fetchWorkerData = async () => {
    setIsLoading(true);
    try {
      const profile = await apiGetWorkerById(currentUser?.workerId || 'w-101');
      if (profile) {
        setWorkerProfile(profile);
        setIsOnline(profile.isAvailableNow);
        setPortfolioPhotos(profile.portfolioPhotos || []);
      }
      const list = await apiGetBookings({ workerId: currentUser?.workerId || 'w-101' });
      setBookings(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, [currentUser]);

  const handleToggleOnline = async () => {
    const next = !isOnline;
    setIsOnline(next);
    await apiUpdateWorkerAvailability(currentUser?.workerId || 'w-101', next);
    updateUserSession({ isAvailableNow: next });
    showToast(`Duty status updated: ${next ? 'Online (Accepting Leads)' : 'Offline'}`);
  };

  const handleAcceptJob = async (bookingId) => {
    const res = await apiUpdateBookingStatus(bookingId, 'accepted', 'Job accepted by professional');
    if (res.success) {
      showToast('Job accepted! Added to your active schedule.');
      fetchWorkerData();
    }
  };

  const handleProgressJob = async (bookingId, nextStatus) => {
    const res = await apiUpdateBookingStatus(bookingId, nextStatus);
    if (res.success) {
      showToast(`Status updated to ${nextStatus.replace(/_/g, ' ')}`);
      fetchWorkerData();
    }
  };

  const handleAddPhotoSubmit = async (e) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const res = await apiAddPortfolioPhoto(currentUser?.workerId || 'w-101', newPhotoUrl);
    if (res.success) {
      setPortfolioPhotos(res.portfolioPhotos);
      setNewPhotoUrl('');
      setShowAddPhoto(false);
      showToast('Portfolio image added to your public profile.');
    }
  };

  const requestedJobs = bookings.filter(b => b.status === 'requested');
  const activeJobs = bookings.filter(b => ['accepted', 'on_the_way', 'started'].includes(b.status));
  const completedJobs = bookings.filter(b => b.status === 'completed');

  const todayEarnings = completedJobs.reduce((sum, b) => sum + (b.workerPayout || 329), 0);
  const totalLifetimeEarnings = (workerProfile?.completedJobsCount || 418) * 340;

  return (
    <div className="space-y-6">
      
      {/* Worker Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={workerProfile?.avatar || currentUser?.avatar}
              alt={workerProfile?.name || currentUser?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{workerProfile?.name || currentUser?.name}</h1>
              {workerProfile?.verificationStatus === 'verified' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Pro
                </span>
              ) : (
                <button
                  onClick={onOpenKYCModal}
                  className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 cursor-pointer hover:bg-amber-500/30"
                >
                  ⚡ KYC Pending — Upload Docs
                </button>
              )}
            </div>
            <p className="text-slate-300 text-xs mt-0.5">{workerProfile?.trade || currentUser?.trade} • {workerProfile?.locality}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Union Reg: {workerProfile?.unionRegNo || 'KA-BSSG-2022-841'}</p>
          </div>
        </div>

        {/* Availability Switch (Spec 22 & 9: Available for jobs ON/OFF) */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 self-start md:self-auto">
          <div className="text-right pr-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Duty Status</span>
            <span className="text-xs font-bold text-white">{isOnline ? '🟢 Available for jobs' : '⚪ Offline'}</span>
          </div>

          <button
            onClick={handleToggleOnline}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isOnline ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {isOnline ? 'Active (ON)' : 'Resting (OFF)'}
          </button>
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Earnings</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              95% Direct Kept
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block pt-1">
            ₹{todayEarnings || 678}
          </span>
          <p className="text-xs text-slate-500">Lifetime: <strong>₹{totalLifetimeEarnings.toLocaleString()}</strong> (Direct UPI)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Suraksha Health Cover</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block pt-1">
            ₹2,00,000
          </span>
          <p className="text-xs text-blue-700 font-medium">Policy #SK-2026-8812 Active</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Rating Score</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{workerProfile?.ratingAvg || 4.94}</span>
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block pt-1">
            {workerProfile?.completedJobsCount || 418} <span className="text-xs font-normal text-slate-400">Jobs</span>
          </span>
          <p className="text-xs text-emerald-800 font-semibold">{workerProfile?.responseRatePct || 98}% Response Rate</p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'radar'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Live Dispatch Radar ({requestedJobs.length + activeJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('passbook')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'passbook'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          UPI Earnings Passbook
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Work Portfolio & Photos ({portfolioPhotos.length})
        </button>
      </div>

      {/* TAB 1: Live Radar */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          
          {/* Active Job In Progress HUD */}
          {activeJobs.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Ongoing Dispatches
              </span>

              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl border-2 border-emerald-500/50 p-6 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <h3 className="font-extrabold text-slate-900 text-sm">Order #{job.bookingRef}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold capitalize">
                        {job.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span className="font-mono font-black text-emerald-800 text-sm">
                      Your Payout: ₹{job.workerPayout}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-7 space-y-2 text-xs">
                      <h4 className="font-extrabold text-slate-900 text-base">{job.serviceTitle}</h4>
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.addressText}</span>
                      </p>
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Slot: <strong>{job.scheduledDate}, {job.scheduledSlot}</strong></span>
                      </p>
                      {job.problemDescription && (
                        <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                          <strong>Note from Customer:</strong> {job.problemDescription}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-5 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openChatForBooking(job)}
                          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Chat ({job.customerName})</span>
                        </button>

                        <a
                          href={`tel:${job.customerPhone}`}
                          className="py-2 px-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Call</span>
                        </a>
                      </div>

                      {/* Step Progress Actions */}
                      {job.status === 'accepted' && (
                        <button
                          onClick={() => handleProgressJob(job.id, 'on_the_way')}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Mark on the Way (Leaving Workshop)
                        </button>
                      )}

                      {job.status === 'on_the_way' && (
                        <button
                          onClick={() => handleProgressJob(job.id, 'started')}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Mark Arrived & Start Service
                        </button>
                      )}

                      {job.status === 'started' && (
                        <button
                          onClick={() => handleProgressJob(job.id, 'completed')}
                          className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Complete Service & Receive Direct UPI ₹{job.workerPayout}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Incoming New Job Requests */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Incoming Job Leads in Ward ({requestedJobs.length})
            </span>

            {requestedJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
                <h4 className="font-bold text-slate-900 text-sm">All leads accepted!</h4>
                <p className="text-xs text-slate-500">Keep your status online to receive alerts for new bookings.</p>
              </div>
            ) : (
              requestedJobs.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-800">{req.bookingRef}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-800 font-bold">1.2 km away</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{req.scheduledDate}, {req.scheduledSlot}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{req.serviceTitle}</h4>
                    <p className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.addressText}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Net Payout</span>
                      <span className="text-lg font-black text-emerald-800 font-mono">₹{req.workerPayout}</span>
                    </div>

                    <button
                      onClick={() => handleAcceptJob(req.id)}
                      className="bg-slate-900 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Accept Job</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 2: Earnings Passbook */}
      {activeTab === 'passbook' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Direct UPI Earnings Passbook</h3>
              <p className="text-xs text-slate-500">Every customer payment settles directly to your UPI ID without 15-day holdbacks.</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto">
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Primary UPI: {workerProfile?.phone ? `${workerProfile.phone.replace(/[^0-9]/g, '')}@upi` : 'arjun.singh@hdfcbank'}</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {completedJobs.map((tx) => (
              <div key={tx.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{tx.bookingRef}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{tx.customerName}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{tx.serviceTitle}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Customer Paid: ₹{tx.finalAmount}</span>
                    <span className="font-mono font-black text-emerald-800 text-sm">₹{tx.workerPayout} (95%)</span>
                  </div>

                  {!tx.workerRating && (
                    <button
                      onClick={() => onRateCustomer && onRateCustomer(tx)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Rate Customer
                    </button>
                  )}

                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Direct Settled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Work Portfolio & Photos (Spec 29) */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-slate-900">Work Portfolio & Completed Jobs Gallery</h3>
              <p className="text-xs text-slate-500">Showcase high-resolution photographs of your on-site trade work.</p>
            </div>
            <button
              onClick={() => setShowAddPhoto(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Work Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {portfolioPhotos.map((url, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-square shadow-xs">
                <img src={url} alt="Portfolio item" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[11px] font-bold text-white">Verified Work Sample #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Photo Modal */}
          {showAddPhoto && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
                <h4 className="font-extrabold text-slate-900 text-base">Add Portfolio Image URL</h4>
                <form onSubmit={handleAddPhotoSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Image URL (Unsplash or direct CDN link)</label>
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddPhoto(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                    >
                      Upload to Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

