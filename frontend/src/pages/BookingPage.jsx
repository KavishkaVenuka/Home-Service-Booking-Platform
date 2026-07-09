import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWorkerById, fetchWorkerReviews, createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import Toast from '../components/Toast';

// ── Mock fallback ────────────────────────────────────────────────
const MOCK_WORKER = {
  id: 'mock',
  name: 'Alex Rivera',
  service_category: 'Plumbing',
  hourly_rate: '65',
  avg_rating: '4.8',
  total_reviews: 42,
  is_available: true,
  location: 'Downtown',
  years_experience: 10,
  bio: 'Licensed plumber with 10+ years fixing leaks, installing fixtures and full bathroom remodels. Available 7 days a week.',
};
const MOCK_REVIEWS = [
  { id: 'r1', customer_name: 'Sarah K.', rating: 5, comment: 'Alex was punctual, professional, and fixed our pipe issue within an hour. Highly recommend!', created_at: new Date().toISOString() },
  { id: 'r2', customer_name: 'Tom W.',   rating: 4, comment: 'Great work on our bathroom. A little pricey but worth every cent for the quality.', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
];

const today = () => new Date().toISOString().slice(0, 16);

export default function BookingPage() {
  const { workerId } = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [worker,  setWorker]  = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [usingMock, setUsingMock]   = useState(false);

  const [form, setForm] = useState({
    service: '',
    description: '',
    scheduled_at: '',
    duration_hours: '1',
    address: '',
    notes: '',
  });

  useEffect(() => {
    Promise.all([
      fetchWorkerById(workerId),
      fetchWorkerReviews(workerId),
    ])
      .then(([wRes, rRes]) => {
        setWorker(wRes.data.worker);
        setReviews(rRes.data.reviews);
      })
      .catch(() => {
        setWorker(MOCK_WORKER);
        setReviews(MOCK_REVIEWS);
        setUsingMock(true);
      })
      .finally(() => setLoading(false));
  }, [workerId]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const totalPrice = worker
    ? (parseFloat(worker.hourly_rate) * parseFloat(form.duration_hours || 1)).toFixed(2)
    : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (usingMock) {
      setToast({ type: 'success', message: '✓ Booking submitted! (demo mode — connect your backend to persist)' });
      return;
    }
    setSubmitting(true);
    try {
      await createBooking({ worker_id: workerId, ...form });
      setToast({ type: 'success', message: 'Booking confirmed! Check My Bookings for details.' });
      setForm({ service: '', description: '', scheduled_at: '', duration_hours: '1', address: '', notes: '' });
      setTimeout(() => navigate('/bookings'), 2200);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Booking failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-2xl p-8 animate-pulse h-80" />
        <div className="glass rounded-2xl p-8 animate-pulse h-80" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {usingMock && (
        <p className="mb-6 text-xs text-amber-400/80 glass rounded-lg px-4 py-2 inline-block">
          ⚠ Showing demo data — connect your backend for live booking.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Left: Worker profile ── */}
        <div className="flex flex-col gap-6">
          {/* Worker hero card */}
          <div className="glass rounded-2xl p-7">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-blue-500/30 shrink-0">
                {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">{worker.name}</h1>
                <p className="text-slate-400 text-sm">{worker.service_category} · {worker.years_experience || 0} yrs exp</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={parseFloat(worker.avg_rating)} size="lg" />
              <span className="text-white font-semibold">{parseFloat(worker.avg_rating).toFixed(1)}</span>
              <span className="text-slate-400 text-sm">({worker.total_reviews} reviews)</span>
            </div>

            {worker.bio && <p className="text-slate-400 text-sm leading-relaxed mb-4">{worker.bio}</p>}

            <div className="flex items-center justify-between pt-4 border-t border-white/8">
              <span className="text-slate-400 text-sm">📍 {worker.location || 'N/A'}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${worker.is_available ? 'bg-emerald-900/60 text-emerald-400' : 'bg-red-900/60 text-red-400'}`}>
                {worker.is_available ? '● Available' : '● Busy'}
              </span>
            </div>
          </div>

          {/* ── Reviews section ── */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">
              Reviews <span className="text-slate-500 font-normal text-sm">({reviews.length})</span>
            </h2>
            {reviews.length === 0 ? (
              <div className="glass rounded-xl p-6 text-center text-slate-500 text-sm">
                No reviews yet. Be the first to leave one!
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-1">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Booking form ── */}
        <div className="glass rounded-2xl p-7 self-start sticky top-24">
          <h2 className="text-white font-bold text-xl mb-1">Book This Worker</h2>
          <p className="text-slate-400 text-sm mb-6">Fill in the details below to schedule your appointment.</p>

          <form id="booking-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Service */}
            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block" htmlFor="service">
                Service Type <span className="text-red-400">*</span>
              </label>
              <input
                id="service"
                className="field"
                placeholder="e.g. Fix kitchen sink"
                value={form.service}
                onChange={set('service')}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="field resize-none h-20"
                placeholder="Describe the issue or scope of work…"
                value={form.description}
                onChange={set('description')}
              />
            </div>

            {/* Date / time */}
            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block" htmlFor="scheduled_at">
                Date & Time <span className="text-red-400">*</span>
              </label>
              <input
                id="scheduled_at"
                type="datetime-local"
                className="field"
                min={today()}
                value={form.scheduled_at}
                onChange={set('scheduled_at')}
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block" htmlFor="duration_hours">
                Duration (hours)
              </label>
              <select id="duration_hours" className="field" value={form.duration_hours} onChange={set('duration_hours')}>
                {[1, 2, 3, 4, 6, 8].map((h) => (
                  <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block" htmlFor="address">
                Address <span className="text-red-400">*</span>
              </label>
              <input
                id="address"
                className="field"
                placeholder="123 Main St, City"
                value={form.address}
                onChange={set('address')}
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block" htmlFor="notes">
                Notes for the Worker
              </label>
              <input
                id="notes"
                className="field"
                placeholder="Gate code, access instructions…"
                value={form.notes}
                onChange={set('notes')}
              />
            </div>

            {/* Price estimate */}
            <div className="glass rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">Estimated Total</p>
                <p className="text-white font-bold text-2xl mt-0.5">${totalPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">${parseFloat(worker.hourly_rate).toFixed(0)}/hr × {form.duration_hours || 1} hr</p>
              </div>
            </div>

            <button
              type="submit"
              id="submit-booking"
              disabled={submitting || !worker.is_available}
              className="btn-primary w-full py-3 text-base mt-1"
            >
              {!worker.is_available
                ? 'Worker Unavailable'
                : submitting
                ? 'Booking…'
                : user
                ? 'Confirm Booking'
                : 'Log in to Book'}
            </button>

            {!user && (
              <p className="text-center text-slate-500 text-xs">
                You need to be logged in to make a booking.{' '}
                <a href="/login" className="text-blue-400 hover:underline">Log in →</a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
