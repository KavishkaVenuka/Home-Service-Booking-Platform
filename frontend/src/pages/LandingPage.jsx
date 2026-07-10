import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import heroWorker from '../assets/hero_workers.png';
import TextPressure from '../components/TextPressure';

const SERVICES = [
  { icon: '🔧', label: 'Plumbing'   },
  { icon: '⚡', label: 'Electrical' },
  { icon: '🧹', label: 'Cleaning'   },
  { icon: '🪚', label: 'Carpentry'  },
  { icon: '🎨', label: 'Painting'   },
  { icon: '🌿', label: 'Gardening'  },
  { icon: '❄️', label: 'HVAC'       },
  { icon: '🔒', label: 'Security'   },
];

const STATS = [
  { value: '500+', label: 'Verified Pros'    },
  { value: '12k+', label: 'Jobs Done'        },
  { value: '4.9★', label: 'Avg Rating'       },
  { value: '24/7', label: 'Support'          },
];

const HOW_STEPS = [
  { step: '01', icon: '🔍', title: 'Browse Profiles',  desc: 'Filter by service, rating, and availability across hundreds of verified pros.' },
  { step: '02', icon: '📅', title: 'Book Instantly',   desc: 'Pick your date and time, get a transparent price estimate — no surprises.' },
  { step: '03', icon: '⭐', title: 'Rate & Review',    desc: 'After the job, leave a rating to help others find the best pros.' },
];

