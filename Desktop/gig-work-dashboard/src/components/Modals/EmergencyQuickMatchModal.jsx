import React, { useState } from 'react';
import { X, Zap, MapPin, ShieldCheck, CheckCircle2, Clock, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function EmergencyQuickMatchModal({ workers, onClose, onSelectWorker }) {
  const { showToast } = useNotifications();
  const [selectedEmergency, setSelectedEmergency] = useState('AC Gas Leak / Severe Breakdown');
  const [searching, setSearching] = useState(false);
  const [matchedWorker, setMatchedWorker] = useState(null);

  const emergencyCategories = [
    { title: 'AC Gas Leak / Severe Breakdown', trade: 'AC Repair', eta: '15-25 mins' },
    { title: 'Burst Pipe / Major Water Leakage', trade: 'Plumbing', eta: '15-20 mins' },
    { title: 'Complete Power / MCB Short Circuit', trade: 'Electrical', eta: '10-20 mins' },
    { title: 'Locked Door / Jammed Mortise Lock', trade: 'Carpentry', eta: '20-30 mins' },
    { title: 'Water Purifier Motor Failure', trade: 'RO & Water Purifier', eta: '25-35 mins' }
  ];

  const handleInstantDispatch = (e) => {
    e.preventDefault();
    setSearching(true);

    setTimeout(() => {
      // Find nearest available worker
      const currentTrade = emergencyCategories.find(c => c.title === selectedEmergency)?.trade || 'AC Repair';
      const available = workers.find(w => w.isAvailableNow && w.trade.toLowerCase().includes(currentTrade.toLowerCase().split(' ')[0])) || workers[0];
      
      setMatchedWorker(available);
      setSearching(false);
      showToast(`⚡ High priority match found: ${available.name} is on standby!`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Need Help Now (Urgent Dispatch)</h3>
              <p className="text-xs text-emerald-200">Matches 🟢 Available Now verified technicians with priority dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {matchedWorker ? (
          <div className="p-6 space-y-5">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <div>
                <span className="text-xs font-black text-emerald-900">Priority Professional Assigned</span>
                <p className="text-[11px] text-emerald-700">Technician is within 2 km radius and ready for immediate arrival.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-center gap-4">
              <img
                src={matchedWorker.avatar}
                alt={matchedWorker.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-slate-900 text-sm">{matchedWorker.name}</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-xs text-slate-500">{matchedWorker.trade} • {matchedWorker.experienceYears}+ yrs exp</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-slate-700">
                  <span className="text-emerald-700">⭐ {matchedWorker.ratingAvg} ({matchedWorker.reviewsCount})</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-slate-500"><MapPin className="w-3 h-3" /> {matchedWorker.distanceKm || '1.4 km'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Emergency Inspection & Visit:</span>
                <span className="font-bold text-slate-900">₹{matchedWorker.baseRate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Arrival Time:</span>
                <span className="font-bold text-emerald-700">15 – 25 Minutes</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectWorker(matchedWorker);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Confirm & Direct Book</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInstantDispatch} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Select Urgent Problem</label>
              <div className="space-y-2">
                {emergencyCategories.map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedEmergency === item.title
                        ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="emergency"
                        value={item.title}
                        checked={selectedEmergency === item.title}
                        onChange={(e) => setSelectedEmergency(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="text-xs font-bold block text-slate-900">{item.title}</span>
                        <span className="text-[10px] text-slate-500">{item.trade}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      ETA {item.eta}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-[11px] text-slate-600">
                Current Location: <strong className="text-slate-900">Gomti Nagar, Lucknow (26.8500° N, 80.9990° E)</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {searching ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Scanning Proximity Radar...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Find Nearest Available Pro</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
