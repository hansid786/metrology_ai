import React, { useState } from 'react';
import { 
  Coins, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench, 
  QrCode, 
  ArrowRight, 
  ArrowUpRight, 
  Building2, 
  Check, 
  X, 
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { WORKER_JOB_REQUESTS } from '../data/mockData';

export default function WorkerProductionDashboard({ workerUser, workers, onOpenRateEditor }) {
  const activeWorker = workers.find(w => w.id === workerUser?.id) || workers[0];
  const [isOnline, setIsOnline] = useState(true);
  const [jobRequests, setJobRequests] = useState(WORKER_JOB_REQUESTS);
  const [activeJob, setActiveJob] = useState({
    id: 'JOB-9921',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98450 77123',
    address: 'Flat 304, Green Heights, 5th Cross, Koramangala 4th Block',
    service: 'Main MCB Tripping & Kitchen Socket Line Repair',
    slot: 'Today, 2:00 PM – 3:30 PM',
    distance: '1.2 km away',
    amount: 349,
    netPayout: 329,
    status: 'In Progress' // 'Accepted', 'Arrived', 'In Progress', 'Completed'
  });

  const [walletBalance, setWalletBalance] = useState(4280);
  const [todayEarnings, setTodayEarnings] = useState(1240);

  const handleAcceptRequest = (req) => {
    setActiveJob({
      id: req.id,
      customerName: req.customerName,
      customerPhone: '+91 98100 44219',
      address: req.locality,
      service: req.serviceTitle,
      slot: req.slot,
      distance: req.distance,
      amount: req.customerOffer,
      netPayout: req.workerNetPayout,
      status: 'Accepted'
    });
    setJobRequests(prev => prev.filter(r => r.id !== req.id));
  };

  const handleDeclineRequest = (reqId) => {
    setJobRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleAdvanceJobStatus = () => {
    if (activeJob.status === 'Accepted') {
      setActiveJob(prev => ({ ...prev, status: 'Arrived' }));
    } else if (activeJob.status === 'Arrived') {
      setActiveJob(prev => ({ ...prev, status: 'In Progress' }));
    } else if (activeJob.status === 'In Progress') {
      setActiveJob(prev => ({ ...prev, status: 'Completed' }));
      setTodayEarnings(prev => prev + activeJob.netPayout);
      setWalletBalance(prev => prev + activeJob.netPayout);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Availability Toggle */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={activeWorker.avatar}
              alt={activeWorker.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{activeWorker.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                Verified Pro
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5">{activeWorker.trade} • {activeWorker.coopUnit}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Union ID: {activeWorker.unionRegNo} • Aadhaar Verified</p>
          </div>
        </div>

        {/* Status Switch & Rate Setting */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 self-start md:self-auto">
          <div className="text-right pr-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Duty Status</span>
            <span className="text-xs font-bold text-white">{isOnline ? 'Receiving Jobs' : 'Offline'}</span>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isOnline ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {isOnline ? '🟢 Online' : '⚪ Offline'}
          </button>
        </div>
      </div>

      {/* 3 Real Production Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Earnings Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Earnings</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              95% Kept
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block pt-1">
            ₹{todayEarnings}
          </span>
          <p className="text-xs text-slate-500">Wallet: <strong>₹{walletBalance}</strong> (Auto UPI to HDFC)</p>
        </div>

        {/* Health Insurance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Suraksha Health Cover</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block pt-1">
            ₹2,00,000
          </span>
          <p className="text-xs text-blue-700 font-medium">Active Policy #SK-2026-8812</p>
        </div>

        {/* Rate Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Rate Card</span>
            <span className="text-[10px] text-slate-500 font-mono">Self-Set</span>
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block pt-1">
            ₹{activeWorker.baseRate} <span className="text-xs font-normal text-slate-400">/visit</span>
          </span>
          <p className="text-xs text-slate-500">Service Radius: <strong>8 km</strong> (Koramangala + HSR)</p>
        </div>

      </div>

      {/* Active Ongoing Job Dispatch Stepper */}
      {activeJob && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="font-bold text-slate-900 text-sm">Active Job Dispatch — {activeJob.id}</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {activeJob.status}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800 font-mono">Payout: ₹{activeJob.netPayout}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 text-base">{activeJob.service}</h4>
              <p className="text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeJob.address} ({activeJob.distance})</span>
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Scheduled: <strong>{activeJob.slot}</strong></span>
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2">
              <a
                href={`tel:${activeJob.customerPhone}`}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Customer ({activeJob.customerName})</span>
              </a>

              <button
                onClick={handleAdvanceJobStatus}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {activeJob.status === 'Accepted' && <span>Mark Reached Location</span>}
                {activeJob.status === 'Arrived' && <span>Start Service</span>}
                {activeJob.status === 'In Progress' && <span>Complete & Show Direct UPI QR</span>}
                {activeJob.status === 'Completed' && <span>Job Finished (₹{activeJob.netPayout} Received)</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Incoming Job Requests Radar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Nearby Customer Job Leads</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {jobRequests.length} Leads
              </span>
            </h3>
            <p className="text-xs text-slate-500">Jobs within your 8 km service ward with 95% guaranteed payout.</p>
          </div>
        </div>

        {jobRequests.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
            <p>All active nearby leads accepted!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{req.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-semibold">{req.distance} away</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{req.slot}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{req.serviceTitle}</h4>
                  <p className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Customer in {req.locality}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Net Payout</span>
                    <span className="text-base font-black text-emerald-800 font-mono">₹{req.workerNetPayout}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Pass Lead"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Accept Job</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
