import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings, updateBookingStatus, submitReview } from '../api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import Toast from '../components/Toast';

const STATUS_COLORS = {
  pending:     'bg-yellow-900/50 text-yellow-400',
  confirmed:   'bg-blue-900/50 text-blue-400',
  in_progress: 'bg-violet-900/50 text-violet-400',
  completed:   'bg-emerald-900/50 text-emerald-400',
  cancelled:   'bg-red-900/50 text-red-400',
};

const MOCK_BOOKINGS = [
  { id: 'b1', service: 'Fix kitchen tap', status: 'completed', scheduled_at: new Date(Date.now() - 86400000 * 2).toISOString(), total_price: '130.00', address: '45 Oak Ave', worker_name: 'Alex Rivera', worker_avatar: null, worker_id: 'm1', customer_id: 'u1' },
  { id: 'b2', service: 'Rewire outdoor socket', status: 'confirmed', scheduled_at: new Date(Date.now() + 86400000).toISOString(), total_price: '160.00', address: '12 Elm St', worker_name: 'Priya Sharma', worker_avatar: null, worker_id: 'm2', customer_id: 'u1' },
  { id: 'b3', service: 'Deep clean living room', status: 'pending', scheduled_at: new Date(Date.now() + 86400000 * 3).toISOString(), total_price: '80.00', address: '99 Pine Rd', worker_name: 'Carlos Mendez', worker_avatar: null, worker_id: 'm3', customer_id: 'u1' },
];

function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(booking.id, booking.worker_id, rating, comment);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-white font-bold text-xl mb-1">Leave a Review</h2>
        <p className="text-slate-400 text-sm mb-6">For: <span className="text-slate-200">{booking.service}</span></p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Star picker */}
          <div>
            <label className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-2 block">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className={`text-3xl transition-transform hover:scale-110 ${s <= rating ? 'star-filled' : 'star-empty'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Comment</label>
            <textarea
              id="review-comment"
              className="field resize-none h-24"
              placeholder="Share your experience with this worker…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 glass rounded-lg py-2.5 text-slate-300 font-medium hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" id="submit-review" disabled={loading} className="btn-primary flex-1 py-2.5">
              {loading ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel, onReview, usingMock }) {
  const dateStr = new Date(booking.scheduled_at).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const initials = (booking.worker_name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <article className="glass glass-hover rounded-2xl p-6 flex flex-col sm:flex-row gap-5">
      {/* Worker avatar */}
      <div className="shrink-0 flex sm:flex-col items-center gap-3 sm:gap-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
          {initials}
        </div>
        <span className="text-slate-400 text-xs text-center">{booking.worker_name}</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <h3 className="text-white font-semibold text-base">{booking.service}</h3>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[booking.status] || 'bg-slate-800 text-slate-400'}`}>
            {booking.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-slate-400 mb-4">
          <span>📅 {dateStr}</span>
          <span>📍 {booking.address}</span>
          <span className="text-white font-semibold">${parseFloat(booking.total_price || 0).toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {booking.status === 'pending' && (
            <button
              onClick={() => onCancel(booking.id)}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-900/30 transition-colors"
            >
              Cancel
            </button>
          )}
          {booking.status === 'completed' && (
            <button
              onClick={() => onReview(booking)}
              className="text-xs px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-900/30 transition-colors"
            >
              ✎ Leave Review
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate    = useNavigate();
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [filter,    setFilter]    = useState('all');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    fetchMyBookings()
      .then(({ data }) => { setBookings(data.bookings); })
      .catch(() => { setBookings(MOCK_BOOKINGS); setUsingMock(true); })
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const handleCancel = async (id) => {
    if (usingMock) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
      setToast({ type: 'success', message: 'Booking cancelled (demo mode).' });
      return;
    }
    try {
      await updateBookingStatus(id, 'cancelled');
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
      setToast({ type: 'success', message: 'Booking cancelled.' });
    } catch {
      setToast({ type: 'error', message: 'Could not cancel booking.' });
    }
  };

  const handleReviewSubmit = async (bookingId, workerId, rating, comment) => {
    if (usingMock) { setToast({ type: 'success', message: 'Review submitted! (demo mode)' }); return; }
    try {
      await submitReview({ booking_id: bookingId, rating, comment });
      setToast({ type: 'success', message: 'Review submitted — thank you!' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Could not submit review.' });
    }
  };

  const FILTERS = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  const displayed = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading || authLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-4">
        {[1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl h-40 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {reviewing && (
        <ReviewModal
          booking={reviewing}
          onClose={() => setReviewing(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">My Bookings</h1>
        <p className="section-sub">Track and manage all your service appointments.</p>
        {usingMock && (
          <p className="mt-3 text-xs text-amber-400/80 glass rounded-lg px-4 py-2 inline-block">
            ⚠ Showing demo data — connect your backend to see real bookings.
          </p>
        )}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all border ${
              filter === f
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'glass border-white/10 text-slate-300 hover:border-blue-500/40'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-400">No {filter !== 'all' ? filter : ''} bookings found.</p>
          <button onClick={() => navigate('/workers')} className="btn-primary mt-5 px-6 py-2 text-sm">
            Browse Workers →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {displayed.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={handleCancel}
              onReview={(booking) => setReviewing(booking)}
              usingMock={usingMock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
