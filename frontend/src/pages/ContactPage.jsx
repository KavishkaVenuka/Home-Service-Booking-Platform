import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

const FAQS = [
  { q: 'How quickly can I get a professional?', a: 'Most bookings are confirmed within 30 minutes. Same-day slots are available for many services.' },
  { q: 'Are your professionals background-checked?', a: 'Yes — every professional is ID-verified and police-cleared before they appear on the platform.' },
  { q: 'What if I\'m not satisfied with the work?', a: 'All services are backed by our 30-day redo guarantee. If you\'re not happy, we\'ll send someone to fix it for free.' },
  { q: 'How does pricing work?', a: 'You receive a fixed quote before confirming. There are no hidden fees — what you see is what you pay.' },
];

const OFFICES = [
  { city: 'Bengaluru', address: '12 MG Road, Bengaluru 560001', phone: '+91 80 4567 8901', emoji: '🏙️' },
  { city: 'Mumbai', address: '45 Bandra West, Mumbai 400050', phone: '+91 22 6789 0123', emoji: '🌆' },
  { city: 'Delhi', address: '7 Connaught Place, New Delhi 110001', phone: '+91 11 2345 6789', emoji: '🕌' },
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

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#111', margin: '0 0 0.5rem' }}>Message Sent!</h3>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>We'll get back to you within 24 hours.</p>
        <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} style={{ marginTop: '1.5rem', padding: '0.6rem 1.5rem', borderRadius: '999px', border: '1.5px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Send Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.4rem' }}>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid rgba(0,0,0,0.12)', background: '#f9f8f5', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.4rem' }}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid rgba(0,0,0,0.12)', background: '#f9f8f5', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.4rem' }}>Subject</label>
        <input name="subject" value={form.subject} onChange={handleChange} required placeholder="How can we help?" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid rgba(0,0,0,0.12)', background: '#f9f8f5', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.4rem' }}>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us more..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid rgba(0,0,0,0.12)', background: '#f9f8f5', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />
      </div>
      <button type="submit" disabled={loading} className="lp-btn lp-btn--dark" style={{ alignSelf: 'flex-start', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Sending…' : 'Send Message'} {!loading && <span className="lp-btn__arrow">↗</span>}
      </button>
    </form>
  );
}

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="lp-root">
      <SharedNavbar />

      {/* HERO */}
      <section style={{ paddingTop: '68px', background: '#f2f0eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
          <p className="lp-overline lp-overline--amber">Get In Touch</p>
          <h1 className="lp-section__title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1rem' }}>
            We'd love to<br />
            <span style={{ color: '#f97316' }}>hear from you.</span>
          </h1>
          <p className="lp-section__sub" style={{ maxWidth: '500px', margin: '0 auto' }}>
            Questions, feedback, partnership enquiries — our team responds within 24 hours.
          </p>
        </div>
      </section>

      {/* CONTACT SPLIT */}
      <section className="lp-section" style={{ background: '#fff', paddingTop: '3rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* LEFT — info */}
          <div>
            <p className="lp-overline">Contact Details</p>
            <h2 className="lp-section__title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Let's start a conversation</h2>
            <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.75, marginBottom: '2.5rem' }}>
              Whether you have a question about a booking, want to join as a professional, or just want to say hello — we're here.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: '📧', label: 'Email', value: 'hello@workhire.in' },
                { icon: '📞', label: 'Phone', value: '+91 80 4567 8900' },
                { icon: '🕐', label: 'Hours', value: 'Mon–Sat, 8 AM – 8 PM IST' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: '#111' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem' }}>
              {['𝕏', 'in', 'f', '▶'].map((s) => (
                <div key={s} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#333', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.background = '#fff7f0'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = 'transparent'; }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{ background: '#f2f0eb', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: '#111', margin: '0 0 1.5rem' }}>Send us a message</h3>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="lp-section" style={{ background: '#f2f0eb' }}>
        <div className="lp-section__inner">
          <p className="lp-overline">Find Us</p>
          <h2 className="lp-section__title">Our Offices</h2>
          <p className="lp-section__sub" style={{ marginBottom: '3rem' }}>Drop by any of our offices for a face-to-face chat.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {OFFICES.map(({ city, address, phone, emoji }) => (
              <div key={city} style={{ background: '#fff', borderRadius: '1.25rem', padding: '2rem', border: '1px solid rgba(0,0,0,0.07)', textAlign: 'left', transition: 'transform 0.22s, box-shadow 0.22s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>{emoji}</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#111', margin: '0 0 0.4rem' }}>{city}</h3>
                <p style={{ fontSize: '0.875rem', color: '#666', margin: '0 0 0.4rem', lineHeight: 1.6 }}>{address}</p>
                <p style={{ fontSize: '0.875rem', color: '#f97316', fontWeight: 600, margin: 0 }}>{phone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section" style={{ background: '#fff' }}>
        <div className="lp-section__inner" style={{ maxWidth: '720px' }}>
          <p className="lp-overline">FAQ</p>
          <h2 className="lp-section__title">Common Questions</h2>
          <p className="lp-section__sub" style={{ marginBottom: '3rem' }}>Can't find what you're looking for? Drop us a message above.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
            {FAQS.map(({ q, a }, i) => (
              <div key={i} style={{ border: '1.5px solid rgba(0,0,0,0.09)', borderRadius: '1rem', overflow: 'hidden', transition: 'border-color 0.2s', borderColor: openFaq === i ? '#f97316' : 'rgba(0,0,0,0.09)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>{q}</span>
                  <span style={{ fontSize: '1.25rem', color: '#f97316', flexShrink: 0, marginLeft: '1rem', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.5rem 1.1rem', fontSize: '0.9rem', color: '#666', lineHeight: 1.75 }}>{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-cta-banner">
            <div className="lp-cta-banner__bg-text" aria-hidden="true">HELLO</div>
            <p className="lp-overline lp-overline--amber">Still unsure?</p>
            <h2 className="lp-cta-banner__title">
              Try WorkHire<br />
              <span className="lp-cta-banner__accent">risk-free today.</span>
            </h2>
            <p className="lp-cta-banner__sub">Backed by a 30-day satisfaction guarantee — no questions asked.</p>
            <div className="lp-cta-row lp-cta-row--center">
              <Link to="/register" className="lp-btn lp-btn--amber">Sign Up Free <span className="lp-btn__arrow">↗</span></Link>
              <Link to="/workers" className="lp-btn lp-btn--ghost">Browse Workers</Link>
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
