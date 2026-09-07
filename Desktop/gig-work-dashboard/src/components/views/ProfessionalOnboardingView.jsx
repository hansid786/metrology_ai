import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { getCategories, registerNewProfessional } from '../../services/hommieState';

export default function ProfessionalOnboardingView({ onCompleted, onBack }) {
  const [step, setStep] = useState(1);
  const categories = getCategories();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [trade, setTrade] = useState('AC Service & Repair');
  const [selectedCategories, setSelectedCategories] = useState(['ac-service']);
  const [experienceYears, setExperienceYears] = useState(5);
  const [city, setCity] = useState('Bengaluru');
  const [primaryLocality, setPrimaryLocality] = useState('Indiranagar');
  const [baseRate, setBaseRate] = useState(499);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [about, setAbout] = useState('');
  const [submittedPro, setSubmittedPro] = useState(null);

  const handleCategoryToggle = (slug) => {
    if (selectedCategories.includes(slug)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((s) => s !== slug));
      }
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const registered = registerNewProfessional({
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@hommie.pro`,
      trade,
      categoryIds: selectedCategories,
      experienceYears: Number(experienceYears),
      city,
      primaryLocality,
      serviceLocalities: [primaryLocality, 'Koramangala', 'HSR Layout'],
      baseRate: Number(baseRate),
      about: about || `Experienced ${trade} with ${experienceYears} years of work across ${city}.`,
      upiId: upiId || `${phone}@upi`,
      aadhaarNumber
    });

    setSubmittedPro(registered);
    setStep(4); // Success / Under Review step
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
            <Briefcase className="w-3.5 h-3.5" />
            <span>HOMMIE Professional Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Grow Your Independent Trade Business
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Zero commission on your service work. Build direct local customer relationships with guaranteed transparent payouts.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Progress Indicators */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            {[
              { num: 1, label: 'Profile & Trade' },
              { num: 2, label: 'Coverage & Rates' },
              { num: 3, label: 'KYC & Verification' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step === s.num
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </span>
                <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal & Trade Details</h2>
              <p className="text-xs text-slate-500">Provide your legal name and primary specialization</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Full Name (as per Aadhaar / PAN) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Mobile Phone (for OTP & Job Alerts) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Years of Experience in Trade *</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Select Service Categories *</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.slug)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                        selectedCategories.includes(cat.slug)
                          ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Professional Bio & Experience Summary</label>
                <textarea
                  rows={3}
                  placeholder="Mention previous company experience, certifications, brand specializations (e.g. Daikin, Havells, Schneider)..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!name || !phone}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
              >
                <span>Continue to Coverage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Coverage & Rates */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Locality & Pricing Setup</h2>
              <p className="text-xs text-slate-500">Choose the neighborhood where you will accept dispatch visits</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Operating City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Lucknow">Lucknow</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Primary Operating Sector / Locality *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indiranagar, Koramangala, Gomti Nagar"
                    value={primaryLocality}
                    onChange={(e) => setPrimaryLocality(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Starting Base Service Rate (₹) *</label>
                <input
                  type="number"
                  min="99"
                  max="5000"
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Standard diagnostic visit fee will be automatically added as per category standard (₹149 - ₹249).
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">UPI ID for Direct Customer Payouts *</label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shadow-sm inline-flex items-center gap-2"
              >
                <span>Continue to KYC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: KYC Verification */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Identity & Safety Verification (KYC)</h2>
              <p className="text-xs text-slate-500">Every HOMMIE technician is verified before going live to ensure customer safety</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">12-Digit Aadhaar Card Number *</label>
                <input
                  type="text"
                  required
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">Upload Aadhaar Front & Back Photo</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG or PDF up to 5MB (Simulated auto-verified for onboarding)</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>HOMMIE Code of Conduct</span>
                </div>
                <p className="text-[11px] text-amber-900">
                  By submitting, you agree to transparent diagnostic quoting, respectful on-site behavior, and adhering to customer safety guidelines.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-md inline-flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Submit Application for Review</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Submission Received / Pending State */}
        {step === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-300">
              <Clock className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-950">Application Under Verification</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Thank you, <strong>{submittedPro?.name}</strong>! Your application for <strong>{submittedPro?.trade}</strong> in <strong>{submittedPro?.primaryLocality}</strong> has been submitted.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Application Reference:</span>
                <span className="font-mono font-bold text-slate-900">{submittedPro?.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Aadhaar KYC Status:</span>
                <span className="font-bold text-amber-600">Pending Operations Review</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Expected Approval:</span>
                <span className="font-bold text-slate-800">Within 2 to 4 Hours</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => onCompleted?.(submittedPro)}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
              >
                Go to Professional Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
