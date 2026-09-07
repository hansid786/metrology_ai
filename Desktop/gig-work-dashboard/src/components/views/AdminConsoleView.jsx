import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  MapPin,
  TrendingUp,
  DollarSign,
  Activity,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Search,
  Eye,
  RefreshCw,
  Zap
} from 'lucide-react';
import {
  getProfessionals,
  getBookings,
  getCities,
  getCategories,
  getAuditLogs,
  getSafetyReports,
  updateKycStatus,
  toggleLocalityStatus,
  advanceBookingStatus,
  subscribeHommieState
} from '../../services/hommieState';

export default function AdminConsoleView() {
  const [pros, setPros] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [safetyReports, setSafetyReports] = useState([]);
  const [activeTab, setActiveTab] = useState('kyc'); // kyc, coverage, bookings, safety, audit

  const refreshData = () => {
    setPros(getProfessionals());
    setBookings(getBookings());
    setCities(getCities());
    setCategories(getCategories());
    setAuditLogs(getAuditLogs());
    setSafetyReports(getSafetyReports());
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeHommieState(refreshData);
    return unsub;
  }, []);

  // Pro KYC actions
  const handleApproveKyc = (proId) => {
    updateKycStatus(proId, 'verified', 'Admin Operator');
  };

  const handleRejectKyc = (proId) => {
    updateKycStatus(proId, 'rejected', 'Admin Operator');
  };

  // Metrics
  const pendingKycPros = pros.filter((p) => p.kycStatus === 'pending_verification');
  const activeBookings = bookings.filter((b) => !['completed', 'cancelled_by_customer', 'cancelled_by_pro'].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const platformRevenue = completedBookings.length * 30; // ₹15 platform + ₹15 safety fee
  const totalGmv = completedBookings.reduce((sum, b) => sum + (b.pricingSummary?.finalAmount || b.servicePrice || 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">HOMMIE Operations Console</h1>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                  INTERNAL OPS
                </span>
              </div>
              <p className="text-xs text-slate-400">Hyperlocal supply KYC, locality serviceability matrix, live booking monitor & safety governance</p>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('kyc')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'kyc' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>KYC Queue ({pendingKycPros.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coverage')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'coverage' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Locality Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'bookings' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Bookings Monitor ({activeBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'safety' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Safety Queue ({safetyReports.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                activeTab === 'audit' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Gross Merchandise Value (GMV)</span>
            <div className="text-2xl font-extrabold text-white mt-1">₹{totalGmv.toLocaleString()}</div>
            <p className="text-[10px] text-emerald-400 mt-1">100% direct pro payouts</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Platform & Safety Fee Retained</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">₹{platformRevenue}</div>
            <p className="text-[10px] text-slate-400 mt-1">Fixed ₹30 / completed order</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Technicians Live</span>
            <div className="text-2xl font-extrabold text-white mt-1">{pros.filter((p) => p.kycStatus === 'verified').length} Pros</div>
            <p className="text-[10px] text-slate-400 mt-1">{pendingKycPros.length} awaiting verification</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active In-Flight Orders</span>
            <div className="text-2xl font-extrabold text-sky-400 mt-1">{activeBookings.length} Orders</div>
            <p className="text-[10px] text-slate-400 mt-1">{completedBookings.length} completed all-time</p>
          </div>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab 1: KYC Approvals */}
        {activeTab === 'kyc' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div>
                <h3 className="text-base font-bold text-white">Technician KYC & Identity Verification Queue</h3>
                <p className="text-xs text-slate-400">Review Aadhaar cards, police clearances, and trade credentials before approving pro visibility</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                {pendingKycPros.length} Pending Actions
              </span>
            </div>

            {pros.map((pro) => (
              <div
                key={pro.id}
                className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{pro.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        pro.kycStatus === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : pro.kycStatus === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {pro.kycStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5">{pro.trade} • {pro.primaryLocality}, {pro.city}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      Phone: {pro.phone} | UPI: {pro.payoutBank?.upiId || 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {pro.kycStatus !== 'verified' && (
                    <button
                      onClick={() => handleApproveKyc(pro.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve KYC</span>
                    </button>
                  )}

                  {pro.kycStatus !== 'rejected' && (
                    <button
                      onClick={() => handleRejectKyc(pro.id)}
                      className="px-4 py-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-600/40 font-bold text-xs hover:bg-rose-600/30 transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Coverage Matrix */}
        {activeTab === 'coverage' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Hyperlocal Locality Coverage Matrix</h3>
              <p className="text-xs text-slate-400">Toggle live dispatch zones and active service categories per sector</p>
            </div>

            {cities.map((city) => (
              <div key={city.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-sm">{city.name}, {city.state}</h4>
                  <span className="text-xs text-slate-400">{city.localities.length} Localities Configured</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {city.localities.map((loc) => (
                    <div
                      key={loc.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{loc.name}</span>
                          <span className="text-[10px] text-slate-500">({loc.pincode})</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {loc.supportedCategories?.length || 0} Categories Live
                        </p>
                      </div>

                      <button
                        onClick={() => toggleLocalityStatus(city.id, loc.id, !loc.active)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          loc.active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {loc.active ? 'ACTIVE' : 'PAUSED'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Bookings Monitor */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">Live Booking Lifecycle Monitor</h3>
              <span className="text-xs text-slate-400">{bookings.length} Total Registered Bookings</span>
            </div>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">{b.bookingRef}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-[10px] font-bold uppercase">
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{b.serviceTitle}</h4>
                    <p className="text-slate-400">
                      Customer: {b.customerName} ({b.customerPhone}) • Pro: {b.workerName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-extrabold text-sm text-white">₹{b.pricingSummary?.finalAmount || b.servicePrice}</span>
                      <p className="text-[10px] text-slate-400">Payment: {b.payment?.status || 'Pending'}</p>
                    </div>

                    {b.status !== 'completed' && (
                      <button
                        onClick={() => advanceBookingStatus(b.id, 'completed', { actor: 'Admin Override' })}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
                      >
                        Force Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Safety Reports */}
        {activeTab === 'safety' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Safety & Dispute Escalations Queue</h3>
            {safetyReports.length === 0 ? (
              <div className="p-8 text-center bg-slate-800 rounded-2xl border border-slate-700 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span>Zero pending safety escalations. All sectors operating safely.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {safetyReports.map((report) => (
                  <div key={report.id} className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300 uppercase">{report.category} • Incident #{report.id}</span>
                      <span className="text-slate-400">{report.timestamp}</span>
                    </div>
                    <p className="text-white font-medium">"{report.description}"</p>
                    <div className="text-slate-400">
                      Reported by: {report.reporterName} ({report.reporterPhone})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Audit Log */}
        {activeTab === 'audit' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">System Audit Trail & State Transitions</h3>
            <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <span className="text-amber-400 font-bold shrink-0">[{log.actor}]</span>
                  <span className="text-slate-200 font-semibold shrink-0">{log.action}:</span>
                  <span className="text-slate-400">{log.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
