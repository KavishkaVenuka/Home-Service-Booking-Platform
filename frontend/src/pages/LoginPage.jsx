import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/workers');
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Login failed. Check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Orbs */}
      <div className="orb w-80 h-80 bg-blue-600/20 top-[-60px] left-[-80px]" />
      <div className="orb w-64 h-64 bg-violet-600/15 bottom-[-40px] right-[-60px]" style={{ animationDelay: '3s' }} />

      <div className="glass rounded-2xl p-10 w-full max-w-md relative">
        <div className="text-center mb-8">
          <span className="text-4xl">🔧</span>
          <h1 className="text-white font-bold text-2xl mt-3">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your HomeServe account</p>
        </div>

        <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="login-email" className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Email</label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Password</label>
            <input
              id="login-password"
              type="password"
              className="field"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" id="login-submit" disabled={loading} className="btn-primary py-3 text-base mt-1">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-medium hover:underline">
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
