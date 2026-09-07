import React, { useState } from 'react';
import {
  Zap,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';
import { createBooking, getCategories, getActiveLocality, getActiveCity } from '../../services/hommieState';

export default function HommieBookingModal({
  isOpen,
  onClose,
  pro,
  initialUrgent = false,
  onBookingSuccess
}) {
  const [bookingMode, setBookingMode] = useState(initialUrgent ? 'instant' : 'scheduled');
  const [selectedService, setSelectedService] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('Tomorrow');
  const [scheduledSlot, setScheduledSlot] = useState('10:00 AM - 12:00 PM');
  const [flatNumber, setFlatNumber] = useState('Flat 302, Palm Heights');
  const [street, setStreet] = useState('12th Main Road, 4th Cross');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !pro) return null;

  const activeLocality = getActiveLocality();
  const activeCity = getActiveCity();
  const categories = getCategories();
  const category = categories.find((c) => pro.categoryIds?.includes(c.id)) || categories[0];

  const inspectionFee = pro.inspectionFee || category.inspectionFee || 149;
  const servicePrice = selectedService ? selectedService.price : pro.baseRate || 499;
  const platformFee = 15;
  const safetyFee = 15;
  const totalAmount = (bookingMode === 'instant' ? inspectionFee : servicePrice) + platformFee + safetyFee;

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking = createBooking({
        workerId: pro.id,
        categoryId: category.id,
        serviceTitle: selectedService ? selectedService.service : `${category.name} Inspection & Repair`,
        servicePrice: bookingMode === 'instant' ? inspectionFee : servicePrice,
        bookingType: bookingMode,
        scheduledDate: bookingMode === 'instant' ? 'Today' : scheduledDate,
        scheduledTimeSlot: bookingMode === 'instant' ? `Within ${pro.earliestArrivalMins || 20} mins` : scheduledSlot,
        urgencyLevel: bookingMode === 'instant' ? 'urgent' : 'standard',
        notes: specialNotes,
        address: {
          flatNo: flatNumber,
          street: street,
          locality: activeLocality?.name || pro.primaryLocality,
          city: activeCity?.name || pro.city,
          formattedAddress: `${flatNumber}, ${street}, ${activeLocality?.name || pro.primaryLocality}, ${activeCity?.name || pro.city}`
        }
      });

      setIsSubmitting(false);
      onBookingSuccess(newBooking);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={pro.avatar}
              alt={pro.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-slate-900 text-base">{pro.name}</h3>
                <span title="Verified Pro">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </span>
              </div>
              <p className="text-xs text-slate-500">{pro.trade}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitBooking} className="mt-5 space-y-5">
          {/* Mode Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Dispatch Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBookingMode('instant')}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  bookingMode === 'instant'
                    ? 'border-amber-500 bg-amber-50/70 text-slate-950 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-xs sm:text-sm">Instant Urgent</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Arrives in ~{pro.earliestArrivalMins || 20}m • Diagnostic first
                </p>
              </button>

              <button
                type="button"
                onClick={() => setBookingMode('scheduled')}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  bookingMode === 'scheduled'
                    ? 'border-amber-500 bg-amber-50/70 text-slate-950 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-slate-800" />
                  <span className="font-bold text-xs sm:text-sm">Schedule Visit</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pick preferred day & 2-hour arrival window
                </p>
              </button>
            </div>
          </div>

          {/* Scheduled Date & Slot Picker (if scheduled) */}
          {bookingMode === 'scheduled' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                <select
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Day After Tomorrow">Day After Tomorrow</option>
                  <option value="This Weekend">This Weekend</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Time Window</label>
                <select
                  value={scheduledSlot}
                  onChange={(e) => setScheduledSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>
          )}

          {/* Address Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Service Address
              </label>
              <span className="text-[11px] text-amber-700 font-semibold">
                {activeLocality?.name || 'Indiranagar'}, {activeCity?.name || 'Bengaluru'}
              </span>
            </div>

            <input
              type="text"
              required
              placeholder="House / Flat No., Apartment Name *"
              value={flatNumber}
              onChange={(e) => setFlatNumber(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
            />

            <input
              type="text"
              required
              placeholder="Street / Landmark *"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
            />

            <input
              type="text"
              placeholder="Optional notes: e.g. Ring bell twice, dog at home"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Pricing Breakdown Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{bookingMode === 'instant' ? 'Diagnostic / Inspection Visit Fee:' : 'Estimated Service Starting:'}</span>
              <span className="font-semibold text-slate-900">₹{bookingMode === 'instant' ? inspectionFee : servicePrice}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Fee:</span>
              <span className="font-semibold text-slate-900">₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>HOMMIE 30-Day Guarantee Cover:</span>
              <span className="font-semibold text-slate-900">₹{safetyFee}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-950 font-bold text-sm">
              <span>Initial Amount:</span>
              <span className="text-amber-700">₹{totalAmount}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              * Pay only after pro arrives and service is delivered. Diagnostic fee waived if major repair is approved.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-amber-400 transition shadow-md flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Confirming Dispatch...' : 'Confirm Booking'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}