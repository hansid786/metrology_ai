import React, { useState } from 'react';
import { Star, CheckCircle2, X } from 'lucide-react';
import { submitBookingRating } from '../../services/hommieState';

export default function HommieRatingModal({ isOpen, onClose, booking, onSubmitSuccess }) {
  const [rating, setRating] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [quality, setQuality] = useState(5);
  const [behavior, setBehavior] = useState(5);
  const [pricing, setPricing] = useState(5);
  const [comment, setComment] = useState('Punctual, honest diagnosis, and clean workmanship. Highly recommended!');

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    submitBookingRating(booking.id, {
      rating,
      criteria: { punctuality, quality, behavior, pricing },
      comment
    });

    onSubmitSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Rate Service Experience</h3>
            <p className="text-xs text-slate-500">How was {booking.workerName}'s service?</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Main 5-Star Selector */}
          <div className="text-center py-2">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700 block mt-2">
              {rating === 5 ? 'Outstanding (5.0)' : rating === 4 ? 'Very Good (4.0)' : rating === 3 ? 'Average (3.0)' : 'Poor'}
            </span>
          </div>

          {/* Criteria Sliders / Buttons */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Punctuality:</span>
              <span className="font-bold text-slate-900">{punctuality} / 5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Work Quality & Tools:</span>
              <span className="font-bold text-slate-900">{quality} / 5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Professional Behavior:</span>
              <span className="font-bold text-slate-900">{behavior} / 5</span>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="text-xs font-bold text-slate-700">Detailed Review (Public)</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-amber-400 transition shadow-md"
          >
            Submit Verified Review
          </button>
        </form>
      </div>
    </div>
  );
}