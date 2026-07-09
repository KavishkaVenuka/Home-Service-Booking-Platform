import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const ROLES = [
  { value: 'customer', label: '🏠 Customer', desc: 'Book home services' },
  { value: 'worker',   label: '🔧 Worker',   desc: 'Offer your skills'  },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate(form.role === 'worker' ? '/workers' : '/workers');
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="orb w-80 h-80 bg-violet-600/20 top-[-80px] right-[-80px]" />
      <div className="orb w-64 h-64 bg-blue-600/15 bottom-[-60px] left-[-60px]" style={{ animationDelay: '2s' }} />

      <div className="glass rounded-2xl p-10 w-full max-w-md relative">
        <div className="text-center mb-8">
          <span className="text-4xl">✨</span>
          <h1 className="text-white font-bold text-2xl mt-3">Create an Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join thousands using HomeServe today</p>
        </div>

        {/* Role picker */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ROLES.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, role: value }))}
              className={`rounded-xl p-4 text-left border transition-all ${
                form.role === value
                  ? 'border-blue-500 bg-blue-600/20'
                  : 'glass border-white/10 hover:border-blue-500/30'
              }`}
            >
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
            </button>
          ))}
        </div>

        <form id="register-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="reg-name" className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Full Name</label>
            <input
              id="reg-name"
              className="field"
              placeholder="Jane Doe"
              value={form.name}
              onChange={set('name')}
              required
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Email</label>
            <input
              id="reg-email"
              type="email"
              className="field"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="reg-phone" className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Phone (optional)</label>
            <input
              id="reg-phone"
              type="tel"
              className="field"
              placeholder="+1 555 0100"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Password</label>
            <input
              id="reg-password"
              type="password"
              className="field"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" id="register-submit" disabled={loading} className="btn-primary py-3 text-base mt-2">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-medium hover:underline">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
