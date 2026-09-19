import React, { useState } from 'react';
import {
  X, AlertTriangle, ShieldCheck, Send, Store, User, Phone,
  MapPin, CheckCircle2, FileText, Sparkles, Scale, AlertOctagon
} from 'lucide-react';
import { InspectionResult } from '../../types/inspection';
import { DiscrepancyCategory } from '../../types/complaint';
import { complaintService } from '../../services/complaintService';
import { useLanguage } from '../../context/LanguageContext';

interface FileComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: {
    id: string;
    result: InspectionResult;
    metadata: {
      productName: string;
      productCategory: string;
      imageUrl?: string;
      location?: string;
      establishmentName?: string;
    };
  };
  onSuccess?: (complaintId: string) => void;
}

export const FileComplaintModal: React.FC<FileComplaintModalProps> = ({
  isOpen,
  onClose,
  inspection,
  onSuccess,
}) => {
  const { lang } = useLanguage();
  const { result, metadata } = inspection;

  const defaultDiscrepancy: DiscrepancyCategory = result.pricing.isDiscrepancy
    ? 'OVERCHARGING_MRP'
    : 'MISSING_MANDATORY_DECLARATIONS';

  const [complainantName, setComplainantName] = useState('Citizen Consumer');
  const [complainantPhone, setComplainantPhone] = useState('+91 98765 43210');
  const [complainantEmail, setComplainantEmail] = useState('');
  const [complainantLocation, setComplainantLocation] = useState(metadata.location || 'New Delhi, Delhi - 110001');

  const [storeName, setStoreName] = useState(metadata.establishmentName || 'Local Retail Outlet / Supermarket');
  const [storeAddress, setStoreAddress] = useState(metadata.location || 'Main Market Road, City Centre');
  const [discrepancyType, setDiscrepancyType] = useState<DiscrepancyCategory>(defaultDiscrepancy);
  const [chargedAmount, setChargedAmount] = useState<string>(
    result.pricing.isDiscrepancy ? (result.pricing.mrpAmount + 10).toString() : ''
  );
  const [description, setDescription] = useState(
    result.pricing.isDiscrepancy
      ? `Vendor charged excess price over printed MRP (₹${result.pricing.mrpAmount}). Violation of Legal Metrology (Packaged Commodities) Rules, 2011.`
      : `Mandatory packaging declarations violated under Rule 6 of Legal Metrology (PC) Rules: ${result.findings.map(f => f.title).join('; ')}`
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filedComplaintId, setFiledComplaintId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = complaintService.fileComplaint({
        inspectionId: inspection.id,
        complainantName: complainantName.trim() || 'Citizen Consumer',
        complainantPhone: complainantPhone.trim(),
        complainantEmail: complainantEmail.trim() || undefined,
        complainantLocation: complainantLocation.trim(),
        storeName: storeName.trim(),
        storeAddress: storeAddress.trim(),
        productName: metadata.productName,
        productCategory: (metadata.productCategory as any) || 'FOOD',
        mrpAmount: result.pricing.mrpAmount,
        chargedAmount: chargedAmount ? parseFloat(chargedAmount) : undefined,
        discrepancyType,
        description: description.trim(),
        proofImageUrl: metadata.imageUrl,
      });

      setIsSubmitting(false);
      setFiledComplaintId(created.id);
      if (onSuccess) onSuccess(created.id);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden my-auto max-h-[92vh] flex flex-col">

        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-900 via-indigo-950 to-slate-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>{lang === 'hi' ? 'विधिक मापविज्ञान अधिकारी को शिकायत' : 'File Official Grievance with Officer'}</span>
              </h2>
              <p className="text-[10px] text-rose-200 font-medium">
                {lang === 'hi' ? 'सीधे क्षेत्रीय प्रवर्तन अधिकारी डेस्क पर दर्ज होगी' : 'Directly routed to Jurisdictional Enforcement Officer Desk'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {filedComplaintId ? (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20 border border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Grievance Docket Registered
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'शिकायत सफलतापूर्वक दर्ज की गई!' : 'Grievance Successfully Filed!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {lang === 'hi'
                    ? 'आपकी शिकायत विधिक मापविज्ञान अधिकारी पोर्टल के इनबॉक्स में भेज दी गई है।'
                    : 'Your grievance has been routed to the Legal Metrology Enforcement Portal. The assigned officer will review the evidence and issue a statutory notice.'}
                </p>
              </div>

              {/* Docket ID Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">{lang === 'hi' ? 'डॉकेट संख्या:' : 'Docket Reference:'}</span>
                  <span className="font-mono font-black text-indigo-700 text-sm bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {filedComplaintId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">{lang === 'hi' ? 'उत्पाद:' : 'Product:'}</span>
                  <span className="font-bold text-slate-800 truncate max-w-[180px]">{metadata.productName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">{lang === 'hi' ? 'स्थिति:' : 'Status:'}</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                    PENDING OFFICER REVIEW
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/25 cursor-pointer btn-press"
              >
                {lang === 'hi' ? 'बंद करें' : 'Done / Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Info Banner */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                    {lang === 'hi' ? 'सत्यापित उत्पाद' : 'Scanned Commodity'}
                  </div>
                  <div className="text-xs font-black text-slate-900 truncate">{metadata.productName}</div>
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                    MRP: ₹{result.pricing.mrpAmount.toFixed(2)} • {result.pricing.netQuantityValue}{result.pricing.netQuantityUnit}
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-[10px] font-black shrink-0">
                  {lang === 'hi' ? 'कानूनी साक्ष्य संलग्न' : 'Evidence Attached'}
                </span>
              </div>

              {/* Retailer / Store Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Store className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{lang === 'hi' ? 'दुकान / विक्रेता की जानकारी' : 'Retailer / Store Details'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      {lang === 'hi' ? 'दुकान / मॉल का नाम *' : 'Store / Seller Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={e => setStoreName(e.target.value)}
                      placeholder="e.g. Sharma Supermart / Platform Stall"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      {lang === 'hi' ? 'दुकान का पता / स्थान *' : 'Store Address / Location *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={storeAddress}
                      onChange={e => setStoreAddress(e.target.value)}
                      placeholder="e.g. Stall 4, Railway Station, New Delhi"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>
              </div>

              {/* Discrepancy Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase block">
                  {lang === 'hi' ? 'उल्लंघन का प्रकार *' : 'Violation Category *'}
                </label>
                <select
                  value={discrepancyType}
                  onChange={e => setDiscrepancyType(e.target.value as DiscrepancyCategory)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="OVERCHARGING_MRP">Overcharging Above Printed MRP (MRP से अधिक वसूली)</option>
                  <option value="MISSING_USP">Missing Unit Sale Price (USP दर अनुपस्थित)</option>
                  <option value="EXPIRY_DEFECT">Expired or Date Defect (एक्सपायरी या तारीख दोष)</option>
                  <option value="NET_QTY_SHORTAGE">Net Quantity Shortage (मात्रा / वजन में कमी)</option>
                  <option value="MISSING_MANDATORY_DECLARATIONS">Missing Statutory Declarations (अनिवार्य घोषणाओं का अभाव)</option>
                  <option value="DECEPTIVE_PACKAGING">Deceptive / Misleading Packaging (भ्रामक पैकेजिंग)</option>
                  <option value="OTHER">Other LMPC Violation (अन्य विधिक मापविज्ञान उल्लंघन)</option>
                </select>
              </div>

              {/* Overcharge Amount (if applicable) */}
              {discrepancyType === 'OVERCHARGING_MRP' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-semibold">{lang === 'hi' ? 'मुद्रित MRP:' : 'Printed MRP:'}</span>
                    <span className="font-mono font-bold text-slate-900">₹{result.pricing.mrpAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-rose-800 uppercase block mb-1">
                      {lang === 'hi' ? 'विक्रेता द्वारा वसूली गई राशि (₹) *' : 'Actual Charged Price by Seller (₹) *'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={chargedAmount}
                      onChange={e => setChargedAmount(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs text-rose-950 font-black focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  {lang === 'hi' ? 'शिकायत का विवरण *' : 'Grievance Description *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Complainant Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {lang === 'hi' ? 'शिकायतकर्ता का नाम' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    value={complainantName}
                    onChange={e => setComplainantName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={complainantPhone}
                    onChange={e => setComplainantPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/25 flex items-center gap-1.5 cursor-pointer btn-press"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (lang === 'hi' ? 'दर्ज हो रहा है...' : 'Submitting...') : (lang === 'hi' ? 'अधिकारी को शिकायत भेजें' : 'Submit to Legal Metrology Officer')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
