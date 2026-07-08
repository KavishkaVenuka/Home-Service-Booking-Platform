import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiFileText, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * BookingSystem page — multi-step booking form for a specific worker.
 * Route: /book/:workerId
 */
export default function BookingSystem() {
  const { workerId } = useParams();
  const navigate     = useNavigate();

  const [worker, setWorker]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep]       = useState(1); // 1: details, 2: confirm, 3: success
  const [form, setForm]       = useState({
    service:        '',
    description:    '',
    scheduled_at:   '',
    duration_hours: '1',
    address:        '',
    notes:          '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/workers/${workerId}`);
        setWorker(data.worker);
        setForm((f) => ({ ...f, service: data.worker.service_category }));
      } catch {
        toast.error('Worker not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const estimatedPrice = worker
    ? (parseFloat(worker.hourly_rate) * parseFloat(form.duration_hours || 1)).toFixed(2)
    : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }

    setSubmitting(true);
    try {
      await api.post('/bookings', { ...form, worker_id: workerId });
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-app py-12 max-w-2xl mx-auto animate-pulse">
        <div className="card space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ── Step 3: Success ──────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="container-app py-24 max-w-lg mx-auto text-center animate-fade-in">
        <div className="card">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-6">
            Your booking with <strong>{worker?.name}</strong> has been submitted. You'll receive confirmation shortly.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-left mb-6 space-y-2">
            <p><span className="font-medium">Service:</span> {form.service}</p>
            <p><span className="font-medium">Date:</span> {new Date(form.scheduled_at).toLocaleString()}</p>
            <p><span className="font-medium">Duration:</span> {form.duration_hours} hour(s)</p>
            <p><span className="font-medium">Estimated Total:</span> ${estimatedPrice}</p>
          </div>
          <Link to="/" className="btn-primary w-full justify-center">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-10 max-w-2xl mx-auto animate-fade-in">
      <Link to={`/workers/${workerId}`} className="btn-ghost mb-6 inline-flex">
        <FiArrowLeft /> Back to Profile
      </Link>

      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-1">
        Book {worker?.name}
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        {worker?.service_category} · <span className="text-primary-600 font-semibold">${worker?.hourly_rate}/hr</span>
      </p>

      {/* ── Step Indicator ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-8">
        {['Details', 'Confirm'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
              ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {step > i + 1 ? <FiCheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-primary-600' : 'text-gray-400'}`}>{label}</span>
            {i < 1 && <div className="w-8 h-px bg-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="card space-y-5 animate-slide-up">
            {/* Service */}
            <div>
              <label htmlFor="service" className="label">Service Type</label>
              <input id="service" name="service" className="input" value={form.service}
                onChange={handleChange} required placeholder="e.g. Pipe repair" />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label flex items-center gap-1">
                <FiFileText size={14}/> Description
              </label>
              <textarea id="description" name="description" rows={3}
                className="input resize-none" value={form.description}
                onChange={handleChange} placeholder="Describe the problem in detail..." />
            </div>

            {/* Date & Time */}
            <div>
              <label htmlFor="scheduled_at" className="label flex items-center gap-1">
                <FiCalendar size={14}/> Scheduled Date & Time
              </label>
              <input id="scheduled_at" name="scheduled_at" type="datetime-local"
                className="input" value={form.scheduled_at}
                onChange={handleChange} required min={new Date().toISOString().slice(0, 16)} />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration_hours" className="label flex items-center gap-1">
                <FiClock size={14}/> Estimated Duration (hours)
              </label>
              <select id="duration_hours" name="duration_hours" className="input"
                value={form.duration_hours} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6, 8].map((h) => (
                  <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="label flex items-center gap-1">
                <FiMapPin size={14}/> Service Address
              </label>
              <input id="address" name="address" className="input" value={form.address}
                onChange={handleChange} required placeholder="Full address..." />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="label">Additional Notes (optional)</label>
              <textarea id="notes" name="notes" rows={2} className="input resize-none"
                value={form.notes} onChange={handleChange}
                placeholder="Any special instructions..." />
            </div>

            {/* Price Preview */}
            <div className="bg-primary-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-600 text-sm">Estimated Total</span>
              <span className="text-2xl font-heading font-bold text-primary-600">${estimatedPrice}</span>
            </div>

            <button id="booking-next-btn" type="submit" className="btn-primary w-full justify-center">
              Continue to Confirm
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card animate-slide-up">
            <h2 className="font-heading font-bold text-gray-900 text-lg mb-4">Confirm Your Booking</h2>
            <div className="divide-y divide-gray-100 text-sm">
              {[
                { label: 'Worker',    value: worker?.name },
                { label: 'Service',   value: form.service },
                { label: 'Date',      value: new Date(form.scheduled_at).toLocaleString() },
                { label: 'Duration',  value: `${form.duration_hours} hour(s)` },
                { label: 'Address',   value: form.address },
                { label: 'Est. Cost', value: `$${estimatedPrice}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-3">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800 text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setStep(1)}>
                Edit
              </button>
              <button id="booking-confirm-btn" type="submit" className="btn-primary flex-1 justify-center"
                disabled={submitting}>
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
