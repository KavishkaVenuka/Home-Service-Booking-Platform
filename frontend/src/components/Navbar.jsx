import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUser, FiLogIn } from 'react-icons/fi';

const NAV_LINKS = [
  { to: '/',        label: 'Home' },
  { to: '/workers', label: 'Find Workers' },
];

/**
 * Shared Navbar component with responsive mobile menu.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary-700">
            <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-base">
              <FiHome />
            </span>
            HomeServe
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm">
              <FiLogIn size={16}/> Log In
            </Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">
              <FiUser size={16}/> Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="navbar-menu-toggle"
            className="md:hidden btn-ghost p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 animate-slide-up">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm font-medium border-b border-gray-50
                ${isActive ? 'text-primary-600' : 'text-gray-600'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex gap-2 mt-3">
            <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-ghost flex-1 justify-center text-sm">Log In</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 justify-center text-sm">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
