import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  HeartHandshake, 
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { apiSubmitRating } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

export default function TwoWayRatingModal({ 
  booking, 
  reviewerType = 'customer', // 'customer' | 'worker'
  onClose, 
  onRatingSubmitted 
}) {
  const { showToast } = useNotifications();
  const [overall, setOverall] = useState(5);
  const [sub1, setSub1] = useState(5); // Quality (customer) or Behavior (worker)
  const [sub2, setSub2] = useState(5); // Punctuality (customer) or Communication (worker)
  const [sub3, setSub3] = useState(5); // Professionalism (customer) or Payment (worker)
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiSubmitRating({
        bookingId: booking.id,
        reviewerType,
        overall,
        sub1,
        sub2,
        sub3,
        comment: reviewText
      });

      if (res.success) {
        showToast('Thank you! Your verified rating has been submitted.');
        onRatingSubmitted(res.booking);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value, onChange) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 cursor-pointer transition-transform hover:scale-110"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Two-Way Mutual Rating
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              {reviewerType === 'customer'
                ? `Rate ${booking.workerName}`
                : `Rate Customer (${booking.customerName})`}
            </h3>
            <p className="text-xs text-slate-500">Order #{booking.bookingRef} • Completed Job</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Overall Stars */}
          <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-600 font-bold block mb-1.5">Overall Satisfaction</span>
            <div className="flex justify-center">
              {renderStars(overall, setOverall)}
            </div>
            <span className="text-[11px] font-bold text-slate-900 mt-1 block">
              {overall === 5 ? '⭐⭐⭐⭐⭐ Exceptional (5.0)' : `${overall}.0 / 5.0`}
            </span>
          </div>

          {/* Sub Criteria */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">
                {reviewerType === 'customer' ? 'Service Quality & Skill:' : 'Customer Behavior & Respect:'}
              </span>
              {renderStars(sub1, setSub1)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">
                {reviewerType === 'customer' ? 'Punctuality & Arrival Time:' : 'Communication Clarity:'}
              </span>
              {renderStars(sub2, setSub2)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">
                {reviewerType === 'customer' ? 'Professionalism & Cleanliness:' : 'Payment Experience & Promptness:'}
              </span>
              {renderStars(sub3, setSub3)}
            </div>
          </div>

          {/* Review Text */}
          <div className="pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 block mb-1.5">Detailed Review (Visible to Community)</label>
            <textarea
              rows={3}
              required
              placeholder={reviewerType === 'customer' 
                ? 'Describe the worker\'s performance, diagnostics, speed, and honesty...'
                : 'Share your experience with this customer...'}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-slate-900 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Verified Rating</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
