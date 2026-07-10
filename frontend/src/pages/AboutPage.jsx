import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

const TEAM = [
  { name: 'Arjun Mehta', role: 'Co-Founder & CEO', emoji: '👨‍💼', desc: 'Former startup operator with 10 years in marketplace platforms and home services.' },
  { name: 'Priya Sharma', role: 'Co-Founder & CTO', emoji: '👩‍💻', desc: 'Ex-Google engineer passionate about using tech to bridge the skilled-labour gap.' },
  { name: 'Rohit Das', role: 'Head of Operations', emoji: '🧑‍🔧', desc: 'Built and scaled field-service ops across 12 cities for India\'s top service brands.' },
  { name: 'Sneha Kapoor', role: 'Head of Trust & Safety', emoji: '👩‍⚖️', desc: 'Background in law enforcement and compliance — ensures every worker is vetted.' },
];

const MILESTONES = [
  { year: '2021', event: 'Founded in Bengaluru with a vision to digitise home services.' },
  { year: '2022', event: 'Onboarded first 100 verified professionals across 3 cities.' },
  { year: '2023', event: 'Scaled to 12 cities and crossed 10,000 bookings per month.' },
  { year: '2024', event: 'Launched AI-powered matching and 30-day service guarantee.' },
  { year: '2025', event: 'Reached 500+ verified pros and 50,000 happy households.' },
];

const VALUES = [
  { icon: '🤝', title: 'Trust First', desc: 'Every decision we make starts with "how does this protect the customer and the professional?"' },
  { icon: '⚡', title: 'Move Fast', desc: 'We iterate quickly, ship features weekly, and never stop improving the experience.' },
  { icon: '❤️', title: 'Human Touch', desc: 'Tech connects — but people serve. We empower workers to build real livelihoods.' },
  { icon: '🌱', title: 'Grow Together', desc: 'Our success is measured by how many professionals we\'ve helped earn more.' },
];

function SharedNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // About hero is dark — use white text until scrolled past it
  const onDark = !scrolled;
  const linkColor   = onDark ? 'rgba(255,255,255,0.8)' : '#333';
  const logoColor   = onDark ? '#fff' : '#111';
  const menuBorder  = onDark ? 'rgba(255,255,255,0.35)' : '#ccc';
  const menuText    = onDark ? '#fff' : '#111';
  const usernameClr = onDark ? '#fff' : '#111';
  const chevronClr  = onDark ? 'rgba(255,255,255,0.6)' : '#888';

  const handleLogout = () => { setDropdownOpen(false); logout(); navigate('/'); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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
        {/* Logo */}
        <Link to="/" className="lp-logo">
          <span className="lp-logo__icon">⚡</span>
          <span className="lp-logo__text" style={{ color: logoColor, transition: 'color 0.3s' }}>
            Work<span className="lp-logo__accent">Hire</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="lp-nav__links">
          {['Home', 'Workers', 'Services', 'About', 'Contact'].map((l) => (
            <Link
              key={l}
              to={l === 'Home' ? '/' : `/${l.toLowerCase()}`}
              className="lp-nav__link"
              style={{ color: linkColor, transition: 'color 0.3s' }}
            >
              {l}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="lp-nav__right">
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', border: 'none', background: dropdownOpen ? 'rgba(255,255,255,0.15)' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span style={{ fontWeight: 600, color: usernameClr, fontSize: '14px', transition: 'color 0.3s' }}>{user.name?.split(' ')[0]}</span>
                <svg style={{ width: '14px', height: '14px', color: chevronClr, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s, color 0.3s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '200px', borderRadius: '14px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', zIndex: 999 }}>
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
          <button
            className="lp-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ borderColor: menuBorder, color: menuText, transition: 'color 0.3s, border-color 0.3s' }}
          >
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

export default function AboutPage() {
  return (
    <div className="lp-root">
      <SharedNavbar />

      {/* HERO */}
      <section style={{ paddingTop: '68px', background: '#111', minHeight: '420px', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center', width: '100%' }}>
          <p className="lp-overline lp-overline--amber">Our Story</p>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.08, margin: '0 0 1.25rem' }}>
            We're on a mission to make<br />
            <span style={{ color: '#f97316' }}>home services dignified.</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
            WorkHire was born from a simple belief — every skilled professional deserves fair work, and every homeowner deserves reliable help.
          </p>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ background: '#f97316', padding: '0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', textAlign: 'center' }}>
          {[['500+', 'Verified Pros'], ['50k+', 'Happy Homes'], ['12', 'Cities'], ['4.9★', 'Avg Rating']].map(([v, l]) => (
            <div key={l} style={{ padding: '2rem 1rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '2rem', color: '#fff', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.4rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MISSION */}
      <section className="lp-section" style={{ background: '#f2f0eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', padding: '0 2rem' }}>
          <div>
            <p className="lp-overline">Our Mission</p>
            <h2 className="lp-section__title" style={{ textAlign: 'left' }}>
              Connecting homes<br />with people who care.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.8, margin: '0 0 1.25rem' }}>
              In India, millions of skilled tradespeople struggle to find consistent, fairly-paid work. At the same time, homeowners waste hours searching for reliable help with no guarantee of quality.
            </p>
            <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.8, margin: 0 }}>
              WorkHire fixes both sides of this problem — giving professionals a steady income stream while giving homeowners a trusted, vetted service with every booking.
            </p>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="lp-section" style={{ background: '#fff' }}>
        <div className="lp-section__inner">
          <p className="lp-overline">Our Journey</p>
          <h2 className="lp-section__title">How We Got Here</h2>
          <p className="lp-section__sub" style={{ marginBottom: '3.5rem' }}>Five years of relentless building, one milestone at a time.</p>
          <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ position: 'absolute', left: '28px', top: '8px', bottom: '8px', width: '2px', background: 'rgba(0,0,0,0.08)', borderRadius: '2px' }} />
            {MILESTONES.map(({ year, event }, i) => (
              <div key={year} style={{ display: 'flex', gap: '1.5rem', marginBottom: i < MILESTONES.length - 1 ? '2rem' : 0, position: 'relative' }}>
                <div style={{ flexShrink: 0, width: '58px', height: '58px', borderRadius: '50%', background: i === MILESTONES.length - 1 ? '#f97316' : '#f2f0eb', border: '2px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.8rem', color: i === MILESTONES.length - 1 ? '#fff' : '#111', zIndex: 1 }}>
                  {year}
                </div>
                <div style={{ paddingTop: '12px' }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#333', lineHeight: 1.7 }}>{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="lp-section" style={{ background: '#f2f0eb' }}>
        <div className="lp-section__inner">
          <p className="lp-overline lp-overline--amber">What We Stand For</p>
          <h2 className="lp-section__title">Our Core Values</h2>
          <p className="lp-section__sub" style={{ marginBottom: '3.5rem' }}>The principles that guide every decision we make.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="lp-step-card">
                <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>{icon}</div>
                <h3 className="lp-step-title">{title}</h3>
                <p className="lp-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="lp-section" style={{ background: '#fff' }}>
        <div className="lp-section__inner">
          <p className="lp-overline">The People</p>
          <h2 className="lp-section__title">Meet the Team</h2>
          <p className="lp-section__sub" style={{ marginBottom: '3.5rem' }}>Builders, operators and believers — all obsessed with quality.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
            {TEAM.map(({ name, role, emoji, desc }) => (
              <div key={name} style={{ background: '#f2f0eb', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'left', transition: 'transform 0.22s, box-shadow 0.22s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>{emoji}</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#111', margin: '0 0 0.2rem' }}>{name}</h3>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f97316', margin: '0 0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{role}</p>
                <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-cta-banner">
            <div className="lp-cta-banner__bg-text" aria-hidden="true">JOIN</div>
            <p className="lp-overline lp-overline--amber">Be Part of It</p>
            <h2 className="lp-cta-banner__title">
              Join 500+ pros and<br />
              <span className="lp-cta-banner__accent">50,000 happy homes.</span>
            </h2>
            <p className="lp-cta-banner__sub">Whether you need help or want to offer it — WorkHire is for you.</p>
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
