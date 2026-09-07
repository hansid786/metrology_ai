import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Wrench, 
  Building2, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function WorkerVerificationQueue({ workers, onApproveWorker, onRejectWorker }) {
  const pendingWorkers = workers.filter(w => w.verificationStatus === 'pending_review');
  const verifiedWorkers = workers.filter(w => w.verificationStatus === 'verified');
  
  const [selectedWorker, setSelectedWorker] = useState(pendingWorkers[0] || workers[0]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'verified_log'

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs my-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Cooperative Peer Verification Desk</h2>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              {pendingWorkers.length} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Decentralized verification by Ward Guild Stewards. Validates trade certificates, Aadhaar KYC, and peer vouching.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Queue ({pendingWorkers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('verified_log')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'verified_log'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Registry ({verifiedWorkers.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        pendingWorkers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">All Worker Verifications Complete!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              All self-registered workers have been verified by their respective ward guild stewards.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Pending List */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Guild Endorsement</h4>
              {pendingWorkers.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedWorker?.id === worker.id
                      ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{worker.name}</h4>
                      <p className="text-xs font-semibold text-emerald-700">{worker.trade}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{worker.locality}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                    Review
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column: Detailed Review & Approval Canvas */}
            {selectedWorker && (
              <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedWorker.avatar}
                        alt={selectedWorker.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900">{selectedWorker.name}</h3>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                            New Applicant
                          </span>
                        </div>
                        <p className="text-xs font-bold text-emerald-800">{selectedWorker.trade}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{selectedWorker.locality}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-slate-400 block">Proposed Rate</span>
                      <span className="font-extrabold text-slate-900 text-sm font-mono">₹{selectedWorker.baseRate}</span>
                      <span className="text-[10px] text-slate-500 block">{selectedWorker.rateType}</span>
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Verification Dossier</h4>
                    
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="font-bold text-slate-800">Govt ID & Skill Cert:</span>
                          <span className="text-slate-600 ml-1">{selectedWorker.kycType}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        Uploaded
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        <div>
                          <span className="font-bold text-slate-800">Assigned Guild Chapter:</span>
                          <span className="text-slate-600 ml-1">{selectedWorker.coopUnit}</span>
                        </div>
                      </div>
                      <span className="font-mono text-slate-600 font-semibold text-[11px]">
                        {selectedWorker.unionRegNo}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <Wrench className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="font-bold text-slate-800">Verified Equipment Toolkit:</span>
                          <span className="text-slate-600 ml-1">{selectedWorker.toolsOwned.join(', ')}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        Inspected
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-800 block mb-1">Declared Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedWorker.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval Actions */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
                  <button
                    onClick={() => onApproveWorker(selectedWorker.id)}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Grant Verified Badge</span>
                  </button>

                  <button
                    onClick={() => onRejectWorker(selectedWorker.id)}
                    className="bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <span>Request More Info</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )
      ) : (
        /* Verified Registry Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Worker Name</th>
                <th className="p-3">Trade</th>
                <th className="p-3">Guild Reg No</th>
                <th className="p-3">Locality</th>
                <th className="p-3">Vouched By</th>
                <th className="p-3">Completed Jobs</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifiedWorkers.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <img src={w.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                    <span>{w.name}</span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-800">{w.trade}</td>
                  <td className="p-3 font-mono text-slate-600">{w.unionRegNo}</td>
                  <td className="p-3 text-slate-600">{w.locality}</td>
                  <td className="p-3 text-slate-500">{w.vouchedBy}</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{w.completedJobs}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      Active & Endorsed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
