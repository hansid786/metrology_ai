import React, { useState } from 'react';
import { 
  UserCheck, 
  Coins, 
  ShieldCheck, 
  Wrench, 
  HeartHandshake, 
  QrCode, 
  Phone, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight,
  ToggleLeft,
  ToggleRight,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function WorkerPortalView({ workerUser, workers, onOpenRegisterModal }) {
  const activeWorker = workers.find(w => w.id === workerUser?.id) || workers[0];
  const [isAvailable, setIsAvailable] = useState(activeWorker.status === 'online');

  const recentTransactions = [
    { id: 'TX-9901', customer: 'Pooja Iyer (Koramangala)', job: 'MCB & Switch Board Fix', customerPaid: 500, workerReceived: 475, poolCut: 15, techCut: 10, time: 'Today, 2:15 PM', upiStatus: 'Direct Settled to HDFC UPI' },
    { id: 'TX-9902', customer: 'Deepak V. (HSR Layout)', job: 'Inverter Wiring & Earth Loop', customerPaid: 850, workerReceived: 805, poolCut: 28, techCut: 17, time: 'Yesterday, 5:30 PM', upiStatus: 'Direct Settled to HDFC UPI' },
    { id: 'TX-9903', customer: 'Anita Roy (BTM 2nd Stage)', job: 'Geyser Power Line Fitting', customerPaid: 450, workerReceived: 428, poolCut: 14, techCut: 8, time: '24 Aug, 11:00 AM', upiStatus: 'Direct Settled to HDFC UPI' },
    { id: 'TX-9904', customer: 'Rohan Joshi (Indiranagar)', job: 'Living Room Ceiling Fan & Regulator', customerPaid: 350, workerReceived: 332, poolCut: 11, techCut: 7, time: '22 Aug, 4:00 PM', upiStatus: 'Direct Settled to HDFC UPI' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      
      {/* Worker Persona Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeWorker.avatar}
                alt={activeWorker.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-md"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${isAvailable ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">{activeWorker.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Pro
                </span>
              </div>
              <p className="text-emerald-200 text-xs font-semibold mt-0.5">{activeWorker.trade} • {activeWorker.specialty}</p>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {activeWorker.locality}</span>
                <span className="flex items-center gap-1 font-mono text-emerald-300">Reg: {activeWorker.unionRegNo}</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {activeWorker.rating} ({activeWorker.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Availability & Rate Control */}
          <div className="flex flex-col items-end gap-2 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 w-full md:w-auto">
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <span className="text-xs text-slate-300 font-medium">Availability:</span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isAvailable ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {isAvailable ? '🟢 Online & Ready' : '⚪ Offline'}
              </button>
            </div>
            <div className="text-right w-full">
              <span className="text-[10px] text-slate-400 block">Your Base Rate:</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">₹{activeWorker.baseRate} / visit</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">This Month's Direct UPI</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">₹42,800</div>
          <p className="text-xs text-emerald-800 font-semibold mt-1">100% direct settlement, 0 holdbacks</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Suraksha Health Insurance</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">₹2,00,000</div>
          <p className="text-xs text-blue-700 font-semibold mt-1">Active Family Health Cover</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">0% Tool Microloan</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">₹25,000</div>
          <p className="text-xs text-amber-700 font-semibold mt-1">Pre-approved zero-interest credit</p>
        </div>

      </div>

      {/* Direct Earnings Passbook Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Direct Earnings Passbook (No Commission Deductions)</h2>
            <p className="text-xs text-slate-500">Every customer payment goes directly to your UPI ID.</p>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto">
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>UPI: ramesh.sharma@hdfcbank</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Txn ID & Date</th>
                <th className="p-3">Customer & Job</th>
                <th className="p-3 text-right">Customer Paid</th>
                <th className="p-3 text-right text-emerald-800 font-bold">Your Take-Home (95%)</th>
                <th className="p-3 text-right text-slate-500">Platform Fee (5%)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-800">
                    {tx.id}
                    <span className="text-[10px] text-slate-400 block font-normal">{tx.time}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{tx.customer}</span>
                    <span className="text-slate-500">{tx.job}</span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ₹{tx.customerPaid}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-emerald-800 text-sm">
                    ₹{tx.workerReceived}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-400">
                    ₹{tx.poolCut + tx.techCut}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Direct UPI Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
