import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyBookings, updateBookingStatus, submitReview } from '../api';
import StarRating from '../components/StarRating';
import Toast from '../components/Toast';
import {
  User, Mail, Phone, Calendar, MapPin, DollarSign,
  Briefcase, CheckCircle, AlertCircle, Loader2, LogOut,
  ArrowLeft, Search, Clock, ShieldCheck, Heart, Award
} from 'lucide-react';

const STATUS_COLORS = {
  pending:     'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed:   'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-violet-100 text-violet-800 border-violet-200',
  completed:   'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled:   'bg-red-100 text-red-800 border-red-200',
};

const MOCK_BOOKINGS = [
  { id: 'b1', service: 'Fix kitchen tap', status: 'completed', scheduled_at: new Date(Date.now() - 86400000 * 2).toISOString(), total_price: '130.00', address: '45 Oak Ave', worker_name: 'Alex Rivera', worker_avatar: null, worker_id: 'm1', customer_id: 'u1' },
  { id: 'b2', service: 'Rewire outdoor socket', status: 'confirmed', scheduled_at: new Date(Date.now() + 86400000).toISOString(), total_price: '160.00', address: '12 Elm St', worker_name: 'Priya Sharma', worker_avatar: null, worker_id: 'm2', customer_id: 'u1' },
  { id: 'b3', service: 'Deep clean living room', status: 'pending', scheduled_at: new Date(Date.now() + 86400000 * 3).toISOString(), total_price: '80.00', address: '99 Pine Rd', worker_name: 'Carlos Mendez', worker_avatar: null, worker_id: 'm3', customer_id: 'u1' },
];

function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(booking.id, booking.worker_id, rating, comment);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 800, color: '#111', fontFamily: 'Outfit, sans-serif' }}>Leave a Review</h2>
        <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: '#666' }}>Share your feedback for <strong style={{ color: '#111' }}>{booking.service}</strong> with {booking.worker_name}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: '8px' }}>Your Rating</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  style={{ fontSize: '2rem', border: 'none', background: 'none', cursor: 'pointer', color: s <= rating ? '#f97316' : '#e5e7eb', transition: 'transform 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: '8px' }}>Comment</label>
            <textarea
              id="review-comment"
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '0.9rem', outline: 'none', minHeight: '100px', resize: 'none', background: '#f9f8f5' }}
              placeholder="Tell us what you liked or how they can improve…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: '12px', border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px 0', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(249,115,22,0.3)', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
                      <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h4a3 3 0 013 3v1" /></svg>
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

function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid rgba(0,0,0,0.08)',
      borderRadius: '1.25rem',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      ...style
    }}>
      {children}
    </div>
  );
}

