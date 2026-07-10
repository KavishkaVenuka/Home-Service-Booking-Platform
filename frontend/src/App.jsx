import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar       from './components/Navbar';
import LandingPage  from './pages/LandingPage';
import WorkersPage  from './pages/WorkersPage';
import BookingPage  from './pages/BookingPage';
import BookingsPage from './pages/BookingsPage';
import AuthPage     from './pages/AuthPage';

function AppShell() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === '/' || pathname === '/login' || pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hide the global Navbar on landing and auth pages */}
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/"          element={<LandingPage  />} />
          <Route path="/workers"   element={<WorkersPage  />} />
          <Route path="/book/:workerId" element={<BookingPage />} />
          <Route path="/bookings"  element={<BookingsPage />} />
          <Route path="/login"     element={<AuthPage mode="login"    />} />
          <Route path="/register"  element={<AuthPage mode="register" />} />
          {/* 404 */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
              <p className="text-7xl mb-4">🔍</p>
              <h2 className="text-white text-2xl font-bold mb-2">Page not found</h2>
              <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary px-6 py-2.5 no-underline text-sm">← Back to Home</a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
