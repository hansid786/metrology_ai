import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Award,
  Phone,
  MessageSquare,
  ChevronLeft,
  Calendar,
  Share2,
  AlertTriangle,
  FileCheck,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { getProfessionalById, getCategories } from '../../services/hommieState';

export default function ProfessionalPublicProfileView({
  proId,
  onBack,
  onOpenBookingModal,
  onOpenSafetyReport
}) {
  const [copied, setCopied] = useState(false);
  const pro = getProfessionalById(proId);
  const categories = getCategories();

  if (!pro) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md">
          <h2 className="text-lg font-bold text-slate-900">Professional Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">The profile you requested is not active or has been moved.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-16">
      {/* Top Breadcrumb Nav */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to search</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Profile'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="relative shrink-0">
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-white shadow-md"
                  />
                  {pro.verifications?.hommieVerified && (
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm flex items-center gap-1 border-2 border-white">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                      {pro.name}
                    </h1>
                    {pro.availableNow && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        Available Now ({pro.earliestArrivalMins || 20}m)
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-amber-700 mt-1">{pro.trade}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{pro.headline}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-900 font-bold border border-amber-200/60">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{pro.ratingAvg.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({pro.ratingCount} reviews)</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pro.experienceYears} Years Experience</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pro.primaryLocality}, {pro.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About the Professional</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {pro.about}
                </p>
              </div>

              {/* Languages & Coverage */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Languages:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {pro.languages?.map((lang) => (
                      <span key={lang} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Serving Localities:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {pro.serviceLocalities?.map((loc) => (
                      <span key={loc} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Verification Trust Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">HOMMIE Trust & Safety Checks</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Aadhaar / Government ID Verified</h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">Government ID confirmed via UIDAI registry check</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Criminal Background Check</h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">No police records or active safety violations</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Skill & Trade Experience Verified</h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">Prior work history and trade credentials vetted</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Local Residential Address Verified</h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">Physical address and neighborhood residence validated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Standardized Rate Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Standard Service Rate Card</h3>
                  <p className="text-xs text-slate-500">Transparent pricing. No hidden fees or sudden surge charges.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  Inspection: ₹{pro.inspectionFee || 149}
                </span>
              </div>

              <div className="space-y-3">
                {pro.rateCard?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.service}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Est. Time: {item.estimatedTime} • Warranty: {item.warranty}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-slate-950">₹{item.price}</span>
                      <p className="text-[10px] text-slate-400 capitalize">{item.pricingType}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Portfolio Photos */}
            {pro.portfolio && pro.portfolio.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4">Recent Verified Work Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pro.portfolio.map((img, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                      <img
                        src={img}
                        alt={`Work sample ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Customer Reviews */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Verified Customer Reviews</h3>
                  <p className="text-xs text-slate-500">From completed HOMMIE jobs only</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-extrabold text-slate-900">{pro.ratingAvg.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
              </div>

              {pro.reviews && pro.reviews.length > 0 ? (
                <div className="space-y-4">
                  {pro.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                            {rev.customerName?.charAt(0)}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{rev.customerName}</h4>
                            <p className="text-[10px] text-slate-500">{rev.locality} • {rev.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      <div className="mt-2 text-[10px] font-semibold text-slate-500">
                        Service: {rev.serviceRendered}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No reviews yet for this professional.</p>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-lg space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Book Professional</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-950">₹{pro.baseRate}</span>
                  <span className="text-xs text-slate-500">starting price</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Diagnostic visit fee: <strong>₹{pro.inspectionFee || 149}</strong> (adjusted against final quote if service is taken).
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onOpenBookingModal(pro)}
                  className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Service Visit</span>
                </button>

                {pro.availableNow && (
                  <button
                    onClick={() => onOpenBookingModal(pro, { urgent: true })}
                    className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Instant Urgent Visit (~{pro.earliestArrivalMins || 20}m)</span>
                  </button>
                )}
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 space-y-2 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>HOMMIE 30-Day Cover</span>
                </div>
                <p className="text-[11px] text-amber-900">
                  Fixed pricing, guaranteed rework protection, and verified identity technician.
                </p>
              </div>

              {/* Safety Escalation */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => onOpenSafetyReport({ proId: pro.id, proName: pro.name })}
                  className="text-[11px] font-semibold text-slate-400 hover:text-red-600 inline-flex items-center gap-1 transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report safety or profile concern</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