export default function UserDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile'

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (user.role === 'worker') { navigate('/worker/dashboard'); return; }

    fetchMyBookings()
      .then(({ data }) => { setBookings(data.bookings || []); })
      .catch(() => { setBookings(MOCK_BOOKINGS); setUsingMock(true); })
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const handleCancel = async (id) => {
    if (usingMock) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
      setToast({ type: 'success', message: 'Booking cancelled (demo mode).' });
      return;
    }
    try {
      await updateBookingStatus(id, 'cancelled');
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
      setToast({ type: 'success', message: 'Booking cancelled.' });
    } catch {
      setToast({ type: 'error', message: 'Could not cancel booking.' });
    }
  };

  const handleReviewSubmit = async (bookingId, workerId, rating, comment) => {
    if (usingMock) { setToast({ type: 'success', message: 'Review submitted! (demo mode)' }); return; }
    try {
      await submitReview({ booking_id: bookingId, rating, comment });
      setToast({ type: 'success', message: 'Review submitted — thank you!' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Could not submit review.' });
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  const fmtCurrency = (n) => `₹${parseFloat(n || 0).toFixed(2)}`;

  const FILTERS = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  const displayed = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  // Statistics calculation
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in_progress').length;
  const totalSpent = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} color="#f97316" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const initials = (user.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="lp-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SharedNavbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {reviewing && (
        <ReviewModal
          booking={reviewing}
          onClose={() => setReviewing(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* DASHBOARD HERO */}
      <section style={{ paddingTop: '68px', background: '#f2f0eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem 2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: '1.5rem',
                boxShadow: '0 4px 14px rgba(249,115,22,0.2)'
              }}>
                {initials}
              </div>
              <div>
                <h1 className="lp-section__title" style={{ fontSize: '1.75rem', marginBottom: '4px', textAlign: 'left' }}>
                  Welcome back, <span style={{ color: '#f97316' }}>{user.name.split(' ')[0]}</span>
                </h1>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>Manage your appointments, request services, and review history</p>
              </div>
            </div>
            <Link to="/workers" className="lp-btn lp-btn--dark" style={{ textDecoration: 'none' }}>
              Book a Service <span style={{ marginLeft: '4px' }}>⚡</span>
            </Link>
          </div>

          {usingMock && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '1.5rem', background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '999px', padding: '6px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#c2410c' }}>
              ⚠ Showing demo data — connect backend to view real bookings
            </div>
          )}
        </div>
      </section>

      {/* STATS ROW */}
      <section style={{ background: '#f2f0eb', paddingBottom: '3rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Total Bookings', value: totalBookings, icon: '📋', color: '#f97316' },
              { label: 'Active Jobs', value: pendingBookings, icon: '⏳', color: '#3b82f6' },
              { label: 'Completed Jobs', value: completedBookings, icon: '✅', color: '#10b981' },
              { label: 'Total Spent', value: fmtCurrency(totalSpent), icon: '💰', color: '#8b5cf6' }
            ].map((stat, i) => (
              <GlassCard key={i} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>{stat.icon}</div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888' }}>{stat.label}</p>
                  <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#111', fontFamily: 'Outfit, sans-serif' }}>{stat.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* TABS */}
      <section style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', flex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', background: '#f2f0eb', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
            {[
              { id: 'bookings', label: '📅 My Bookings' },
              { id: 'profile', label: '👤 Account Profile' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: 'none',
                  fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.18s',
                  background: activeTab === tab.id ? '#111' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#555',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              {/* Filter pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '2rem' }}>
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '6px 14px', borderRadius: '999px',
                      fontSize: '0.78rem', fontWeight: 600, border: 'none',
                      cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                      background: filter === f ? '#f97316' : '#f2f0eb',
                      color: filter === f ? '#fff' : '#444'
                    }}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Booking cards list */}
              {displayed.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f2f0eb', borderRadius: '1.25rem', border: '1.5px dashed rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#111', margin: '0 0 6px' }}>No bookings found</h3>
                  <p style={{ color: '#78716c', fontSize: '0.875rem', margin: '0 0 20px' }}>You don't have any bookings matching this status right now.</p>
                  <Link to="/workers" className="lp-btn lp-btn--dark" style={{ textDecoration: 'none' }}>Browse Workers</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {displayed.map((b) => {
                    const initials = (b.worker_name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const scheduledDate = new Date(b.scheduled_at).toLocaleString('en-IN', {
                      weekday: 'short', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    });

                    return (
                      <GlassCard key={b.id} style={{ display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Avatar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '1rem', border: '2px solid rgba(0,0,0,0.05)'
                          }}>
                            {initials}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>{b.worker_name}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>Professional Worker</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#111' }}>{b.service}</h3>
                            <span className={`border text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${STATUS_COLORS[b.status] || 'bg-slate-100 text-slate-700'}`}>
                              {b.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', fontSize: '0.8rem', color: '#666' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>📅 {scheduledDate}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>📍 {b.address}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#f97316' }}>{fmtCurrency(b.total_price)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleCancel(b.id)}
                              style={{
                                padding: '6px 14px', borderRadius: '8px', border: '1.5px solid rgba(239,68,68,0.2)',
                                background: 'transparent', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700,
                                cursor: 'pointer', transition: 'background 0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              Cancel Booking
                            </button>
                          )}
                          {b.status === 'completed' && (
                            <button
                              onClick={() => setReviewing(b)}
                              style={{
                                padding: '6px 14px', borderRadius: '8px', border: 'none',
                                background: '#111', color: '#fff', fontSize: '0.78rem', fontWeight: 700,
                                cursor: 'pointer', transition: 'opacity 0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                              onMouseLeave={e => e.currentTarget.style.opacity = 1}
                            >
                              ✎ Leave Review
                            </button>
                          )}
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* Profile Details */}
              <GlassCard>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#111', margin: '0 0 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '10px' }}>
                  Account Information
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                      <User size={16} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>Full Name</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{user.name}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                      <Mail size={16} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>Email Address</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{user.email}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                      <Phone size={16} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>Phone Number</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{user.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>Account Role</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#f97316', textTransform: 'capitalize' }}>{user.role}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Support & Resources Card */}
              <GlassCard style={{ background: '#111', color: '#fff', border: 'none' }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#fff', margin: '0 0 10px' }}>
                  Safety & Guarantee
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '20px' }}>
                  All bookings you place on WorkHire are protected by our satisfaction guarantee.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🛡️</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>30-Day Guarantee</p>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Not satisfied? We will redo the work for free.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>👮</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Vetted Trade Partners</p>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>All professionals have clear background checks.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>💬</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>24/7 Dedicated Support</p>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Any issues? Call us or send a contact request.</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <Link to="/contact" className="lp-btn lp-btn--amber" style={{ padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block' }}>
                    Contact Support
                  </Link>
                </div>
              </GlassCard>
            </div>
          )}
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
