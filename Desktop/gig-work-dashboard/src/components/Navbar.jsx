import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  CalendarCheck, 
  Coins, 
  User, 
  Wrench, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  MapPin, 
  PlusCircle, 
  Radio,
  Flame,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationCenter from './NotificationCenter';

export default function Navbar({ currentView, onNavigate }) {
  const { currentUser, role, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0" 
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-slate-900 tracking-tight">Doorstep<span className="text-emerald-600">Pro</span></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-emerald-800 font-extrabold tracking-wider uppercase -mt-0.5 hidden sm:block">
                {role === 'worker' ? 'Partner Dispatch Center' : role === 'admin' ? 'Operations Control' : 'Hyperlocal Marketplace'}
              </p>
            </div>
          </div>

          {/* Center Navigation Capsule */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 shadow-inner">
            {(role === 'customer' || !isAuthenticated) && (
              <>
                <button
                  onClick={() => onNavigate('home')}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                    currentView === 'home'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => onNavigate('search')}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                    currentView === 'search'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Book Services
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => onNavigate('customer_dashboard')}
                    className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                      currentView === 'customer_dashboard'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    My Bookings
                  </button>
                )}
              </>
            )}

            {role === 'worker' && (
              <>
                <button
                  onClick={() => onNavigate('worker_dashboard')}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'worker_dashboard'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Job Radar</span>
                </button>

                <button
                  onClick={() => onNavigate('worker_profile_settings')}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                    currentView === 'worker_profile_settings'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Rate Card
                </button>
              </>
            )}

            {role === 'admin' && (
              <button
                onClick={() => onNavigate('admin_dashboard')}
                className="px-4 py-2 rounded-full bg-slate-900 text-white shadow-sm font-bold"
              >
                Control Center
              </button>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Location indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gomti Nagar, Lucknow</span>
            </div>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                  {unreadCount > 0 && (
                    <span className="absolute 0 top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-ping"></span>
                  )}
                </button>

                {isNotifOpen && (
                  <NotificationCenter onClose={() => setIsNotifOpen(false)} />
                )}
              </div>
            )}

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (role === 'worker') onNavigate('worker_dashboard');
                    else if (role === 'admin') onNavigate('admin_dashboard');
                    else onNavigate('customer_dashboard');
                  }}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline font-bold">{currentUser?.name || 'Account'}</span>
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  onClick={() => onNavigate('auth')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
