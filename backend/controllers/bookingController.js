const {
  createBooking,
  getBookingsByCustomer,
  getBookingsByWorker,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../models/Booking');
const { getWorkerById } = require('../models/Worker');

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private (customer)
 */
const makeBooking = async (req, res, next) => {
  try {
    const { worker_id, service, description, scheduled_at, duration_hours, address, notes } = req.body;

    // Verify worker exists and is available
    const worker = await getWorkerById(worker_id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    if (!worker.is_available) {
      return res.status(400).json({ success: false, message: 'Worker is currently unavailable' });
    }

    // Calculate price based on hourly rate and duration
    const total_price = parseFloat(worker.hourly_rate) * parseFloat(duration_hours || 1);

    const booking = await createBooking({
      customer_id: req.user.id,
      worker_id,
      service,
      description,
      scheduled_at,
      duration_hours: duration_hours || 1,
      total_price,
      address,
      notes,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/my
 * @desc    Get all bookings for the authenticated customer
 * @access  Private (customer)
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await getBookingsByCustomer(req.user.id);
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/worker
 * @desc    Get all bookings for the authenticated worker
 * @access  Private (worker)
 */
const getWorkerBookings = async (req, res, next) => {
  try {
    // req.worker is expected to be set by a middleware resolving user_id → worker_id
    const bookings = await getBookingsByWorker(req.worker.id);
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/:id
 * @desc    Get a single booking by ID
 * @access  Private
 */
const getBooking = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status (e.g., worker confirms or completes)
 * @access  Private (worker or admin)
 */
const changeBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await updateBookingStatus(req.params.id, status);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking
 * @access  Private (customer who owns it)
 */
const removeBooking = async (req, res, next) => {
  try {
    const cancelled = await cancelBooking(req.params.id);
    if (!cancelled) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking cancelled', booking: cancelled });
  } catch (error) {
    next(error);
  }
};

module.exports = { makeBooking, getMyBookings, getWorkerBookings, getBooking, changeBookingStatus, removeBooking };
