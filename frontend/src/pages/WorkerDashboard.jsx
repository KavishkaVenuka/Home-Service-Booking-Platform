import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchMyWorkerProfile,
  updateMyWorkerProfile,
  createWorkerProfile,
  fetchWorkerJobBookings,
  updateBookingStatus,
} from '../api';
import {
  User, Phone, MapPin, DollarSign, Briefcase, Star,
  Clock, ToggleLeft, ToggleRight, Save, ChevronRight,
  Calendar, CheckCircle, AlertCircle, Loader2, LogOut,
  Image, FileText, Home, ArrowLeft,
} from 'lucide-react';

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const SERVICE_CATEGORIES = [
  'Plumbing', 'Electrical', 'Cleaning', 'Carpentry',
  'Painting', 'Gardening', 'HVAC', 'Security', 'Other',
];

const STATUS_META = {
  pending:     { label: 'Pending',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  confirmed:   { label: 'Confirmed',   color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  in_progress: { label: 'In Progress', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)'  },
  completed:   { label: 'Completed',   color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  cancelled:   { label: 'Cancelled',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
};

const STATUS_TRANSITIONS = {
  pending:     'confirmed',
  confirmed:   'in_progress',
  in_progress: 'completed',
};

const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const fmtCurrency = (n) => `₹${parseFloat(n || 0).toFixed(2)}`;

/* ─── Sub-components ───────────────────────────────────────────────────── */
function Avatar({ src, name, size = 80 }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return src ? (
    <img
      src={src}
      alt={name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(249,115,22,0.4)' }}
      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.35, fontFamily: 'Outfit,sans-serif',
      border: '3px solid rgba(249,115,22,0.4)',
    }}>{initials}</div>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '3px 10px', borderRadius: 999, color: meta.color, background: meta.bg,
    }}>{meta.label}</span>
  );
}

function GlassCard({ children, style = {}, className = '' }) {
  return (
    <div className={className} style={{
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.7)',
      borderRadius: 20,
      boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
      padding: 28,
      ...style,
    }}>
      {children}
    </div>
  );
}

