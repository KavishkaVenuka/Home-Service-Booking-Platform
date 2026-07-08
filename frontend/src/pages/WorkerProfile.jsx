import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock, FiCheckCircle, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import api from '../services/api';

/**
 * WorkerProfile page — displays full profile, reviews, and booking CTA.
 * Route: /workers/:id
 */
export default function WorkerProfile() {
  const { id } = useParams();
  const [worker, setWorker]   = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [workerRes, reviewsRes] = await Promise.all([
          api.get(`/workers/${id}`),
          api.get(`/reviews/worker/${id}`),
        ]);
        setWorker(workerRes.data.worker);
        setReviews(reviewsRes.data.reviews);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load worker profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Loading Skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container-app py-12 animate-pulse max-w-4xl mx-auto">
        <div className="card">
          <div className="flex gap-6 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="container-app py-24 text-center animate-fade-in">
        <p className="text-red-500 text-lg mb-4">{error || 'Worker not found'}</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const initials = worker.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  // ── Star Rating Helper ────────────────────────────────────────────────────
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        size={16}
        className={i < Math.round(rating) ? 'text-accent fill-accent' : 'text-gray-300'}
      />
    ));

  return (
    <div className="container-app py-10 max-w-4xl mx-auto animate-fade-in">

      {/* Back Link */}
      <Link to="/" className="btn-ghost mb-6 inline-flex">
        <FiArrowLeft /> Back to Workers
      </Link>

      {/* ── Profile Card ────────────────────────────────────────────────────── */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-6">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-3xl flex-shrink-0 shadow-md">
            {worker.avatar_url
              ? <img src={worker.avatar_url} alt={worker.name} className="w-full h-full rounded-2xl object-cover" />
              : initials
            }
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">{worker.name}</h1>
                <p className="text-primary-600 font-medium">{worker.service_category}</p>
              </div>
              <span className={`badge ${worker.is_available ? 'badge-green' : 'badge-red'}`}>
                {worker.is_available ? '● Available' : '○ Unavailable'}
              </span>
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {worker.location && (
                <span className="flex items-center gap-1"><FiMapPin size={14}/> {worker.location}</span>
              )}
              <span className="flex items-center gap-1"><FiClock size={14}/> {worker.years_experience || 0} yrs experience</span>
              <span className="flex items-center gap-1"><FiMessageSquare size={14}/> {worker.total_reviews || 0} reviews</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">{renderStars(worker.avg_rating)}</div>
              <span className="font-semibold text-gray-700">{parseFloat(worker.avg_rating || 0).toFixed(1)}</span>
              <span className="text-gray-400">({worker.total_reviews || 0})</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {worker.bio && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{worker.bio}</p>
          </div>
        )}

        {/* Booking CTA */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-gray-100 pt-6">
          <div>
            <span className="text-2xl font-heading font-bold text-primary-600">${worker.hourly_rate}</span>
            <span className="text-gray-400 text-sm"> / hour</span>
          </div>
          {worker.is_available ? (
            <Link
              to={`/book/${worker.id}`}
              id="book-now-btn"
              className="btn-primary"
            >
              Book Now
            </Link>
          ) : (
            <button disabled className="btn-primary">Unavailable</button>
          )}
        </div>
      </div>

      {/* ── Reviews Section ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
          Customer Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="card text-center py-12 text-gray-400">
            <FiStar size={36} className="mx-auto mb-3 opacity-30" />
            <p>No reviews yet. Be the first to book and review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                    {review.customer_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-semibold text-gray-800">{review.customer_name}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex mt-1 mb-2">{renderStars(review.rating)}</div>
                    {review.comment && <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
