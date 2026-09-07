import React from 'react';
import { ShieldCheck, MapPin, Heart, ArrowRight } from 'lucide-react';
import { HOMMIE_CITIES } from '../data/hommieData';

export default function HommieFooter({ onNavigate, onOpenLocationModal }) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-24 md:pb-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base">
                H
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">HOMMIE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering independent local technicians and homeowners with transparent pricing, instant dispatch, and 30-day rework protection.
            </p>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Live Service Hubs</h4>
            <div className="space-y-2 text-xs">
              {HOMMIE_CITIES.map((city) => (
                <div key={city.id}>
                  <strong className="text-slate-200 block">{city.name}</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {city.localities.map((l) => l.name).join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('discovery')} className="hover:text-white transition">
                  Find Local Pros
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-home')} className="hover:text-white transition">
                  My Home Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bookings')} className="hover:text-white transition">
                  My Bookings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pro-onboarding')} className="text-amber-400 hover:underline">
                  Join as Professional (Zero Commission)
                </button>
              </li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">HOMMIE Standard</h4>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="text-white font-bold block">✓ 30-Day Free Rework</span>
              <p className="text-[11px] text-slate-400">If any repair issue reoccurs, your pro revisits at zero extra inspection cost.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HOMMIE Technologies Pvt. Ltd. Hyperlocal On-Demand Services.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}