import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ICONS = {
  Plumbing:   '🔧',
  Electrical: '⚡',
  Cleaning:   '🧹',
  Carpentry:  '🪚',
  Painting:   '🎨',
  Gardening:  '🌿',
  HVAC:       '❄️',
  Security:   '🔒',
  default:    '🛠️',
};

const STARS = [1, 2, 3, 4, 5];

export default function WorkerCard({ worker }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const icon     = CATEGORY_ICONS[worker.service_category] ?? CATEGORY_ICONS.default;
  const initials = (worker.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const rating   = parseFloat(worker.avg_rating) || 0;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1.5px solid ${hovered ? '#f97316' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: '1.25rem',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Availability badge */}
      {worker.is_available && (
        <span style={{
          position: 'absolute', top: '1.1rem', right: '1.25rem',
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: '#16a34a',
          background: '#dcfce7', padding: '3px 10px', borderRadius: '999px',
        }}>
          Available
        </span>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {worker.avatar_url && !imgError ? (
            <img
              src={worker.avatar_url}
              alt={worker.name}
              onError={() => setImgError(true)}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.08)' }}
            />
          ) : (
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '1.15rem',
              border: '2px solid rgba(0,0,0,0.06)',
            }}>
              {initials}
            </div>
          )}
        </div>

        {/* Name / category */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: worker.is_available ? '80px' : '0' }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#111', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {worker.name}
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>{icon}</span>
            <span>{worker.service_category}</span>
          </p>
        </div>
      </div>

      {/* Star rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {STARS.map(s => (
            <svg key={s} style={{ width: '15px', height: '15px', fill: s <= Math.round(rating) ? '#f97316' : '#e5e7eb' }} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{rating.toFixed(1)}</span>
        <span style={{ fontSize: '0.78rem', color: '#999' }}>({worker.total_reviews} review{worker.total_reviews !== 1 ? 's' : ''})</span>
      </div>

      {/* Bio */}
      {worker.bio && (
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#666', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {worker.bio}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}>
          <span>📍</span>
          <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {worker.location || 'Location N/A'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#111' }}>
              ₹{parseFloat(worker.hourly_rate).toFixed(0)}
            </p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#999' }}>/hr</p>
          </div>
          <button
            id={`book-worker-${worker.id}`}
            onClick={() => navigate(`/book/${worker.id}`)}
            className="lp-btn lp-btn--dark"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.8rem', borderRadius: '999px' }}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}
