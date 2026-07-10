import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

const SERVICES = [
  {
    icon: '🔧',
    label: 'Plumbing',
    desc: 'Leak repairs, pipe installations, drain cleaning, water heater servicing and full bathroom plumbing.',
    price: 'From ₹299',
    tags: ['Leak Repair', 'Drain Cleaning', 'Installation'],
  },
  {
    icon: '⚡',
    label: 'Electrical',
    desc: 'Safe wiring, panel upgrades, outlet installation, circuit breaker fixes and lighting setups.',
    price: 'From ₹349',
    tags: ['Wiring', 'Panel Upgrade', 'Lighting'],
  },
  {
    icon: '🧹',
    label: 'Cleaning',
    desc: 'Deep cleaning, move-in/move-out, post-construction clean-up and regular home maintenance.',
    price: 'From ₹199',
    tags: ['Deep Clean', 'Move-In', 'Post-Construction'],
  },
  {
    icon: '🪚',
    label: 'Carpentry',
    desc: 'Custom furniture assembly, cabinet repairs, wood flooring and structural woodwork.',
    price: 'From ₹399',
    tags: ['Furniture', 'Cabinets', 'Flooring'],
  },
  {
    icon: '🎨',
    label: 'Painting',
    desc: 'Interior and exterior painting, wallpaper removal, texture coating and colour consultations.',
    price: 'From ₹249',
    tags: ['Interior', 'Exterior', 'Wallpaper'],
  },
  {
    icon: '🌿',
    label: 'Gardening',
    desc: 'Lawn mowing, hedge trimming, landscaping, garden design and seasonal planting.',
    price: 'From ₹179',
    tags: ['Lawn Care', 'Landscaping', 'Planting'],
  },
  {
    icon: '❄️',
    label: 'HVAC',
    desc: 'AC installation, servicing and repair, heating systems, duct cleaning and ventilation.',
    price: 'From ₹449',
    tags: ['AC Repair', 'Heating', 'Duct Cleaning'],
  },
  {
    icon: '🔒',
    label: 'Security',
    desc: 'CCTV installation, smart lock setup, alarm systems and access control solutions.',
    price: 'From ₹599',
    tags: ['CCTV', 'Smart Locks', 'Alarms'],
  },
];

const WHY = [
  { icon: '✅', title: 'Background Verified', desc: 'Every professional is ID-verified and police-cleared before joining.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'Fixed quotes upfront — no hidden fees, no surprises at checkout.' },
  { icon: '⏱️', title: 'On-Time Guarantee', desc: 'We respect your schedule. Late arrivals are compensated automatically.' },
  { icon: '🛡️', title: '30-Day Warranty', desc: 'All work is backed by a satisfaction guarantee and 30-day redo policy.' },
];

function SharedNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { setDropdownOpen(false); logout(); navigate('/'); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
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
                onClick={() => setDropdownOpen(p => !p)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', border: 'none', background: dropdownOpen ? 'rgba(0,0,0,0.08)' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span style={{ fontWeight: 600, color: '#111', fontSize: '14px' }}>{user.name?.split(' ')[0]}</span>
                <svg style={{ width: '14px', height: '14px', color: '#888', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '200px', borderRadius: '14px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.14)', overflow: 'hidden', zIndex: 999 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Signed in as</p>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111' }}>{user.name}</p>
                  </div>
                  <Link to={user.role === 'worker' ? '/worker/dashboard' : '/dashboard'} onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#333', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
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
          ) : null}
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

export default function ServicesPage() {
  return (
    <div className="lp-root">
      <SharedNavbar />

      {/* PAGE HERO */}
      <section style={{ paddingTop: '68px', background: '#f2f0eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
          <p className="lp-overline lp-overline--amber">What We Offer</p>
          <h1 className="lp-section__title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1rem' }}>
            Every Service Your<br />
            <span style={{ color: '#f97316' }}>Home Deserves</span>
          </h1>
          <p className="lp-section__sub" style={{ maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            Trusted, background-checked professionals across 8 categories — booked in minutes, guaranteed to satisfy.
          </p>
          <Link to="/workers" className="lp-btn lp-btn--dark">
            Browse Professionals <span className="lp-btn__arrow">↗</span>
          </Link>
        </div>
      </section>

      {/* BLACK TICKER */}
      <div className="lp-ticker" aria-hidden="true">
        <div className="lp-ticker__track">
          {[...SERVICES, ...SERVICES].map(({ icon, label }, i) => (
            <span key={i} className="lp-ticker__item">
              {icon} {label} <span className="lp-ticker__sep">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES GRID */}
      <section className="lp-section" style={{ background: '#fff' }}>
        <div className="lp-section__inner">
          <p className="lp-overline">All Services</p>
          <h2 className="lp-section__title">Pick Your Category</h2>
          <p className="lp-section__sub" style={{ marginBottom: '3.5rem' }}>
            Each service is delivered by vetted professionals with an on-time guarantee.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>
            {SERVICES.map(({ icon, label, desc, price, tags }) => (
              <Link
                key={label}
                to={`/workers?category=${label}`}
                style={{ display: 'block', background: '#f2f0eb', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '1.25rem', padding: '1.75rem', textDecoration: 'none', color: 'inherit', transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#f97316'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'; }}
              >
                <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: '#111', margin: '0 0 0.5rem' }}>{label}</h3>
                <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.65, margin: '0 0 1rem' }}>{desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {tags.map(t => (
                    <span key={t} style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em', padding: '3px 10px', borderRadius: '999px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', color: '#444' }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f97316' }}>{price}</span>
                  <span style={{ fontSize: '1rem', color: '#f97316' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="lp-section" style={{ background: '#f2f0eb' }}>
        <div className="lp-section__inner">
          <p className="lp-overline lp-overline--amber">Why WorkHire</p>
          <h2 className="lp-section__title">Built on Trust &<br />Reliability</h2>
          <p className="lp-section__sub" style={{ marginBottom: '3.5rem' }}>We hold our professionals to the highest standard so you never have to worry.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>
            {WHY.map(({ icon, title, desc }) => (
              <div key={title} className="lp-step-card">
                <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>{icon}</div>
                <h3 className="lp-step-title">{title}</h3>
                <p className="lp-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-cta-banner">
            <div className="lp-cta-banner__bg-text" aria-hidden="true">BOOK</div>
            <p className="lp-overline lp-overline--amber">Get Started</p>
            <h2 className="lp-cta-banner__title">
              Ready to book your<br />
              <span className="lp-cta-banner__accent">first service?</span>
            </h2>
            <p className="lp-cta-banner__sub">Create a free account and connect with verified pros today.</p>
            <div className="lp-cta-row lp-cta-row--center">
              <Link to="/register" className="lp-btn lp-btn--amber">Get Started Free <span className="lp-btn__arrow">↗</span></Link>
              <Link to="/workers" className="lp-btn lp-btn--ghost">Explore Workers</Link>
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
            <Link to="/workers" className="lp-footer__link">Workers</Link>
            <Link to="/services" className="lp-footer__link">Services</Link>
            <Link to="/about" className="lp-footer__link">About</Link>
            <Link to="/contact" className="lp-footer__link">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
