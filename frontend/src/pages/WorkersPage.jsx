import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchWorkers } from '../api';
import { useAuth } from '../context/AuthContext';
import WorkerCard from '../components/WorkerCard';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Gardening', 'HVAC', 'Security'];

const CATEGORY_ICONS = {
  All: '🔍', Plumbing: '🔧', Electrical: '⚡', Cleaning: '🧹',
  Carpentry: '🪚', Painting: '🎨', Gardening: '🌿', HVAC: '❄️', Security: '🔒',
};

const MOCK_WORKERS = [
  { id: 'm1', name: 'Alex Rivera',   service_category: 'Plumbing',   hourly_rate: '65', avg_rating: '4.8', total_reviews: 42,  is_available: true,  location: 'Downtown',   bio: 'Licensed plumber with 10+ years fixing leaks, installing fixtures and full bathroom remodels.' },
  { id: 'm2', name: 'Priya Sharma',  service_category: 'Electrical', hourly_rate: '80', avg_rating: '4.9', total_reviews: 87,  is_available: true,  location: 'Midtown',    bio: 'Certified electrician specialising in smart home wiring, panel upgrades and EV charger installs.' },
  { id: 'm3', name: 'Carlos Mendez', service_category: 'Cleaning',   hourly_rate: '40', avg_rating: '4.7', total_reviews: 130, is_available: true,  location: 'Westside',   bio: 'Thorough, eco-friendly deep cleaning using HEPA vacuums and non-toxic products.' },
  { id: 'm4', name: 'Emma Thompson', service_category: 'Carpentry',  hourly_rate: '70', avg_rating: '4.6', total_reviews: 29,  is_available: false, location: 'Northpark',  bio: 'Custom furniture builds, deck installations, and finish carpentry with 8 years of experience.' },
  { id: 'm5', name: 'James Okafor',  service_category: 'Painting',   hourly_rate: '55', avg_rating: '4.9', total_reviews: 63,  is_available: true,  location: 'Eastville',  bio: 'Interior and exterior painting, wall prep, and wallpaper removal. Flawless finishes every time.' },
  { id: 'm6', name: 'Sofia Lentini', service_category: 'Gardening',  hourly_rate: '45', avg_rating: '4.5', total_reviews: 18,  is_available: true,  location: 'Greenfield', bio: 'Landscaping, lawn maintenance, seasonal planting, and irrigation system setup.' },
];

