import StarRating from './StarRating';

export default function ReviewCard({ review }) {
  const initials = (review.customer_name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-3">
      {/* Reviewer header */}
      <div className="flex items-center gap-3">
        {review.customer_avatar ? (
          <img
            src={review.customer_avatar}
            alt={review.customer_name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{review.customer_name}</p>
          <p className="text-slate-500 text-xs">{date}</p>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-slate-400 text-sm leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}
