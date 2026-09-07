import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Coins, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2,
  Award,
  Lock,
  Sparkles
} from 'lucide-react';

export default function Footer({ onNavigate, onOpenLegal }) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20 pt-16 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Positioning */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">Doorstep<span className="text-emerald-400">Pro</span></span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              India's leading worker-first hyperlocal services marketplace connecting verified independent AC technicians, electricians, plumbers, carpenters, and appliance repair specialists.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cooperative Society Reg #KA-BSSG-2022</span>
            </div>
          </div>

          {/* Col 2: Top Service Verticals */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Popular Services</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><button onClick={() => onNavigate('search')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">❄️ Split AC Jet Foam Cleaning</button></li>
              <li><button onClick={() => onNavigate('search')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">🚰 Tap Leakage & Geyser Installation</button></li>
              <li><button onClick={() => onNavigate('search')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">⚡ MCB Fuse & Inverter Repair</button></li>
              <li><button onClick={() => onNavigate('search')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">🧹 Deep Kitchen & Bathroom Wash</button></li>
              <li><button onClick={() => onNavigate('search')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">🪚 Wardrobe Hinges & Smart Locks</button></li>
              <li><button onClick={() => onNavigate('search')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">💧 RO Water Purifier Servicing</button></li>
            </ul>
          </div>

          {/* Col 3: Trust & Safety */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Trust & Guarantees</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onOpenLegal && onOpenLegal('privacy')} className="hover:text-emerald-400 flex items-center gap-2 cursor-pointer text-left">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Aadhaar KYC Identity Check</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal && onOpenLegal('cancellation')} className="hover:text-emerald-400 flex items-center gap-2 cursor-pointer text-left">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>30-Day Complete Work Guarantee</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal && onOpenLegal('worker_terms')} className="hover:text-emerald-400 flex items-center gap-2 cursor-pointer text-left">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>95%+ Direct Worker Payout</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal && onOpenLegal('safety')} className="hover:text-emerald-400 flex items-center gap-2 cursor-pointer text-left">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Grievance Officer & Escrow Desk</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Grievance & Helpline */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Platform Helpline</h4>
            <p className="text-slate-400 text-[11px]">24x7 Customer Desk & Field Technician Welfare</p>
            
            <div className="space-y-2 text-slate-300 font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">1800-419-7800 (Toll-Free)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@doorstep-pro.in</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Gomti Nagar, Lucknow - 226010</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Doorstep Pro Hyperlocal Marketplace Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-4 text-slate-400 font-semibold text-[11px]">
            <button onClick={() => onOpenLegal && onOpenLegal('terms')} className="hover:text-emerald-400 cursor-pointer">Terms of Service</button>
            <span>•</span>
            <button onClick={() => onOpenLegal && onOpenLegal('privacy')} className="hover:text-emerald-400 cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onOpenLegal && onOpenLegal('cancellation')} className="hover:text-emerald-400 cursor-pointer">Refund Policy</button>
            <span>•</span>
            <button onClick={() => onOpenLegal && onOpenLegal('safety')} className="hover:text-emerald-400 cursor-pointer">Safety Guidelines</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
