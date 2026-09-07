import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Coins, 
  CalendarCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  Eye,
  Check,
  X,
  TrendingUp,
  Building2,
  FolderPlus,
  Plus,
  Trash2,
  AlertTriangle,
  Flag,
  Percent,
  Layers
} from 'lucide-react';
import { 
  apiGetAdminAnalytics, 
  apiGetVerifications, 
  apiReviewVerification, 
  apiGetBookings, 
  apiGetCategories, 
  apiAddCategory, 
  apiDeleteCategory, 
  apiGetDisputes, 
  apiResolveDispute,
  apiGetReports
} from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

export default function AdminDashboardView() {
  const { showToast } = useNotifications();
  const [analytics, setAnalytics] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' | 'bookings' | 'categories' | 'disputes' | 'reports'
  const [isLoading, setIsLoading] = useState(true);

  // New Category Form State
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCommission, setNewCatCommission] = useState('5');
  const [newCatServiceName, setNewCatServiceName] = useState('');
  const [newCatServicePrice, setNewCatServicePrice] = useState('299');

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [stats, kycList, allBookings, cats, dispList, repList] = await Promise.all([
        apiGetAdminAnalytics(),
        apiGetVerifications(),
        apiGetBookings({ role: 'admin' }),
        apiGetCategories(),
        apiGetDisputes({ role: 'admin' }),
        apiGetReports()
      ]);
      setAnalytics(stats);
      setVerifications(kycList);
      setBookings(allBookings);
      setCategories(cats);
      setDisputes(dispList);
      setReports(repList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReview = async (kycId, decision) => {
    const reason = decision === 'rejected' ? prompt('Enter rejection reason for the worker:') : 'Aadhaar & Trade License verified against official registry.';
    if (decision === 'rejected' && !reason) return;

    const res = await apiReviewVerification(kycId, decision, reason);
    if (res.success) {
      showToast(`Verification record marked as ${decision}.`);
      fetchAdminData();
    }
  };

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const services = newCatServiceName.trim() ? [
      { name: newCatServiceName, basePrice: parseFloat(newCatServicePrice) || 299, duration: '45 mins', desc: 'Standard initial service and checkup' }
    ] : [];

    const res = await apiAddCategory({
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      icon: 'Wrench',
      commissionPct: parseFloat(newCatCommission) || 5,
      services
    });

    if (res.success) {
      showToast(`New category "${newCatName}" added dynamically.`);
      setNewCatName('');
      setNewCatServiceName('');
      setShowAddCatModal(false);
      fetchAdminData();
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Are you sure you want to deactivate and remove this service category?')) return;
    const res = await apiDeleteCategory(catId);
    if (res.success) {
      showToast('Category deactivated.');
      fetchAdminData();
    }
  };

  const handleResolveDisputeAction = async (disputeId, decision) => {
    const note = prompt(decision === 'resolved' ? 'Enter resolution / settlement note:' : 'Enter reason for rejection:');
    if (!note) return;

    const res = await apiResolveDispute(disputeId, decision, note, decision === 'resolved' ? 249 : 0);
    if (res.success) {
      showToast(`Dispute ticket marked as ${decision}.`);
      fetchAdminData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Platform Operations & Control Center</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              Admin Access
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage KYC approvals, categories, disputes, and platform GMV.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs text-emerald-400 font-bold">Network Operational (100%)</span>
        </div>
      </div>

      {/* 4 Key Admin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Merchandise Value (GMV)</span>
          <span className="text-2xl font-black text-slate-900 font-mono block pt-1">
            ₹{analytics?.totalGMV?.toLocaleString() || '14,200'}
          </span>
          <p className="text-xs text-slate-500">{analytics?.totalBookings || 2} Total Dispatches</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Platform Revenue</span>
          <span className="text-2xl font-black text-emerald-800 font-mono block pt-1">
            ₹{analytics?.platformRevenue?.toLocaleString() || '340'}
          </span>
          <p className="text-xs text-emerald-700 font-bold">Transparent ₹10/order fee</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending KYC Verifications</span>
          <span className="text-2xl font-black text-amber-600 font-mono block pt-1">
            {analytics?.pendingVerificationsCount || 0}
          </span>
          <p className="text-xs text-amber-700 font-medium">Requires Operator Action</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Open Disputes</span>
          <span className="text-2xl font-black text-rose-600 font-mono block pt-1">
            {disputes.filter(d => d.status === 'open').length}
          </span>
          <p className="text-xs text-rose-600 font-medium">Escrow Holds Active</p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'kyc'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          KYC Verifications ({verifications.filter(v => v.status === 'pending').length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Dynamic Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'disputes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Dispute Queue ({disputes.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Safety Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          All System Bookings ({bookings.length})
        </button>
      </div>

      {/* Tab 1: KYC Queue */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          {verifications.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              No pending verification requests at this time.
            </div>
          ) : (
            verifications.map((kyc) => (
              <div
                key={kyc.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={kyc.selfieUrl}
                      alt={kyc.workerName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{kyc.workerName}</h3>
                      <p className="text-xs text-slate-500">{kyc.trade} • {kyc.idType} Submitted</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize self-start sm:self-auto ${
                    kyc.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                    kyc.status === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    ● Status: {kyc.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block">1. Government ID Document</span>
                    <a
                      href={kyc.idDocUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>View Attached {kyc.idType}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block">2. Live Face Selfie</span>
                    <a
                      href={kyc.selfieUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Inspect Face Match</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block">3. Trade Skill License</span>
                    <span className="text-emerald-800 font-bold block">✓ ITI Certified Verified</span>
                  </div>
                </div>

                {kyc.adminNotes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Notes:</strong> {kyc.adminNotes}
                  </p>
                )}

                {kyc.status === 'pending' && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      onClick={() => handleReview(kyc.id, 'rejected')}
                      className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject Application
                    </button>

                    <button
                      onClick={() => handleReview(kyc.id, 'verified')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Issue Verified Badge</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Dynamic Category Management */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Configured Service Verticals & Commission</h2>
            <button
              onClick={() => setShowAddCatModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{cat.name}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">Slug: {cat.slug}</span>
                  <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700">
                    <Percent className="w-3.5 h-3.5" />
                    <span>{cat.commissionPct || 5}% Platform Cut</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Category Modal */}
          {showAddCatModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-base">Add New Service Vertical</h3>
                  <button onClick={() => setShowAddCatModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddCategorySubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category Name</label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Solar Panel Cleaning & Maintenance"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Commission % (Kept fair)</label>
                    <input
                      type="number"
                      value={newCatCommission}
                      onChange={(e) => setNewCatCommission(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Initial Service Name</label>
                    <input
                      type="text"
                      value={newCatServiceName}
                      onChange={(e) => setNewCatServiceName(e.target.value)}
                      placeholder="e.g. Standard 3KW Solar Array Jet Wash"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      value={newCatServicePrice}
                      onChange={(e) => setNewCatServicePrice(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddCatModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Save & Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Dispute Queue */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              Zero open dispute claims currently logged.
            </div>
          ) : (
            disputes.map((disp) => (
              <div key={disp.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">DISPUTE #{disp.id} • Order #{disp.bookingRef}</span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{disp.reason}</h3>
                    <p className="text-xs text-slate-500">
                      Filed by: <strong>{disp.raisedByName}</strong> ({disp.raisedByRole}) against <strong>{disp.counterpartyName}</strong>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    disp.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                    disp.status === 'open' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    ● {disp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {disp.description}
                </p>

                {disp.status === 'open' && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleResolveDisputeAction(disp.id, 'rejected')}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Reject Claim
                    </button>
                    <button
                      onClick={() => handleResolveDisputeAction(disp.id, 'resolved')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
                    >
                      Approve & Refund Customer
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Safety Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              No user safety incident reports filed.
            </div>
          ) : (
            reports.map((rep) => (
              <div key={rep.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Safety Flag</span>
                    <h3 className="font-extrabold text-slate-900 text-sm">{rep.reason}</h3>
                    <p className="text-xs text-slate-500">
                      Reported user: <strong>{rep.targetUserName}</strong> by <strong>{rep.reporterName}</strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {rep.status}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {rep.details}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: System Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Ref ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Worker</th>
                <th className="p-3">Service</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">GMV Amount</th>
                <th className="p-3 text-right">Platform Cut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{b.bookingRef}</td>
                  <td className="p-3 font-bold text-slate-800">{b.customerName}</td>
                  <td className="p-3 font-bold text-slate-800">{b.workerName} ({b.workerTrade})</td>
                  <td className="p-3 text-slate-600">{b.serviceTitle}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 capitalize">
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-black text-slate-900">₹{b.finalAmount}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-800">₹{b.platformFee || 10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
