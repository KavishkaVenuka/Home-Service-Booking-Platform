import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/',         label: 'Home'    },
  { to: '/workers',  label: 'Workers' },
  { to: '/bookings', label: 'My Bookings' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🔧</span>
          <span className="text-white font-bold text-lg tracking-tight">
            Home<span className="gradient-text">Serve</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors no-underline"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'worker' && (
                <Link
                  to="/worker/dashboard"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors no-underline"
                >
                  Dashboard
                </Link>
              )}
              <span className="text-slate-400 text-sm hidden sm:block">
                Hi, <span className="text-white font-medium">{user.name.split(' ')[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors no-underline"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm px-4 py-2 no-underline"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
