import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiStar, FiArrowLeft, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * RatingReview page — star rating + comment form for a completed booking.
 * Route: /review/:bookingId
 */
export default function RatingReview() {
  const { bookingId } = useParams();
  const navigate      = useNavigate();

  const [rating, setRating]       = useState(0);
  const [hovered, setHovered]     = useState(0);
  const [comment, setComment]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/reviews', { booking_id: bookingId, rating, comment });
      setSubmitted(true);
      toast.success('Review submitted! Thank you.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success State ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="container-app py-24 max-w-lg mx-auto text-center animate-fade-in">
        <div className="card">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} className="text-yellow-500" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-500 mb-6">
            Your {rating}-star review has been submitted. It helps other customers find great professionals.
          </p>
          {/* Show submitted stars */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={28}
                className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
            ))}
          </div>
          <Link to="/" className="btn-primary w-full justify-center">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-10 max-w-lg mx-auto animate-fade-in">
      <Link to="/" className="btn-ghost mb-6 inline-flex">
        <FiArrowLeft /> Back to Home
      </Link>

      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiStar size={32} className="text-yellow-500" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-1">Rate Your Experience</h1>
          <p className="text-gray-500 text-sm">Your feedback helps us maintain service quality</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Star Selector ─────────────────────────────────────────────── */}
          <div className="text-center">
            <p className="label text-center mb-3">How was the service?</p>
            <div
              className="flex justify-center gap-2 mb-2"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  id={`star-${star}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} stars`}
                >
                  <FiStar
                    size={40}
                    className={`transition-colors duration-100 ${
                      star <= (hovered || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {/* Label */}
            <p className={`text-sm font-semibold transition-opacity duration-200 ${
              hovered || rating ? 'opacity-100 text-yellow-600' : 'opacity-0'
            }`}>
              {LABELS[hovered || rating]}
            </p>
          </div>

          {/* ── Comment ───────────────────────────────────────────────────── */}
          <div>
            <label htmlFor="review-comment" className="label flex items-center gap-1">
              <FiMessageSquare size={14}/> Your Review
            </label>
            <textarea
              id="review-comment"
              rows={4}
              className="input resize-none"
              placeholder="Tell us about your experience — what went well, what could be improved..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
            <p className="text-right text-xs text-gray-400 mt-1">{comment.length}/500</p>
          </div>

          {/* Rating preview */}
          {rating > 0 && (
            <div className="bg-yellow-50 rounded-xl p-4 text-center text-sm text-yellow-700 animate-fade-in">
              You're giving <strong>{rating} out of 5 stars</strong> · &ldquo;{LABELS[rating]}&rdquo;
            </div>
          )}

          {/* Submit */}
          <button
            id="submit-review-btn"
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
