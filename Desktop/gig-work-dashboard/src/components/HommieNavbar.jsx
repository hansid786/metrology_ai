import React, { useState } from 'react';
import {
  MapPin,
  ChevronDown,
  Search,
  Zap,
  Calendar,
  Home,
  Briefcase,
  ShieldCheck,
  User,
  SlidersHorizontal,
  Bell,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getActiveCity, getActiveLocality, getBookings } from '../services/hommieState';

export default function HommieNavbar({
  onOpenLocationModal,
  onNavigate,
  currentView
}) {
  const { user, role, switchRole } = useAuth();
  const activeCity = getActiveCity();
  const activeLocality = getActiveLocality();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const bookings = getBookings();
  const activeBooking = bookings.find((b) =>
    !['completed', 'cancelled_by_customer', 'cancelled_by_pro'].includes(b.status)
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & Locality */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              if (role === 'worker') onNavigate('pro-dashboard');
              else if (role === 'admin') onNavigate('admin');
              else onNavigate('home');
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-slate-900 transition">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-950 text-lg tracking-tight leading-none">
                  HOMMIE
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold uppercase tracking-wider">
                  Hyperlocal
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Home Services Marketplace
              </span>
            </div>
          </button>

          {/* Locality Selector Pill */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate">
              {activeLocality?.name || 'Indiranagar'}, {activeCity?.name || 'Bengaluru'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentView === 'home' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('discovery')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentView === 'discovery' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            Find Pros
          </button>

          <button
            onClick={() => onNavigate('my-home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              currentView === 'my-home' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>My Home Hub</span>
          </button>

          <button
            onClick={() => onNavigate('bookings')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              currentView === 'bookings' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookings</span>
            {activeBooking && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>
        </nav>

        {/* Right: Quick Active Booking Pill & Role Switcher */}
        <div className="flex items-center gap-2">
          {activeBooking && (
            <button
              onClick={() => onNavigate('bookings')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold shadow-xs hover:bg-amber-100 transition"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Order Active: {activeBooking.bookingRef}</span>
              <ArrowRight className="w-3 h-3 text-amber-700" />
            </button>
          )}

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition"
            >
              <div className="w-6 h-6 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                {role === 'customer' ? 'C' : role === 'worker' ? 'P' : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-[11px] font-extrabold capitalize leading-none">
                  {role === 'worker' ? 'Pro Mode' : role === 'admin' ? 'Admin Ops' : 'Customer'}
                </span>
                <span className="text-[9px] text-slate-500">Switch Role</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Role</span>
                  <p className="text-xs font-extrabold text-slate-900 capitalize">{role}</p>
                </div>

                <button
                  onClick={() => {
                    switchRole('customer');
                    setIsRoleDropdownOpen(false);
                    onNavigate('home');
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                    role === 'customer' ? 'text-amber-700 font-bold bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Customer App</span>
                  </div>
                  {role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                </button>

                <button
                  onClick={() => {
                    switchRole('worker');
                    setIsRoleDropdownOpen(false);
                    onNavigate('pro-dashboard');
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                    role === 'worker' ? 'text-amber-700 font-bold bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <span>Professional Portal</span>
                  </div>
                  {role === 'worker' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                </button>

                <button
                  onClick={() => {
                    switchRole('admin');
                    setIsRoleDropdownOpen(false);
                    onNavigate('admin');
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                    role === 'admin' ? 'text-amber-700 font-bold bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <span>Admin Operations</span>
                  </div>
                  {role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                </button>

                <div className="pt-2 mt-1 border-t border-slate-100 px-3">
                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      onNavigate('pro-onboarding');
                    }}
                    className="w-full py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold text-center block hover:bg-slate-800"
                  >
                    + Join as Professional
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}