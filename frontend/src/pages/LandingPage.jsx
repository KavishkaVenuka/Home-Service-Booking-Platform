import { Link } from 'react-router-dom';

const SERVICES = [
  { icon: '🔧', label: 'Plumbing'    },
  { icon: '⚡', label: 'Electrical'  },
  { icon: '🧹', label: 'Cleaning'    },
  { icon: '🪚', label: 'Carpentry'   },
  { icon: '🎨', label: 'Painting'    },
  { icon: '🌿', label: 'Gardening'   },
  { icon: '❄️', label: 'HVAC'        },
  { icon: '🔒', label: 'Security'    },
];

const STATS = [
  { value: '500+', label: 'Verified Pros'     },
  { value: '12k+', label: 'Jobs Completed'    },
  { value: '4.9★', label: 'Average Rating'    },
  { value: '24/7', label: 'Support Available' },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ── Background orbs ── */}
      <div className="orb w-[500px] h-[500px] bg-blue-600/20 top-[-120px] left-[-150px]" />
      <div className="orb w-[400px] h-[400px] bg-violet-600/15 top-[60px] right-[-100px]" style={{ animationDelay: '2s' }} />
      <div className="orb w-[300px] h-[300px] bg-emerald-600/10 top-[400px] left-[30%]" style={{ animationDelay: '4s' }} />

      {/* ════ HERO ════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-blue-300 font-medium mb-8 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Trusted Home Services Platform
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white max-w-4xl">
          Find the&nbsp;
          <span className="gradient-text">Perfect Pro</span>
          <br />for Every Job
        </h1>

        <p className="mt-6 text-slate-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
          Book verified, background-checked home service professionals in minutes.
          Plumbing, electrical, cleaning, and more — all at transparent rates.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/workers" id="hero-browse-workers" className="btn-primary px-8 py-3 text-base no-underline">
            Browse Workers →
          </Link>
          <Link to="/register" className="glass glass-hover rounded-lg px-8 py-3 text-white font-semibold text-base no-underline transition-all">
            Join as a Pro
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl w-full">
          {STATS.map(({ value, label }) => (
            <div key={label} className="glass rounded-xl py-5 px-4">
              <p className="text-white text-2xl font-bold gradient-text">{value}</p>
              <p className="text-slate-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ HOW IT WORKS ════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="section-title">How HomeServe Works</h2>
          <p className="section-sub max-w-xl mx-auto">From browse to booked in under 3 minutes.</p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Browse Profiles',  desc: 'Explore skilled professionals filtered by service category, rating, and availability.' },
              { step: '02', icon: '📅', title: 'Book Instantly',   desc: 'Pick your date, time, and address. Get a price estimate before you confirm.' },
              { step: '03', icon: '⭐', title: 'Rate & Review',    desc: 'After the job, leave a rating to help others find the best pros on the platform.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="glass glass-hover rounded-2xl p-8 text-left relative overflow-hidden">
                <span className="absolute top-4 right-5 text-5xl font-black text-white/5 select-none">{step}</span>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SERVICE CATEGORIES ════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Categories</p>
          <h2 className="section-title">Every Service You Need</h2>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SERVICES.map(({ icon, label }) => (
              <Link
                key={label}
                to={`/workers?category=${label}`}
                id={`category-${label.toLowerCase()}`}
                className="glass glass-hover rounded-xl py-6 flex flex-col items-center gap-3 no-underline"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-slate-200 text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA BANNER ════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass rounded-3xl px-10 py-14 text-center overflow-hidden">
            <div className="orb w-64 h-64 bg-blue-600/25 top-[-40px] left-[-60px]" />
            <div className="orb w-48 h-48 bg-violet-600/20 bottom-[-30px] right-[-40px]" style={{ animationDelay: '3s' }} />
            <div className="relative">
              <h2 className="section-title text-white text-3xl">Ready to get started?</h2>
              <p className="text-slate-400 mt-3 mb-8">Create your account and book your first service in minutes.</p>
              <Link to="/register" className="btn-primary px-10 py-3 text-base no-underline">
                Get Started Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} HomeServe. Built with React + Node.js.
      </footer>
    </div>
  );
}
