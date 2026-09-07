import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Receipt, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  Plus, 
  User, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Heart,
  Search,
  Trash2,
  Flag,
  Home,
  Briefcase,
  CreditCard
} from 'lucide-react';
import { 
  apiGetBookings, 
  apiUpdateBookingStatus, 
  apiGetFavorites, 
  apiSaveAddress, 
  apiDeleteAddress 
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function CustomerDashboardView({ 
  onViewInvoice, 
  onBookNewService, 
  onRateWorker,
  onDisputeBooking,
  onReportSafety,
  onSelectWorker,
  onPayBooking
}) {
  const { currentUser } = useAuth();
  const { openChatForBooking, showToast } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState(currentUser?.savedAddresses || []);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'favorites' | 'addresses'
  const [isLoading, setIsLoading] = useState(true);

  // New address state
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newLine1, setNewLine1] = useState('');
  const [newLocality, setNewLocality] = useState('Gomti Nagar');
  const [newCity, setNewCity] = useState('Lucknow');

  const fetchOrdersAndFavs = async () => {
    setIsLoading(true);
    try {
      const [list, favs] = await Promise.all([
        apiGetBookings({ customerId: currentUser?.id || 'u-cust-1' }),
        apiGetFavorites(currentUser?.id || 'u-cust-1')
      ]);
      setBookings(list);
      setFavorites(favs);
      if (currentUser?.savedAddresses) {
        setSavedAddresses(currentUser.savedAddresses);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndFavs();
  }, [currentUser]);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this service request?')) {
      const res = await apiUpdateBookingStatus(bookingId, 'cancelled', 'Cancelled by customer');
      if (res.success) {
        showToast('Booking cancelled.');
        fetchOrdersAndFavs();
      }
    }
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newLine1.trim()) return;

    const res = await apiSaveAddress(currentUser?.id || 'u-cust-1', {
      label: newLabel,
      addressLine1: newLine1,
      locality: newLocality,
      city: newCity,
      postalCode: '226010'
    });

    if (res.success) {
      setSavedAddresses(res.savedAddresses);
      setNewLine1('');
      setShowAddAddr(false);
      showToast('Address saved.');
    }
  };

  const handleDeleteAddr = async (addrId) => {
    const res = await apiDeleteAddress(currentUser?.id || 'u-cust-1', addrId);
    if (res.success) {
      setSavedAddresses(res.savedAddresses);
      showToast('Address removed.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Customer Header Banner (Spec 21: Good evening, Hanzala / What do you need help with?) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Customer Portal
            </span>
            <span className="text-xs text-slate-400">Lucknow • Gomti Nagar Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Good evening, {currentUser?.name || 'Hanzala'}
          </h1>
          <p className="text-sm text-slate-300">What do you need help with at your home today?</p>
        </div>

        <button
          onClick={onBookNewService}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 px-5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg self-start sm:self-auto cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Find Nearby Professionals</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Active & Past Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          My Professionals ({favorites.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Saved Addresses ({savedAddresses.length})
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">You haven't booked a service yet</h3>
              <p className="text-xs text-slate-500">Book your first verified local technician for repairs or maintenance.</p>
              <button
                onClick={onBookNewService}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Find a Professional
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-900">{booking.bookingRef}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{booking.createdAt}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      booking.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      booking.status === 'on_the_way' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      booking.status === 'requested' ? 'bg-amber-100 text-amber-800' :
                      booking.status === 'disputed' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      ● {booking.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Final Amount:</span>
                    <span className="font-mono font-black text-slate-900 text-sm">₹{booking.finalAmount}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  
                  <div className="md:col-span-7 space-y-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{booking.serviceTitle}</h3>
                    
                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Slot: <strong>{booking.scheduledDate}, {booking.scheduledSlot}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.addressText}</span>
                      </p>
                    </div>

                    {/* Assigned Worker Info Card */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 mt-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Technician</span>
                        <h4 className="font-bold text-slate-900 text-xs">{booking.workerName} ({booking.workerTrade})</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openChatForBooking(booking)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Chat</span>
                        </button>

                        <a
                          href={`tel:${booking.workerPhone}`}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Status */}
                  <div className="md:col-span-5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Dispatch Timeline & Actions
                    </span>

                    <div className="space-y-1.5 text-xs">
                      {booking.statusHistory?.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-slate-800 font-medium capitalize">{step.status.replace(/_/g, ' ')}</span>
                          <span className="text-[10px] text-slate-400 font-mono ml-auto">{step.timestamp}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewInvoice(booking)}
                          className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>

                        {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                          <button
                            onClick={() => onPayBooking && onPayBooking(booking)}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay ₹{booking.finalAmount}</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === 'completed' && !booking.customerRating && (
                          <button
                            onClick={() => onRateWorker(booking)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>Rate Worker</span>
                          </button>
                        )}

                        {booking.status === 'completed' && (
                          <button
                            onClick={() => onDisputeBooking && onDisputeBooking(booking)}
                            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Dispute</span>
                          </button>
                        )}

                        {booking.status === 'requested' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Favorites ("My Professionals", Spec 15) */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
              <Heart className="w-8 h-8 text-rose-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">No saved professionals yet</h3>
              <p className="text-xs text-slate-500">Save professionals you trust for easier booking next time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((worker) => (
                <div key={worker.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{worker.name}</h4>
                      <p className="text-xs text-slate-500">{worker.trade} • ⭐ {worker.ratingAvg}</p>
                      <span className="text-[11px] font-bold text-emerald-700">₹{worker.baseRate} onwards</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectWorker && onSelectWorker(worker)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses (Spec 26) */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900">Saved Delivery Addresses</h3>
            <button
              onClick={() => setShowAddAddr(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedAddresses.map((addr) => (
              <div key={addr.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1">
                    {addr.label === 'Home' ? <Home className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                    <span>{addr.label}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {addr.isDefault && (
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Default
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteAddr(addr.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-sm">{addr.addressLine1}</p>
                <p className="text-xs text-slate-500">{addr.locality}, {addr.city} - {addr.postalCode}</p>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddAddr && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
                <h4 className="font-extrabold text-slate-900 text-base">Add New Address</h4>
                <form onSubmit={handleSaveNewAddress} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Address Label</label>
                    <div className="flex gap-2">
                      {['Home', 'Work', 'Other'].map(lbl => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setNewLabel(lbl)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                            newLabel === lbl ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">House / Flat / Street Details</label>
                    <input
                      type="text"
                      value={newLine1}
                      onChange={(e) => setNewLine1(e.target.value)}
                      placeholder="e.g. Flat 302, Royal Palms Apartment"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Locality / Sector</label>
                      <input
                        type="text"
                        value={newLocality}
                        onChange={(e) => setNewLocality(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddAddr(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                    >
                      Save Address
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

