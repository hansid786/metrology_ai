import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox, AlertTriangle, AlertOctagon, CheckCircle2, Clock, Search,
  Filter, Shield, User, Phone, MapPin, Store, FileText, ArrowRight,
  ChevronRight, Sparkles, Send, Download, Scale, X, Check, ShieldAlert
} from 'lucide-react';
import { ConsumerComplaint, ComplaintStatus } from '../types/complaint';
import { complaintService } from '../services/complaintService';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../services/authService';

export const OfficerComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const currentUser = authService.getCurrentUser();

  const [complaints, setComplaints] = useState<ConsumerComplaint[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeComplaint, setActiveComplaint] = useState<ConsumerComplaint | null>(null);

  // Action modal states
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'NOTICE' | 'ASSIGN' | 'RESOLVE' | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');
  const [noticeNumber, setNoticeNumber] = useState<string>('');

  const loadData = () => {
    setComplaints(complaintService.getAll());
  };

  useEffect(() => {
    loadData();
    const handleComplaintFiled = () => loadData();
    window.addEventListener('consumer-complaint-filed', handleComplaintFiled);
    return () => window.removeEventListener('consumer-complaint-filed', handleComplaintFiled);
  }, []);

  const stats = complaintService.getStats();

  const filteredComplaints = complaints.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.id.toLowerCase().includes(term) ||
      c.productName.toLowerCase().includes(term) ||
      c.storeName.toLowerCase().includes(term) ||
      c.complainantName.toLowerCase().includes(term) ||
      c.storeAddress.toLowerCase().includes(term);

    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'PENDING' && (c.status === 'PENDING_REVIEW' || c.status === 'OFFICER_ASSIGNED')) ||
      (selectedStatus === 'NOTICE_ISSUED' && (c.status === 'NOTICE_ISSUED' || c.status === 'SEIZURE_ORDERED')) ||
      (selectedStatus === 'RESOLVED' && c.status === 'RESOLVED');

    return matchesSearch && matchesStatus;
  });

  const handleOpenAction = (c: ConsumerComplaint, type: 'NOTICE' | 'ASSIGN' | 'RESOLVE') => {
    setActiveComplaint(c);
    setActionType(type);
    if (type === 'NOTICE') {
      const year = new Date().getFullYear();
      const code = Math.floor(1000 + Math.random() * 9000);
      setNoticeNumber(`LMO/DEL/SEC18/${year}/${code}`);
      setActionNotes('Statutory Show-Cause Notice issued under Section 18 of the Legal Metrology Act, 2009 for contravention of Packaged Commodities Rules, 2011.');
    } else if (type === 'ASSIGN') {
      setActionNotes(`Assigned to ${currentUser?.name || 'Legal Metrology Officer'} for on-site verification & test purchase.`);
    } else {
      setActionNotes('Grievance compounded under Section 49 / compliance rectified by seller with statutory penalty.');
    }
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!activeComplaint || !actionType) return;

    let nextStatus: ComplaintStatus = 'PENDING_REVIEW';
    if (actionType === 'NOTICE') nextStatus = 'NOTICE_ISSUED';
    if (actionType === 'ASSIGN') nextStatus = 'OFFICER_ASSIGNED';
    if (actionType === 'RESOLVE') nextStatus = 'RESOLVED';

    complaintService.updateStatus(
      activeComplaint.id,
      nextStatus,
      currentUser?.name ? `${currentUser.name} (${currentUser.inspectorId || 'LMO'})` : undefined,
      actionNotes,
      actionType === 'NOTICE' ? noticeNumber : activeComplaint.noticeNumber,
      actionType === 'RESOLVE' ? actionNotes : activeComplaint.resolutionSummary
    );

    setIsActionModalOpen(false);
    setActiveComplaint(null);
    loadData();
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            {lang === 'hi' ? 'लंबित समीक्षा' : 'Pending Review'}
          </span>
        );
      case 'OFFICER_ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            {lang === 'hi' ? 'अधिकारी नियुक्त' : 'Officer Assigned'}
          </span>
        );
      case 'NOTICE_ISSUED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Scale className="w-3 h-3" />
            {lang === 'hi' ? 'धारा 18 नोटिस जारी' : 'Sec 18 Notice Issued'}
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            {lang === 'hi' ? 'निस्तारित' : 'Resolved / Compounded'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getDiscrepancyBadge = (type: string) => {
    switch (type) {
      case 'OVERCHARGING_MRP':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            {lang === 'hi' ? 'MRP से अधिक वसूली' : 'Overcharging MRP'}
          </span>
        );
      case 'MISSING_USP':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            {lang === 'hi' ? 'USP दर अनुपस्थित' : 'Missing USP'}
          </span>
        );
      case 'EXPIRY_DEFECT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
            {lang === 'hi' ? 'तारीख / एक्सपायरी दोष' : 'Expiry / Date Defect'}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
            {lang === 'hi' ? 'वैधानिक घोषणा उल्लंघन' : 'Statutory Declaration Defect'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 page-enter">
      {/* ── Top Header Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-950/20 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-rose-300 text-xs font-black backdrop-blur-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'hi' ? 'उपभोक्ता शिकायत निवारण प्रकोष्ठ' : 'Citizen Grievance & Enforcement Desk'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {lang === 'hi' ? 'उपभोक्ता शिकायतें एवं कानूनी नोटिस' : 'Consumer Complaints & Statutory Enforcement'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
              {lang === 'hi'
                ? 'नागरिकों द्वारा MetrologyLens AI ऐप से भेजी गई एमआरपी विसंगति, ओवरचार्जिंग व गैर-अनुपालन शिकायतें एवं कानूनी नोटिस प्रबंधन।'
                : 'Direct intake of citizen-reported MRP violations, overcharging, and statutory packaging non-compliances under the Legal Metrology Act, 2009.'}
            </p>
          </div>
        </div>

        {/* KPI Counter Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-black text-slate-400 block">{lang === 'hi' ? 'कुल शिकायतें' : 'Total Complaints'}</span>
            <span className="text-xl sm:text-2xl font-black text-white">{stats.total}</span>
          </div>
          <div className="bg-rose-500/10 backdrop-blur-md rounded-2xl p-3 border border-rose-500/20">
            <span className="text-[10px] uppercase font-black text-rose-300 block">{lang === 'hi' ? 'समीक्षा हेतु लंबित' : 'Pending Action'}</span>
            <span className="text-xl sm:text-2xl font-black text-rose-400">{stats.pending}</span>
          </div>
          <div className="bg-indigo-500/10 backdrop-blur-md rounded-2xl p-3 border border-indigo-500/20">
            <span className="text-[10px] uppercase font-black text-indigo-300 block">{lang === 'hi' ? 'जारी धारा 18 नोटिस' : 'Sec 18 Notices'}</span>
            <span className="text-xl sm:text-2xl font-black text-indigo-300">{stats.noticeIssued}</span>
          </div>
          <div className="bg-emerald-500/10 backdrop-blur-md rounded-2xl p-3 border border-emerald-500/20">
            <span className="text-[10px] uppercase font-black text-emerald-300 block">{lang === 'hi' ? 'निस्तारित मामले' : 'Resolved / Compounded'}</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{stats.resolved}</span>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'डॉकेट संख्या, उत्पाद, दुकान का नाम या स्थान खोजें...'
                : 'Search by Docket ID, Product, Store Name, or Location...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', labelEn: 'All (All)', labelHi: 'सभी' },
            { key: 'PENDING', labelEn: 'Pending', labelHi: 'लंबित' },
            { key: 'NOTICE_ISSUED', labelEn: 'Notices', labelHi: 'नोटिस जारी' },
            { key: 'RESOLVED', labelEn: 'Resolved', labelHi: 'निस्तारित' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap btn-press ${
                selectedStatus === tab.key
                  ? 'bg-slate-900 text-white shadow-xs font-black'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {lang === 'hi' ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* ── Complaints Grid / List ── */}
      {filteredComplaints.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
          <Inbox className="w-8 h-8 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">
            {lang === 'hi' ? 'कोई शिकायत नहीं मिली' : 'No grievances match criteria'}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'hi' ? 'फ़िल्टर या खोज शब्द बदल कर पुनः प्रयास करें।' : 'Try adjusting the search keyword or filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4 stagger">
          {filteredComplaints.map(complaint => {
            const isPending = complaint.status === 'PENDING_REVIEW' || complaint.status === 'OFFICER_ASSIGNED';

            return (
              <div
                key={complaint.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                      {complaint.id}
                    </span>
                    {getDiscrepancyBadge(complaint.discrepancyType)}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(complaint.filedAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div>{getStatusBadge(complaint.status)}</div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Column 1: Product & Pricing Evidence */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {lang === 'hi' ? 'उत्पाद एवं मूल्य विवरण' : 'Product & Pricing Data'}
                    </div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">{complaint.productName}</h3>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === 'hi' ? 'मुद्रित MRP:' : 'Printed MRP:'}</span>
                        <span className="font-mono font-black text-slate-800">₹{complaint.mrpAmount?.toFixed(2) || 'N/A'}</span>
                      </div>
                      {complaint.chargedAmount && (
                        <div className="flex justify-between text-rose-700 font-bold">
                          <span>{lang === 'hi' ? 'वसूली गई राशि:' : 'Charged Price:'}</span>
                          <span className="font-mono font-black">₹{complaint.chargedAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {complaint.chargedAmount && complaint.mrpAmount && (
                        <div className="text-[10px] text-rose-600 font-bold text-right">
                          Overcharge: +₹{(complaint.chargedAmount - complaint.mrpAmount).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Retailer & Complainant Details */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {lang === 'hi' ? 'दुकानदार एवं नागरिक जानकारी' : 'Retailer & Citizen Contact'}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start gap-1.5 text-slate-800 font-bold">
                        <Store className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="truncate">{complaint.storeName}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{complaint.storeAddress}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px] pt-1 border-t border-slate-100">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{complaint.complainantName}</span>
                        <span>•</span>
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono font-semibold">{complaint.complainantPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Legal Notes & Officer Action Deck */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {lang === 'hi' ? 'अधिकारी कार्यवाही एवं स्थिति' : 'Enforcement Docket'}
                    </div>

                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2 text-xs">
                      {complaint.noticeNumber && (
                        <div className="text-[10px] font-mono font-bold text-indigo-900">
                          Notice: <span className="underline">{complaint.noticeNumber}</span>
                        </div>
                      )}
                      {complaint.assignedOfficer && (
                        <div className="text-[11px] text-slate-700 font-medium">
                          Officer: <span className="font-bold">{complaint.assignedOfficer}</span>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-600 italic">
                        "{complaint.description}"
                      </p>
                      {complaint.actionNotes && (
                        <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 font-medium">
                          <strong>Action:</strong> {complaint.actionNotes}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => handleOpenAction(complaint, 'NOTICE')}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer btn-press whitespace-nowrap text-center"
                      >
                        {lang === 'hi' ? 'धारा 18 नोटिस जारी करें' : 'Issue Sec 18 Notice'}
                      </button>

                      <button
                        onClick={() => handleOpenAction(complaint, 'RESOLVE')}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold cursor-pointer btn-press whitespace-nowrap"
                      >
                        {lang === 'hi' ? 'निस्तारण' : 'Resolve'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Action Confirmation Modal ── */}
      {isActionModalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-black">
                  {actionType === 'NOTICE' && (lang === 'hi' ? 'धारा 18 वैधानिक नोटिस जारी करें' : 'Issue Section 18 Statutory Notice')}
                  {actionType === 'ASSIGN' && (lang === 'hi' ? 'निरीक्षण अधिकारी नियुक्त करें' : 'Assign Field Inspector')}
                  {actionType === 'RESOLVE' && (lang === 'hi' ? 'शिकायत का निस्तारण दर्ज करें' : 'Record Grievance Resolution')}
                </h3>
              </div>
              <button onClick={() => setIsActionModalOpen(false)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-800">Docket: {activeComplaint.id}</div>
                <div className="text-slate-600">Product: {activeComplaint.productName}</div>
                <div className="text-slate-600">Retailer: {activeComplaint.storeName} ({activeComplaint.storeAddress})</div>
              </div>

              {actionType === 'NOTICE' && (
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Statutory Notice Number
                  </label>
                  <input
                    type="text"
                    value={noticeNumber}
                    onChange={e => setNoticeNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Official Enforcement Remarks / Findings
                </label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-md cursor-pointer btn-press"
                >
                  Confirm & Execute Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
