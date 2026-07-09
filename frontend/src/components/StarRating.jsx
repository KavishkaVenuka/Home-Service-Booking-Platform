export default function StarRating({ rating = 0, max = 5, size = 'sm' }) {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
  return (
    <span className={`inline-flex gap-0.5 ${sizes[size]}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  );
}
