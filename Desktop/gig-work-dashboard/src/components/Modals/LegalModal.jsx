import React, { useState } from 'react';
import { X, ShieldCheck, Scale, FileText, Lock, RefreshCw, UserCheck, HeartHandshake } from 'lucide-react';

export default function LegalModal({ initialTab = 'terms', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: Scale },
    { id: 'privacy', label: 'Privacy & Data Policy', icon: Lock },
    { id: 'cancellation', label: 'Cancellation & Refund', icon: RefreshCw },
    { id: 'worker_terms', label: 'Worker Partner Terms', icon: UserCheck },
    { id: 'safety', label: 'Safety & Grievance Guidelines', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Trust, Safety & Legal Governance</h3>
              <p className="text-xs text-slate-400">Statutory Compliances & Platform Safeguards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 p-2 gap-1.5 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed font-normal">
          
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900">1. Platform Services & User Agreement</h4>
              <p>
                Our hyperlocal platform operates as an independent matching marketplace connecting verified service seekers (Customers) with self-employed trade specialists (Workers). We do not act as an employer of independent technicians.
              </p>
              <h4 className="text-sm font-black text-slate-900">2. Transparent Pricing & Zero Hidden Charges</h4>
              <p>
                All inspections, diagnostic fees, and baseline rates are displayed prior to booking confirmation. Extra material purchases must be mutually verified by physical retail receipts.
              </p>
              <h4 className="text-sm font-black text-slate-900">3. Direct Worker Payment Protection</h4>
              <p>
                Platform fees are capped at a nominal rate (e.g. ₹10 platform fee) to ensure independent gig workers retain 95%+ of their earned labor compensation.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900">1. Data Minimization & Privacy Protection</h4>
              <p>
                We do not sell user data. Customer phone numbers and exact door numbers are only disclosed to the assigned worker upon booking acceptance for navigation purposes.
              </p>
              <h4 className="text-sm font-black text-slate-900">2. KYC & Identity Verification Compliance</h4>
              <p>
                Government ID documents submitted by workers for identity verification are encrypted at rest using industry-standard AES-256 and verified through accredited regulatory APIs. We do not store biometric data.
              </p>
            </div>
          )}

          {activeTab === 'cancellation' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900">1. Fair Cancellation Window</h4>
              <p>
                Customers can cancel any scheduled booking free of charge up until 1 hour prior to the scheduled service arrival time. If cancelled while the technician is marked "On The Way", a ₹50 technician fuel allowance applies.
              </p>
              <h4 className="text-sm font-black text-slate-900">2. Refund & Escrow Dispute Resolution</h4>
              <p>
                In the event of an unfulfilled service or verified poor workmanship, the escrow hold is returned within 2 to 4 business hours directly to the original UPI / card source account.
              </p>
            </div>
          )}

          {activeTab === 'worker_terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900">1. Independent Contractor Autonomy</h4>
              <p>
                Workers maintain 100% control over their working hours, service pricing, and active status. Workers can toggle their availability on or off at any moment without penalty.
              </p>
              <h4 className="text-sm font-black text-slate-900">2. Payout Transparency</h4>
              <p>
                Direct UPI settlements occur instantly upon customer sign-off or within a daily automated batch payout cycle directly to the worker's bank account.
              </p>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900">1. Trust & Safety Standards</h4>
              <p>
                All on-site professionals undergo multi-point background checks, trade skill verification, and customer rating audits. Any harassment or fraud triggers immediate account suspension.
              </p>
              <h4 className="text-sm font-black text-slate-900">2. Grievance Officer Contact</h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p><strong>Grievance Officer:</strong> Vikas Rastogi</p>
                <p><strong>Email:</strong> grievance-officer@doorstep-pro.in</p>
                <p><strong>Helpline:</strong> 1800-419-7800 (Mon–Sat, 9 AM – 7 PM)</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            I Understand & Accept
          </button>
        </div>

      </div>
    </div>
  );
}
