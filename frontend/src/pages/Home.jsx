import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiStar, FiShield, FiClock, FiArrowRight, FiTool, FiDroplet, FiZap, FiHome } from 'react-icons/fi';
import api from '../services/api';

// ─── Service Category Cards ────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  { name: 'Plumbing',    icon: FiDroplet, color: 'bg-blue-50 text-blue-600',   count: '120+ workers' },
  { name: 'Electrical',  icon: FiZap,     color: 'bg-yellow-50 text-yellow-600', count: '95+ workers'  },
  { name: 'Cleaning',    icon: FiHome,    color: 'bg-green-50 text-green-600',  count: '200+ workers' },
  { name: 'Repairs',     icon: FiTool,    color: 'bg-purple-50 text-purple-600', count: '80+ workers'  },
];

// ─── Trust Stats ──────────────────────────────────────────────────────────────
const STATS = [
  { value: '10,000+', label: 'Bookings Completed' },
  { value: '500+',    label: 'Verified Workers'   },
  { value: '4.8★',   label: 'Average Rating'     },
  { value: '98%',     label: 'Satisfaction Rate'  },
];

// ─── Why Choose Us ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: FiShield, title: 'Verified Professionals', desc: 'Every worker is background-checked and skill-verified before joining the platform.' },
  { icon: FiStar,   title: 'Top-Rated Service',      desc: 'Real reviews from real customers ensure you always get the best.' },
  { icon: FiClock,  title: 'Fast Booking',            desc: 'Book a professional in under 2 minutes — available same day.' },
];

/**
 * Home page — landing page for the platform.
 */
export default function Home() {
  const [workers, setWorkers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');

  // Fetch featured workers
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/workers', { params: { category: category || undefined } });
        setWorkers(data.workers.slice(0, 6)); // show top 6
      } catch {
        // Workers will be empty on first run — that's fine
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  return (
    <div className="animate-fade-in">

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="container-app relative py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="badge bg-white/20 text-white mb-4 inline-block animate-slide-up">
              🏠 Trusted by 10,000+ Homeowners
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 animate-slide-up">
              Book Home Services <br />
              <span className="text-accent-light">You Can Trust</span>
            </h1>
            <p className="text-primary-100 text-lg mb-10 max-w-xl">
              Connect with verified professionals for plumbing, cleaning, electrical work, and more — all at the tap of a button.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="hero-search"
                  type="text"
                  placeholder="What service do you need?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-11 shadow-lg"
                />
              </div>
              <button id="hero-search-btn" className="btn-primary bg-accent hover:bg-accent-dark px-8 shadow-lg">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-app py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-heading font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Categories ────────────────────────────────────────────────── */}
      <section className="container-app py-16">
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Browse by Category</h2>
        <p className="text-gray-500 mb-8">Find the right professional for the job</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              id={`category-${cat.name.toLowerCase()}`}
              onClick={() => setCategory(cat.name === category ? '' : cat.name)}
              className={`card text-left cursor-pointer transition-all hover:-translate-y-1 ${
                category === cat.name ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                <cat.icon size={24} />
              </div>
              <p className="font-semibold text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Workers ──────────────────────────────────────────────────── */}
      <section className="container-app pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-1">Top Professionals</h2>
            <p className="text-gray-500">Highly rated, verified workers near you</p>
          </div>
          <Link to="/workers" className="btn-ghost hidden md:flex">
            View all <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiTool size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg">No workers found yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <Link
                key={worker.id}
                to={`/workers/${worker.id}`}
                id={`worker-card-${worker.id}`}
                className="card hover:-translate-y-1 block transition-transform"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl flex-shrink-0">
                    {worker.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{worker.name}</p>
                    <p className="text-sm text-gray-500">{worker.service_category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-accent font-semibold">
                    <FiStar /> {parseFloat(worker.avg_rating || 0).toFixed(1)}
                    <span className="text-gray-400 font-normal">({worker.total_reviews || 0})</span>
                  </span>
                  <span className="font-semibold text-primary-600">${worker.hourly_rate}/hr</span>
                </div>
                {worker.location && (
                  <p className="text-xs text-gray-400 mt-2">📍 {worker.location}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Why Us ────────────────────────────────────────────────────────────── */}
      <section className="bg-primary-50">
        <div className="container-app py-16">
          <h2 className="text-3xl font-heading font-bold text-gray-900 text-center mb-12">Why Choose HomeServe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <f.icon size={28} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────────── */}
      <section className="bg-primary-700 text-white">
        <div className="container-app py-16 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-200 mb-8 max-w-md mx-auto">
            Join thousands of homeowners who trust HomeServe for all their home service needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/workers" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">
              Browse Workers
            </Link>
            <a href="#" className="btn-secondary border-white text-white hover:bg-white/10">
              Become a Worker
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
