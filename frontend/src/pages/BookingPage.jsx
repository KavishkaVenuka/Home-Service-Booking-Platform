import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchWorkerById, fetchWorkerReviews, createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import Toast from '../components/Toast';

const MOCK_WORKER = {
  id: 'mock',
  name: 'Alex Rivera',
  service_category: 'Plumbing',
  hourly_rate: '65',
  avg_rating: '4.8',
  total_reviews: 42,
  is_available: true,
  location: 'Downtown',
  years_experience: 10,
  bio: 'Licensed plumber with 10+ years fixing leaks, installing fixtures and full bathroom remodels. Available 7 days a week.',
};

const MOCK_REVIEWS = [
  { id: 'r1', customer_name: 'Sarah K.', rating: 5, comment: 'Alex was punctual, professional, and fixed our pipe issue within an hour. Highly recommend!', created_at: new Date().toISOString() },
  { id: 'r2', customer_name: 'Tom W.',   rating: 4, comment: 'Great work on our bathroom. A little pricey but worth every cent for the quality.', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
];

const today = () => new Date().toISOString().slice(0, 16);
const STARS = [1, 2, 3, 4, 5];

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

function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid rgba(0,0,0,0.08)',
      borderRadius: '1.25rem',
      padding: '28px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      ...style
    }}>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 14px',
  borderRadius: '12px',
  border: '1.5px solid rgba(0,0,0,0.12)',
  background: '#f9f8f5',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};

