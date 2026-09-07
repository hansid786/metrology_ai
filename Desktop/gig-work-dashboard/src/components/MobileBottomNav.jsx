import React from 'react';
import { 
  Home, 
  Search, 
  CalendarCheck, 
  MessageSquare, 
  User, 
  Coins, 
  Heart, 
  Radio, 
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function MobileBottomNav({ currentView, onNavigate }) {
  const { role, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();

  if (!isAuthenticated || role === 'admin') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        
        {/* Customer Mobile Navigation: Home | Bookings | Messages | Favourites | Profile */}
        {role === 'customer' ? (
          <>
            <button
              onClick={() => onNavigate('home')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'home' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className={`w-5 h-5 mb-0.5 ${currentView === 'home' ? 'text-emerald-700' : ''}`} />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('search')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'search' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Search className={`w-5 h-5 mb-0.5 ${currentView === 'search' ? 'text-emerald-700' : ''}`} />
              <span>Explore</span>
            </button>

            <button
              onClick={() => onNavigate('customer_dashboard')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'customer_dashboard' ? 'text-indigo-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarCheck className={`w-5 h-5 mb-0.5 ${currentView === 'customer_dashboard' ? 'text-indigo-700' : ''}`} />
              <span>Bookings</span>
            </button>

            <button
              onClick={() => onNavigate('customer_profile_settings')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'customer_profile_settings' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className={`w-5 h-5 mb-0.5 ${currentView === 'customer_profile_settings' ? 'text-emerald-700' : ''}`} />
              <span>Profile</span>
            </button>
          </>
        ) : (
          /* Worker Mobile Navigation: Radar | Jobs | Passbook | KYC | Profile */
          <>
            <button
              onClick={() => onNavigate('worker_dashboard')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'worker_dashboard' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Radio className={`w-5 h-5 mb-0.5 ${currentView === 'worker_dashboard' ? 'text-emerald-700 animate-pulse' : ''}`} />
              <span>Radar</span>
            </button>

            <button
              onClick={() => onNavigate('worker_dashboard')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'worker_dashboard' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Coins className={`w-5 h-5 mb-0.5 ${currentView === 'worker_dashboard' ? 'text-emerald-700' : ''}`} />
              <span>Earnings</span>
            </button>

            <button
              onClick={() => onNavigate('worker_profile_settings')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'worker_profile_settings' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wrench className={`w-5 h-5 mb-0.5 ${currentView === 'worker_profile_settings' ? 'text-emerald-700' : ''}`} />
              <span>Rates & Plans</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
}