function FieldRow({ icon: Icon, label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#78716c', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        <Icon size={13} /> {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 12,
  border: '1.5px solid rgba(214,211,209,0.8)', background: 'rgba(255,255,255,0.7)',
  fontSize: 14, color: '#1c1917', outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

/* ─── Main Dashboard ───────────────────────────────────────────────────── */
export default function WorkerDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect only after auth state has been resolved (avoids flash-redirect on refresh)
  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate('/login');
    else if (user.role !== 'worker') navigate('/workers');
  }, [user, authLoading, navigate]);

  const [profile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false); // false = no DB row yet
  const [bookings, setBookings] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null); // { type:'success'|'error', text }
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'bookings'

  // Form state
  const [form, setForm] = useState({
    name: '', phone: '', avatar_url: '',
    bio: '', service_category: '', hourly_rate: '',
    years_experience: '', location: '', is_available: true,
  });

  /* Load profile */
  useEffect(() => {
    if (!user) return;
    setLoadingProfile(true);
    fetchMyWorkerProfile()
      .then(({ data }) => {
        const w = data.worker;
        setProfile(w);
        setProfileExists(true);
        setForm({
          name:             w.name             || '',
          phone:            w.phone            || '',
          avatar_url:       w.avatar_url       || '',
          bio:              w.bio              || '',
          service_category: w.service_category || '',
          hourly_rate:      w.hourly_rate      || '',
          years_experience: w.years_experience || '',
          location:         w.location         || '',
          is_available:     w.is_available     ?? true,
        });
      })
      .catch((err) => {
        // 404 = no worker profile created yet — show blank form, allow creating
        if (err.response?.status === 404) {
          setProfileExists(false);
          setForm(f => ({ ...f, name: user.name || '', phone: user.phone || '' }));
        } else {
          setSaveMsg({ type: 'error', text: 'Could not load your profile.' });
        }
      })
      .finally(() => setLoadingProfile(false));
  }, [user]);

  /* Load bookings */
  useEffect(() => {
    if (!user) return;
    setLoadingBookings(true);
    fetchWorkerJobBookings()
      .then(({ data }) => setBookings(data.bookings || []))
      .catch(() => {})
      .finally(() => setLoadingBookings(false));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.service_category) {
      setSaveMsg({ type: 'error', text: 'Please select a service category before saving.' });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        avatar_url: form.avatar_url,
        bio: form.bio,
        service_category: form.service_category,
        hourly_rate: parseFloat(form.hourly_rate) || 0,
        years_experience: parseInt(form.years_experience, 10) || 0,
        location: form.location,
        is_available: form.is_available,
      };

      let updatedWorker;
      if (!profileExists) {
        // First time — create the worker row
        const { data } = await createWorkerProfile(payload);
        updatedWorker = data.worker;
        setProfileExists(true);
      } else {
        const { data } = await updateMyWorkerProfile(profile.id, payload);
        updatedWorker = data.worker;
      }

      setProfile(prev => ({ ...(prev || {}), ...updatedWorker }));
      setSaveMsg({
        type: 'success',
        text: profileExists ? 'Profile saved! Your listing is live on the Workers page.' : 'Profile created! You are now visible on the Workers page.',
      });
    } catch (err) {
      setSaveMsg({ type: 'error', text: err.response?.data?.message || 'Save failed. Try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 6000);
    }
  };

  const handleToggleAvailability = async () => {
    const newVal = !form.is_available;
    setForm(f => ({ ...f, is_available: newVal }));
    if (!profileExists || !profile) return; // no remote call until profile is created
    try {
      await updateMyWorkerProfile(profile.id, {
        name: form.name, phone: form.phone, avatar_url: form.avatar_url,
        bio: form.bio, service_category: form.service_category,
        hourly_rate: parseFloat(form.hourly_rate) || 0,
        years_experience: parseInt(form.years_experience, 10) || 0,
        location: form.location, is_available: newVal,
      });
      setProfile(prev => ({ ...prev, is_available: newVal }));
    } catch {
      setForm(f => ({ ...f, is_available: !newVal })); // revert
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status.');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (authLoading || !user) return (
    <div style={{ minHeight: '100vh', background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={40} color="#f97316" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', background: '#f2f0eb', fontFamily: "'Outfit', 'Inter', sans-serif",
      color: '#1c1917', position: 'relative',
    }}>
      {/* Subtle background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 70%)', bottom: -100, left: -100 }} />
      </div>

      {/* ── Top Header ─────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(242,240,235,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(214,211,209,0.5)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#78716c', fontSize: 13 }}>
              <ArrowLeft size={16} /> Home
            </Link>
            <span style={{ color: '#d6d3d1' }}>|</span>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: '#111' }}>
              ⚡ Worker <span style={{ color: '#f97316' }}>Dashboard</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Availability pill */}
            <button
              onClick={handleToggleAvailability}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px',
                borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                transition: 'all 0.2s',
                background: form.is_available ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
                color: form.is_available ? '#059669' : '#dc2626',
              }}
            >
              {form.is_available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              {form.is_available ? 'Online' : 'Offline'}
            </button>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar src={form.avatar_url || profile?.avatar_url} name={form.name || user.name} size={36} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1c1917' }}>{(form.name || user.name).split(' ')[0]}</span>
            </div>

            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, border: '1.5px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Body ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>

        {/* Stats Row */}
        {profile && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { icon: Star,      label: 'Avg Rating',    value: parseFloat(profile.avg_rating || 0).toFixed(1) + ' ★', color: '#f59e0b' },
              { icon: CheckCircle, label: 'Total Reviews', value: profile.total_reviews || 0, color: '#10b981' },
              { icon: DollarSign, label: 'Hourly Rate',   value: fmtCurrency(profile.hourly_rate), color: '#3b82f6' },
              { icon: Briefcase,  label: 'Experience',    value: (profile.years_experience || 0) + ' yrs', color: '#8b5cf6' },
            ].map(({ icon: Icon, label, value, color }) => (
              <GlassCard key={label} style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: '#78716c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1c1917', lineHeight: 1.2 }}>{value}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.5)', borderRadius: 14, padding: 4, width: 'fit-content', border: '1px solid rgba(214,211,209,0.5)' }}>
          {[{ id: 'profile', label: '👤 My Profile' }, { id: 'bookings', label: `📋 Jobs (${bookings.length})` }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                fontFamily: 'inherit', transition: 'all 0.2s',
                background: activeTab === tab.id ? '#f97316' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#78716c',
                boxShadow: activeTab === tab.id ? '0 2px 12px rgba(249,115,22,0.25)' : 'none',
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* ── Profile Tab ──────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <GlassCard>
            {loadingProfile ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <Loader2 size={32} color="#f97316" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(214,211,209,0.4)' }}>
                  <Avatar src={form.avatar_url} name={form.name || user.name} size={72} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1c1917' }}>{form.name || user.name}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#78716c' }}>{profile?.service_category} Professional</p>
                  </div>
                </div>

                {/* No profile yet — first-time prompt */}
                {!profileExists && !loadingProfile && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20,
                    padding: '14px 18px', borderRadius: 12, fontSize: 13, fontWeight: 500,
                    background: 'rgba(59,130,246,0.08)', color: '#2563eb',
                    border: '1px solid rgba(59,130,246,0.25)',
                  }}>
                    <span style={{ fontSize: 22 }}>👋</span>
                    <div>
                      <strong style={{ display: 'block', marginBottom: 2 }}>Set up your public profile</strong>
                      Fill in your details below and click <em>Save Profile</em> to go live on the Workers page. Customers will be able to find and book you.
                    </div>
                  </div>
                )}

                {/* Save feedback */}
                {saveMsg && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 20,
                    padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                    background: saveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: saveMsg.type === 'success' ? '#059669' : '#dc2626',
                    border: `1px solid ${saveMsg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {saveMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      {saveMsg.text}
                    </span>
                    {saveMsg.type === 'success' && (
                      <Link to="/workers" style={{ fontSize: 12, fontWeight: 700, color: '#059669', textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                        View on Workers Page →
                      </Link>
                    )}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                  <FieldRow icon={User} label="Full Name">
                    <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Your full name" />
                  </FieldRow>

                  <FieldRow icon={Phone} label="Phone">
                    <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+91 98765 43210" type="tel" />
                  </FieldRow>

                  <FieldRow icon={Image} label="Avatar URL">
                    <input name="avatar_url" value={form.avatar_url} onChange={handleChange} style={inputStyle} placeholder="https://example.com/photo.jpg" type="url" />
                  </FieldRow>

                  <FieldRow icon={Briefcase} label="Service Category">
                    <select name="service_category" value={form.service_category} onChange={handleChange} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select category…</option>
                      {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FieldRow>

                  <FieldRow icon={DollarSign} label="Hourly Rate (₹)">
                    <input name="hourly_rate" value={form.hourly_rate} onChange={handleChange} style={inputStyle} placeholder="500" type="number" min="0" step="0.01" />
                  </FieldRow>

                  <FieldRow icon={Clock} label="Years of Experience">
                    <input name="years_experience" value={form.years_experience} onChange={handleChange} style={inputStyle} placeholder="3" type="number" min="0" max="60" />
                  </FieldRow>

                  <FieldRow icon={MapPin} label="Location">
                    <input name="location" value={form.location} onChange={handleChange} style={inputStyle} placeholder="City, State" />
                  </FieldRow>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <FieldRow icon={FileText} label="Bio / Description">
                      <textarea
                        name="bio" value={form.bio} onChange={handleChange}
                        style={{ ...inputStyle, minHeight: 110, resize: 'vertical', lineHeight: 1.6 }}
                        placeholder="Tell customers about your skills, experience, and what makes you great…"
                      />
                    </FieldRow>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(214,211,209,0.4)' }}>
                  {/* Availability toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#57534e' }}>Available for bookings</span>
                    <button
                      type="button" onClick={handleToggleAvailability}
                      style={{
                        width: 48, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s',
                        background: form.is_available ? '#f97316' : '#d6d3d1',
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', background: '#fff',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.25s',
                        left: form.is_available ? 25 : 3,
                      }} />
                    </button>
                  </div>

                  <button
                    type="submit" disabled={saving}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '11px 28px', borderRadius: 14, border: 'none', cursor: 'pointer',
                      background: saving ? '#d6d3d1' : 'linear-gradient(135deg,#f97316,#ea580c)',
                      color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
                      boxShadow: saving ? 'none' : '0 4px 16px rgba(249,115,22,0.35)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                    {saving ? 'Saving…' : 'Save Profile'}
                  </button>
                </div>
              </form>
            )}
          </GlassCard>
        )}

        {/* ── Bookings Tab ─────────────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div>
            {loadingBookings ? (
              <GlassCard style={{ textAlign: 'center', padding: 60 }}>
                <Loader2 size={32} color="#f97316" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: 16, color: '#78716c' }}>Loading your jobs…</p>
              </GlassCard>
            ) : bookings.length === 0 ? (
              <GlassCard style={{ textAlign: 'center', padding: 60 }}>
                <Calendar size={48} color="#d6d3d1" style={{ marginBottom: 16 }} />
                <h3 style={{ margin: 0, color: '#78716c', fontWeight: 600 }}>No bookings yet</h3>
                <p style={{ margin: '8px 0 0', color: '#a8a29e', fontSize: 14 }}>Customers will book you once your profile is visible.</p>
              </GlassCard>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {bookings.map(b => {
                  const nextStatus = STATUS_TRANSITIONS[b.status];
                  return (
                    <GlassCard key={b.id} style={{ padding: 22 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        {/* Left: booking info */}
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 16 }}>{b.service}</span>
                            <StatusBadge status={b.status} />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '6px 20px', fontSize: 13, color: '#78716c' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <User size={12} /> <strong style={{ color: '#1c1917' }}>Customer:</strong>&nbsp;{b.customer_name || 'Unknown'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Calendar size={12} /> {fmtDate(b.scheduled_at)}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <MapPin size={12} /> {b.address || '—'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <DollarSign size={12} /> {fmtCurrency(b.total_price)}
                            </span>
                            {b.duration_hours && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Clock size={12} /> {b.duration_hours}h
                              </span>
                            )}
                          </div>

                          {b.description && (
                            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#57534e', background: 'rgba(0,0,0,0.03)', padding: '8px 12px', borderRadius: 8 }}>
                              {b.description}
                            </p>
                          )}
                        </div>

                        {/* Right: action button */}
                        {nextStatus && (
                          <button
                            onClick={() => handleStatusChange(b.id, nextStatus)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px',
                              borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                              fontFamily: 'inherit', whiteSpace: 'nowrap',
                              background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff',
                              boxShadow: '0 3px 12px rgba(249,115,22,0.3)', transition: 'all 0.2s',
                            }}
                          >
                            {nextStatus === 'confirmed'   && '✓ Confirm'}
                            {nextStatus === 'in_progress' && '▶ Start Job'}
                            {nextStatus === 'completed'   && '✅ Mark Done'}
                            <ChevronRight size={14} />
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
      </div>

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
