import React from 'react';
import { 
  User, 
  MapPin, 
  CalendarCheck, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Star, 
  PlusCircle, 
  Phone, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function CustomerDashboardView({ 
  user, 
  bookings, 
  workers, 
  onViewInvoice, 
  onFindWorkers, 
  onBookWorker 
}) {
  const customerBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(user?.name?.toLowerCase() || 'rahul') ||
    b.customerName === 'Rahul Verma' ||
    b.customerName === 'Pooja Iyer'
  );

  const savedWorkers = workers.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8">
      
      {/* Customer Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name || 'Rahul Verma'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
                Customer Account
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{user?.locality || 'Koramangala 5th Block, Bengaluru'}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Zero-Markup Member</span>
            </p>
          </div>
        </div>

        <button
          onClick={onFindWorkers}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Book Nearby Worker</span>
        </button>
      </div>

      {/* Customer Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Bookings</span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
            {customerBookings.length || 3}
          </span>
          <p className="text-xs text-slate-500 mt-1">Direct local verified services</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Estimated Savings</span>
          <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
            ₹1,450
          </span>
          <p className="text-xs text-emerald-800 mt-1">Saved vs corporate app surge fees</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Worker Fairness Score</span>
          <span className="text-2xl font-black text-indigo-700 font-mono mt-1 block">
            95.2%
          </span>
          <p className="text-xs text-slate-500 mt-1">Of your money went directly to workers</p>
        </div>
      </div>

      {/* My Bookings Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-slate-700" />
            <span>My Service Bookings</span>
          </h2>
          <span className="text-xs text-slate-500">Live & completed jobs</span>
        </div>

        <div className="space-y-3">
          {customerBookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900">{b.id}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{b.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    b.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{b.serviceTitle}</h4>
                <p className="text-xs text-slate-500">
                  Worker: <strong className="text-slate-700 font-medium">{b.workerName} ({b.trade})</strong>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block">Total Paid</span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">₹{b.totalAmount}</span>
                </div>

                <button
                  onClick={() => onViewInvoice(b)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Bill</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved / Recommended Local Karigars */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recommended Verified Workers in Your Ward</h3>
            <p className="text-xs text-slate-500">Fast direct booking without surge fees.</p>
          </div>
          <button
            onClick={onFindWorkers}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedWorkers.map((worker) => (
            <div
              key={worker.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{worker.name}</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">{worker.trade}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{worker.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="font-mono font-bold text-slate-900 text-xs">₹{worker.baseRate}/visit</span>
                <button
                  onClick={() => onBookWorker(worker)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-1 px-2.5 rounded-lg text-[11px] transition-colors cursor-pointer"
                >
                  Direct Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
