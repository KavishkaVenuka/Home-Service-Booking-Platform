import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

const CATEGORY_ICONS = {
  Plumbing:    '🔧',
  Electrical:  '⚡',
  Cleaning:    '🧹',
  Carpentry:   '🪚',
  Painting:    '🎨',
  Gardening:   '🌿',
  HVAC:        '❄️',
  Security:    '🔒',
  default:     '🛠️',
};

export default function WorkerCard({ worker }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const icon = CATEGORY_ICONS[worker.service_category] ?? CATEGORY_ICONS.default;
  const initials = (worker.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <article className="glass glass-hover rounded-2xl p-6 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {worker.avatar_url && !imgError ? (
            <img
              src={worker.avatar_url}
              alt={worker.name}
              onError={() => setImgError(true)}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/30"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-blue-500/30">
              {initials}
            </div>
          )}
          {worker.is_available && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0b0f1a]" title="Available" />
          )}
        </div>

        {/* Name / category */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">{worker.name}</h3>
          <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
            <span>{icon}</span>
            <span>{worker.service_category}</span>
          </p>
        </div>

        {/* Rate badge */}
        <div className="shrink-0 text-right">
          <p className="text-white font-bold text-base">${parseFloat(worker.hourly_rate).toFixed(0)}</p>
          <p className="text-slate-500 text-xs">/hr</p>
        </div>
      </div>

      {/* Rating row */}
      <div className="flex items-center gap-2">
        <StarRating rating={parseFloat(worker.avg_rating)} size="md" />
        <span className="text-slate-300 text-sm font-medium">{parseFloat(worker.avg_rating).toFixed(1)}</span>
        <span className="text-slate-500 text-xs">({worker.total_reviews} review{worker.total_reviews !== 1 ? 's' : ''})</span>
      </div>

      {/* Bio */}
      {worker.bio && (
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{worker.bio}</p>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/8">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <span>📍</span>
          <span className="truncate max-w-[120px]">{worker.location || 'Location N/A'}</span>
        </div>
        <button
          id={`book-worker-${worker.id}`}
          onClick={() => navigate(`/book/${worker.id}`)}
          className="btn-primary text-xs px-4 py-1.5"
        >
          Book Now
        </button>
      </div>
    </article>
  );
}