export default function LandingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const heroRef = useRef(null);
  const imgRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Monitor image loading to fade out loader
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 650); // Small delay to guarantee visual feedback of premium loading state
      return () => clearTimeout(timer);
    }
  }, [imageLoaded]);

  return (
    <div className="lp-root">

      {/* NAVBAR */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav__inner">
          <Link to="/" className="lp-logo">
            <span className="lp-logo__icon">⚡</span>
            <span className="lp-logo__text">Work<span className="lp-logo__accent">Hire</span></span>
          </Link>

          <nav className="lp-nav__links">
            {['Home', 'Workers', 'Services', 'About', 'Contact'].map((l) => (
              <Link
                key={l}
                to={l === 'Home' ? '/' : `/${l.toLowerCase()}`}
                className="lp-nav__link"
              >
                {l}
              </Link>
            ))}
          </nav>

          <div className="lp-nav__right">
            {user ? (
              <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
                {/* Clickable username button */}
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 12px', borderRadius: '10px', border: 'none',
                    background: dropdownOpen ? 'rgba(0,0,0,0.08)' : 'transparent',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = dropdownOpen ? 'rgba(0,0,0,0.08)' : 'transparent'}
                >
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0,
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 600, color: '#111', fontSize: '14px' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <svg
                    style={{
                      width: '14px', height: '14px', color: '#888',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '200px', borderRadius: '14px',
                    background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.14)', overflow: 'hidden', zIndex: 999,
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Signed in as</p>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111' }}>{user.name}</p>
                    </div>

                    <Link
                      to={user.role === 'worker' ? '/worker/dashboard' : '/dashboard'}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 16px', fontSize: '13px', color: '#333',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg style={{ width: '15px', height: '15px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </Link>

                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          width: '100%', padding: '10px 16px', fontSize: '13px',
                          color: '#e53e3e', background: 'none', border: 'none',
                          cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg style={{ width: '15px', height: '15px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
            <button className="lp-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="lp-menu-icon">≡</span> MENU
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lp-mobile-menu">
            {['/', '/workers', '/bookings', '/login', '/register'].map((path, i) => (
              <Link
                key={path}
                to={path}
                className="lp-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {['Home', 'Workers', 'My Bookings', 'Log In', 'Sign Up'][i]}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-bg-text" aria-hidden="true">
          <TextPressure
            text="WORKHIRE"
            flex={false}
            alpha={false}
            stroke={false}
            width={false}
            weight={true}
            italic={true}
            textColor="rgba(0, 0, 0, 0.055)"
            minFontSize={30}
            fontFamily="Outfit"
          />
        </div>

        <div className="lp-hero__content">
          {showLoader ? (
            <div className="lp-hero-skeleton">
              <div className="lp-skeleton-eyebrow lp-shimmer" />
              <div className="lp-skeleton-title lp-shimmer" />
              <div className="lp-skeleton-title lp-skeleton-title--short lp-shimmer" />
              <div className="lp-skeleton-sub lp-shimmer" />
              <div className="lp-skeleton-sub lp-skeleton-sub--short lp-shimmer" />
              <div className="lp-skeleton-ctas">
                <div className="lp-skeleton-btn lp-shimmer" />
                <div className="lp-skeleton-btn lp-shimmer" />
              </div>
            </div>
          ) : (
            <div className="lp-hero-animate-in">
              <div className="lp-eyebrow">
                <span className="lp-eyebrow__dot" />
                Home Service Platform
              </div>

              <h1 className="lp-hero__title">
                <span className="lp-hero__title-nowrap">Find workers that feel</span><br />
                <span className="lp-hero__accent lp-hero__title-nowrap">impossible to replace.</span>
              </h1>

              <p className="lp-hero__sub">
                Verified, background-checked professionals for every home service.<br />
                Plumbing, electrical, cleaning and more — booked in minutes.
              </p>

              <div className="lp-cta-row">
                <Link to="/workers" id="hero-browse-workers" className="lp-btn lp-btn--dark">
                  Browse Workers <span className="lp-btn__arrow">↗</span>
                </Link>
                <Link to="/register" className="lp-btn lp-btn--outline">
                  Login <span className="lp-btn__dot" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="lp-hero__img-wrap">
          {showLoader && <div className="lp-skeleton-img" />}
          <img
            ref={imgRef}
            src={heroWorker}
            alt="Professional home service worker"
            className={`lp-hero__img ${showLoader ? 'lp-hero__img--hidden' : 'lp-hero__img--visible'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!showLoader && <div className="lp-hero__img-glow" />}
        </div>

        <div className="lp-stats-bar">
          {STATS.map(({ value, label }, i) => (
            <div key={label} className="lp-stat">
              {i > 0 && <span className="lp-stat__sep" aria-hidden="true">•</span>}
              <span className="lp-stat__accent" />
              <strong>{value}</strong>&nbsp;<span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <div className="lp-ticker" aria-hidden="true">
        <div className="lp-ticker__track">
          {[...SERVICES, ...SERVICES].map(({ icon, label }, i) => (
            <span key={i} className="lp-ticker__item">
              {icon} {label} <span className="lp-ticker__sep">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="lp-section lp-how">
        <div className="lp-section__inner">
          <p className="lp-overline">Simple Process</p>
          <h2 className="lp-section__title">How WorkHire Works</h2>
          <p className="lp-section__sub">From browse to booked in under 3 minutes.</p>

          <div className="lp-steps">
            {HOW_STEPS.map(({ step, icon, title, desc }) => (
              <div key={step} className="lp-step-card">
                <span className="lp-step-num">{step}</span>
                <div className="lp-step-icon">{icon}</div>
                <h3 className="lp-step-title">{title}</h3>
                <p className="lp-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="lp-section lp-categories">
        <div className="lp-section__inner">
          <p className="lp-overline lp-overline--amber">Categories</p>
          <h2 className="lp-section__title">Every Service You Need</h2>

          <div className="lp-cat-grid">
            {SERVICES.map(({ icon, label }) => (
              <Link
                key={label}
                to={`/workers?category=${label}`}
                id={`category-${label.toLowerCase()}`}
                className="lp-cat-card"
              >
                <span className="lp-cat-icon">{icon}</span>
                <span className="lp-cat-label">{label}</span>
                <span className="lp-cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-cta-banner">
            <div className="lp-cta-banner__bg-text" aria-hidden="true">READY</div>
            <p className="lp-overline lp-overline--amber">Get Started</p>
            <h2 className="lp-cta-banner__title">
              Ready to book your<br />
              <span className="lp-cta-banner__accent">first service?</span>
            </h2>
            <p className="lp-cta-banner__sub">
              Create your free account and connect with verified professionals today.
            </p>
            <div className="lp-cta-row lp-cta-row--center">
              <Link to="/register" className="lp-btn lp-btn--amber">
                Get Started Free <span className="lp-btn__arrow">↗</span>
              </Link>
              <Link to="/workers" className="lp-btn lp-btn--ghost">
                Explore Workers
              </Link>
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
          <p className="lp-footer__copy">
            © {new Date().getFullYear()} WorkHire. Connecting homes with trusted pros.
          </p>
          <div className="lp-footer__links">
            <Link to="/workers" className="lp-footer__link">Workers</Link>
            <Link to="/register" className="lp-footer__link">Sign Up</Link>
            <Link to="/login" className="lp-footer__link">Log In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