/* ── Shared Navbar (same as other light-theme pages) ─────────── */
function SharedNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { setDropdown(false); logout(); navigate('/'); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
      <div className="lp-nav__inner">
        <Link to="/" className="lp-logo">
          <span className="lp-logo__icon">⚡</span>
          <span className="lp-logo__text">Work<span className="lp-logo__accent">Hire</span></span>
        </Link>

        <nav className="lp-nav__links">
          {['Home', 'Workers', 'Services', 'About', 'Contact'].map((l) => (
            <Link key={l} to={l === 'Home' ? '/' : `/${l.toLowerCase()}`} className="lp-nav__link">{l}</Link>
          ))}
        </nav>

        <div className="lp-nav__right">
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdown(p => !p)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', border: 'none', background: dropdownOpen ? 'rgba(0,0,0,0.08)' : 'transparent', cursor: 'pointer' }}
              >
                <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span style={{ fontWeight: 600, color: '#111', fontSize: '14px' }}>{user.name?.split(' ')[0]}</span>
                <svg style={{ width: '14px', height: '14px', color: '#888', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '200px', borderRadius: '14px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.14)', overflow: 'hidden', zIndex: 999 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Signed in as</p>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111' }}>{user.name}</p>
                  </div>
                  <Link to={user.role === 'worker' ? '/worker/dashboard' : '/dashboard'} onClick={() => setDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#333', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Dashboard
                  </Link>
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', fontSize: '13px', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="lp-btn lp-btn--dark" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Sign in</Link>
          )}
          <button className="lp-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="lp-menu-icon">≡</span> MENU
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lp-mobile-menu">
          {['/', '/workers', '/services', '/about', '/contact'].map((path, i) => (
            <Link key={path} to={path} className="lp-mobile-link" onClick={() => setMenuOpen(false)}>
              {['Home', 'Workers', 'Services', 'About', 'Contact'][i]}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

/* ── Skeleton Card ────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.75rem', border: '1.5px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(90deg,#e5e2d9 25%,#edeae1 50%,#e5e2d9 75%)', backgroundSize: '200% 100%', animation: 'lp-shimmer-sweep 1.6s infinite linear' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '16px', borderRadius: '6px', background: 'linear-gradient(90deg,#e5e2d9 25%,#edeae1 50%,#e5e2d9 75%)', backgroundSize: '200% 100%', animation: 'lp-shimmer-sweep 1.6s infinite linear', width: '60%' }} />
          <div style={{ height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg,#e5e2d9 25%,#edeae1 50%,#e5e2d9 75%)', backgroundSize: '200% 100%', animation: 'lp-shimmer-sweep 1.6s infinite linear', width: '40%' }} />
        </div>
      </div>
      <div style={{ height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg,#e5e2d9 25%,#edeae1 50%,#e5e2d9 75%)', backgroundSize: '200% 100%', animation: 'lp-shimmer-sweep 1.6s infinite linear' }} />
      <div style={{ height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg,#e5e2d9 25%,#edeae1 50%,#e5e2d9 75%)', backgroundSize: '200% 100%', animation: 'lp-shimmer-sweep 1.6s infinite linear', width: '80%' }} />
      <div style={{ height: '36px', borderRadius: '999px', background: 'linear-gradient(90deg,#e5e2d9 25%,#edeae1 50%,#e5e2d9 75%)', backgroundSize: '200% 100%', animation: 'lp-shimmer-sweep 1.6s infinite linear', marginTop: 'auto' }} />
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function WorkersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [usingMock, setMock]    = useState(false);

  const activeCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const cat = activeCategory === 'All' ? null : activeCategory;
    setLoading(true);
    fetchWorkers(cat)
      .then(({ data }) => { setWorkers(data.workers); setMock(false); })
      .catch(() => {
        const filtered = cat ? MOCK_WORKERS.filter(w => w.service_category === cat) : MOCK_WORKERS;
        setWorkers(filtered);
        setMock(true);
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategory = (cat) => {
    if (cat === 'All') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
  };

  return (
    <div className="lp-root">
      <SharedNavbar />

      {/* PAGE HERO */}
      <section style={{ paddingTop: '68px', background: '#f2f0eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem 3rem', textAlign: 'center' }}>
          <p className="lp-overline lp-overline--amber">Our Professionals</p>
          <h1 className="lp-section__title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.75rem' }}>
            Find the right pro<br />
            <span style={{ color: '#f97316' }}>for every job.</span>
          </h1>
          <p className="lp-section__sub" style={{ maxWidth: '500px', margin: '0 auto' }}>
            Browse verified, background-checked professionals. Transparent pricing, on-time guarantee.
          </p>

          {usingMock && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '1.25rem', background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '999px', padding: '6px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#c2410c' }}>
              ⚠ Showing demo data — connect backend to see live profiles
            </div>
          )}
        </div>
      </section>

      {/* TICKER */}
      <div className="lp-ticker" aria-hidden="true">
        <div className="lp-ticker__track">
          {[...CATEGORIES.slice(1), ...CATEGORIES.slice(1)].map((cat, i) => (
            <span key={i} className="lp-ticker__item">
              {CATEGORY_ICONS[cat]} {cat} <span className="lp-ticker__sep">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section style={{ background: '#fff', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 2rem 5rem' }}>

          {/* Stats row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '4px' }}>
                {loading ? 'Loading…' : `${workers.length} professional${workers.length !== 1 ? 's' : ''} found`}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
              </p>
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.5rem' }} role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase()}`}
                  onClick={() => handleCategory(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '0.45rem 1rem', borderRadius: '999px', border: 'none',
                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.18s',
                    background: isActive ? '#111' : '#f2f0eb',
                    color: isActive ? '#fff' : '#444',
                    boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.18)' : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#e5e2d9'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#f2f0eb'; } }}
                >
                  <span style={{ fontSize: '0.9rem' }}>{CATEGORY_ICONS[cat]}</span>
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : workers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#111', margin: '0 0 0.5rem' }}>
                No professionals found
              </h3>
              <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                No workers available for <strong>{activeCategory}</strong> right now.
              </p>
              <button
                onClick={() => handleCategory('All')}
                className="lp-btn lp-btn--dark"
              >
                View All Workers
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="lp-section" style={{ background: '#f2f0eb' }}>
        <div className="lp-section__inner">
          <div className="lp-cta-banner">
            <div className="lp-cta-banner__bg-text" aria-hidden="true">PROS</div>
            <p className="lp-overline lp-overline--amber">Are you a pro?</p>
            <h2 className="lp-cta-banner__title">
              Join our network of<br />
              <span className="lp-cta-banner__accent">500+ verified workers.</span>
            </h2>
            <p className="lp-cta-banner__sub">Set your own rates, choose your hours, grow your business.</p>
            <div className="lp-cta-row lp-cta-row--center">
              <Link to="/register" className="lp-btn lp-btn--amber">Join as a Pro <span className="lp-btn__arrow">↗</span></Link>
              <Link to="/about" className="lp-btn lp-btn--ghost">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <span className="lp-logo__icon">⚡</span>
            <span className="lp-logo__text">Work<span className="lp-logo__accent">Hire</span></span>
          </div>
          <p className="lp-footer__copy">© {new Date().getFullYear()} WorkHire. Connecting homes with trusted pros.</p>
          <div className="lp-footer__links">
            <Link to="/workers"  className="lp-footer__link">Workers</Link>
            <Link to="/services" className="lp-footer__link">Services</Link>
            <Link to="/about"    className="lp-footer__link">About</Link>
            <Link to="/contact"  className="lp-footer__link">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
