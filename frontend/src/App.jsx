import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WorkerProfile from './pages/WorkerProfile';
import BookingSystem from './pages/BookingSystem';
import RatingReview from './pages/RatingReview';

/**
 * Root application component.
 * Defines the top-level route structure and wraps all pages
 * with the shared Navbar and Footer layout.
 */
function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/"                      element={<Home />} />
          <Route path="/workers/:id"           element={<WorkerProfile />} />
          <Route path="/book/:workerId"        element={<BookingSystem />} />
          <Route path="/review/:bookingId"     element={<RatingReview />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
                <h1 className="text-6xl font-heading font-bold text-primary-600">404</h1>
                <p className="text-gray-500 text-lg">Page not found</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