export default function BookingPage() {
  const { workerId } = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [worker,  setWorker]  = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [usingMock, setUsingMock]   = useState(false);

  const [form, setForm] = useState({
    service: '',
    description: '',
    scheduled_at: '',
    duration_hours: '1',
    address: '',
    notes: '',
  });

  useEffect(() => {
    Promise.all([
      fetchWorkerById(workerId),
      fetchWorkerReviews(workerId),
    ])
      .then(([wRes, rRes]) => {
        setWorker(wRes.data.worker);
        setReviews(rRes.data.reviews || []);
      })
      .catch(() => {
        setWorker(MOCK_WORKER);
        setReviews(MOCK_REVIEWS);
        setUsingMock(true);
      })
      .finally(() => setLoading(false));
  }, [workerId]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const totalPrice = worker
    ? (parseFloat(worker.hourly_rate) * parseFloat(form.duration_hours || 1)).toFixed(2)
    : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (usingMock) {
      setToast({ type: 'success', message: '✓ Booking submitted! (demo mode)' });
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }
    setSubmitting(true);
    try {
      await createBooking({ worker_id: workerId, ...form });
      setToast({ type: 'success', message: 'Booking confirmed! Redirecting to Dashboard…' });
      setForm({ service: '', description: '', scheduled_at: '', duration_hours: '1', address: '', notes: '' });
      setTimeout(() => navigate('/dashboard'), 2200);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Booking failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="lp-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SharedNavbar />
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '6rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ height: '320px', borderRadius: '1.25rem', background: 'linear-gradient(90deg,#e5e2d9 25%,#edeae1 50%,#e5e2d9 75%)', backgroundSize: '200% 100%', animation: 'lp-shimmer-sweep 1.6s infinite linear' }} />
          <div style={{ height: '320px', borderRadius: '1.25rem', background: 'linear-gradient(90deg,#e5e2d9 25%,#edeae1 50%,#e5e2d9 75%)', backgroundSize: '200% 100%', animation: 'lp-shimmer-sweep 1.6s infinite linear' }} />
        </div>
      </div>
    );
  }

  const initials = (worker.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const rating   = parseFloat(worker.avg_rating) || 0;

  return (
    <div className="lp-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SharedNavbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <section style={{ paddingTop: '68px', background: '#f2f0eb', paddingBottom: '4rem', flex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 0' }}>
          
          {usingMock && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '999px', padding: '6px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#c2410c' }}>
              ⚠ Showing demo data — connect your backend for live booking.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            
            {/* LEFT COLUMN: Worker profile & reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '1.25rem', border: '2px solid rgba(0,0,0,0.05)'
                  }}>
                    {initials}
                  </div>
                  <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.35rem', color: '#111', margin: 0 }}>{worker.name}</h1>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>{worker.service_category} · {worker.years_experience || 0} yrs exp</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {STARS.map(s => (
                      <svg key={s} style={{ width: '16px', height: '16px', fill: s <= Math.round(rating) ? '#f97316' : '#e5e7eb' }} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{rating.toFixed(1)}</span>
                  <span style={{ fontSize: '0.78rem', color: '#999' }}>({worker.total_reviews} reviews)</span>
                </div>

                {worker.bio && <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: '#555', lineHeight: 1.65 }}>{worker.bio}</p>}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>📍 {worker.location || 'N/A'}</span>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '3px 10px', borderRadius: '999px',
                    color: worker.is_available ? '#059669' : '#dc2626',
                    background: worker.is_available ? '#dcfce7' : '#fee2e2'
                  }}>
                    {worker.is_available ? 'Available' : 'Busy'}
                  </span>
                </div>
              </GlassCard>

              {/* Reviews List */}
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#111', marginBottom: '16px' }}>
                  Reviews ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                  <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '24px', textAlign: 'center', color: '#888', fontSize: '0.875rem', border: '1.5px solid rgba(0,0,0,0.07)' }}>
                    No reviews yet. Be the first to book and rate!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                    {reviews.map((r) => (
                      <div key={r.id} style={{ background: '#fff', borderRadius: '1.25rem', padding: '16px 20px', border: '1.5px solid rgba(0,0,0,0.07)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{r.customer_name}</span>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {STARS.map(s => (
                              <svg key={s} style={{ width: '13px', height: '13px', fill: s <= r.rating ? '#f97316' : '#e5e7eb' }} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Booking form */}
            <GlassCard>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.35rem', color: '#111', margin: '0 0 4px' }}>Book This Worker</h2>
              <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: '#666' }}>Schedule your home service appointment below.</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: '6px' }} htmlFor="service">
                    Service Type <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="service"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                    placeholder="e.g. Fix kitchen sink leak"
                    value={form.service}
                    onChange={set('service')}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: '6px' }} htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    style={{ ...inputStyle, minHeight: '80px', resize: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                    placeholder="Describe the job requirements details…"
                    value={form.description}
                    onChange={set('description')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: '6px' }} htmlFor="scheduled_at">
                    Date & Time <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="scheduled_at"
                    type="datetime-local"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                    min={today()}
                    value={form.scheduled_at}
                    onChange={set('scheduled_at')}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: '6px' }} htmlFor="duration_hours">
                    Duration (hours)
                  </label>
                  <select
                    id="duration_hours"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                    value={form.duration_hours}
                    onChange={set('duration_hours')}
                  >
                    {[1, 2, 3, 4, 6, 8].map((h) => (
                      <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: '6px' }} htmlFor="address">
                    Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="address"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                    placeholder="123 Street Name, City"
                    value={form.address}
                    onChange={set('address')}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: '6px' }} htmlFor="notes">
                    Notes for the Worker
                  </label>
                  <input
                    id="notes"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                    placeholder="e.g. Access codes, instructions"
                    value={form.notes}
                    onChange={set('notes')}
                  />
                </div>

                {/* Estimate box */}
                <div style={{ background: '#f2f0eb', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>Estimated Total</p>
                    <p style={{ margin: '4px 0 0', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.35rem', color: '#f97316' }}>₹{totalPrice}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#888' }}>
                    ₹{parseFloat(worker.hourly_rate).toFixed(0)}/hr × {form.duration_hours || 1} hr
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !worker.is_available}
                  className="lp-btn lp-btn--dark"
                  style={{ width: '100%', padding: '12px 0', fontSize: '0.95rem', borderRadius: '12px', justifyContent: 'center', marginTop: '12px' }}
                >
                  {!worker.is_available
                    ? 'Worker Unavailable'
                    : submitting
                    ? 'Booking…'
                    : user
                    ? 'Confirm Booking'
                    : 'Log in to Book'}
                </button>

                {!user && (
                  <p style={{ textAlign: 'center', margin: '12px 0 0', fontSize: '0.78rem', color: '#888' }}>
                    You must be logged in to book.{' '}
                    <a href="/login" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>Log in →</a>
                  </p>
                )}
              </form>
            </GlassCard>

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
