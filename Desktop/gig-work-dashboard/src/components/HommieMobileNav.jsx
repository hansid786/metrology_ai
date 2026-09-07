import React from 'react';
import { Home, Search, Calendar, User, Briefcase, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBookings } from '../services/hommieState';

export default function HommieMobileNav({ currentView, onNavigate }) {
  const { role } = useAuth();
  const bookings = getBookings();
  const activeBooking = bookings.find((b) =>
    !['completed', 'cancelled_by_customer', 'cancelled_by_pro'].includes(b.status)
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
      {role === 'customer' && (
        <>
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              currentView === 'home' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>

          <button
            onClick={() => onNavigate('discovery')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              currentView === 'discovery' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Pros</span>
          </button>

          <button
            onClick={() => onNavigate('my-home')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              currentView === 'my-home' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">My Home</span>
          </button>

          <button
            onClick={() => onNavigate('bookings')}
            className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition ${
              currentView === 'bookings' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Bookings</span>
            {activeBooking && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>
        </>
      )}

      {role === 'worker' && (
        <>
          <button
            onClick={() => onNavigate('pro-dashboard')}
            className={`flex flex-col items-center py-1 px-4 rounded-xl transition ${
              currentView === 'pro-dashboard' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Pro Dashboard</span>
          </button>
        </>
      )}

      {role === 'admin' && (
        <>
          <button
            onClick={() => onNavigate('admin')}
            className={`flex flex-col items-center py-1 px-4 rounded-xl transition ${
              currentView === 'admin' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Admin Ops</span>
          </button>
        </>
      )}
    </nav>
  );
}