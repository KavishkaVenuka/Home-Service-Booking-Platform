import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchWorkers } from '../api';
import WorkerCard from '../components/WorkerCard';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Gardening', 'HVAC', 'Security'];

// ── Mock data shown when backend is offline ──────────────────────
const MOCK_WORKERS = [
  { id: 'm1', name: 'Alex Rivera',    service_category: 'Plumbing',   hourly_rate: '65',  avg_rating: '4.8', total_reviews: 42, is_available: true,  location: 'Downtown',    bio: 'Licensed plumber with 10+ years fixing leaks, installing fixtures and full bathroom remodels.' },
  { id: 'm2', name: 'Priya Sharma',   service_category: 'Electrical', hourly_rate: '80',  avg_rating: '4.9', total_reviews: 87, is_available: true,  location: 'Midtown',     bio: 'Certified electrician specialising in smart home wiring, panel upgrades and EV charger installs.' },
  { id: 'm3', name: 'Carlos Mendez',  service_category: 'Cleaning',   hourly_rate: '40',  avg_rating: '4.7', total_reviews: 130,is_available: true,  location: 'Westside',    bio: 'Thorough, eco-friendly deep cleaning using HEPA vacuums and non-toxic products.' },
  { id: 'm4', name: 'Emma Thompson',  service_category: 'Carpentry',  hourly_rate: '70',  avg_rating: '4.6', total_reviews: 29, is_available: false, location: 'Northpark',   bio: 'Custom furniture builds, deck installations, and finish carpentry with 8 years of experience.' },
  { id: 'm5', name: 'James Okafor',   service_category: 'Painting',   hourly_rate: '55',  avg_rating: '4.9', total_reviews: 63, is_available: true,  location: 'Eastville',   bio: 'Interior and exterior painting, wall prep, and wallpaper removal. Flawless finishes every time.' },
  { id: 'm6', name: 'Sofia Lentini',  service_category: 'Gardening',  hourly_rate: '45',  avg_rating: '4.5', total_reviews: 18, is_available: true,  location: 'Greenfield',  bio: 'Landscaping, lawn maintenance, seasonal planting, and irrigation system setup.' },
];

export default function WorkersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [usingMock, setUsingMock] = useState(false);

  const activeCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const cat = activeCategory === 'All' ? null : activeCategory;
    setLoading(true);
    setError('');
    fetchWorkers(cat)
      .then(({ data }) => { setWorkers(data.workers); setUsingMock(false); })
      .catch(() => {
        // Fall back to mock data if backend is not running
        const filtered = cat ? MOCK_WORKERS.filter(w => w.service_category === cat) : MOCK_WORKERS;
        setWorkers(filtered);
        setUsingMock(true);
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategory = (cat) => {
    if (cat === 'All') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Our Professionals</p>
        <h1 className="section-title">Available Workers</h1>
        <p className="section-sub">Browse and book from our network of verified home-service pros.</p>

        {usingMock && (
          <p className="mt-3 text-xs text-amber-400/80 glass rounded-lg px-4 py-2 inline-block">
            ⚠ Showing demo data — connect your backend to see live profiles.
          </p>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase()}`}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              activeCategory === cat
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'glass border-white/10 text-slate-300 hover:border-blue-500/50 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse h-56" />
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-slate-400 text-lg">No workers found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
        </div>
      )}
    </div>
  );
}
