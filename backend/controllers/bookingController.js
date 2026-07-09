const {
  createBooking,
  getBookingsByCustomer,
  getBookingsByWorker,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../models/Booking');
const { getWorkerById, getWorkerByUserId } = require('../models/Worker');

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (customer books a worker)
 * @access  Private (customer)
 */
const makeBooking = async (req, res, next) => {
  try {
    const { worker_id, service, description, scheduled_at, duration_hours, address, notes } = req.body;

    // Basic field validation
    if (!worker_id || !service || !scheduled_at || !address) {
      return res.status(400).json({
        success: false,
        message: 'worker_id, service, scheduled_at, and address are required',
      });
    }

    // Ensure the booking is in the future
    if (new Date(scheduled_at) <= new Date()) {
      return res.status(400).json({ success: false, message: 'scheduled_at must be a future date/time' });
    }

    // Verify worker exists and is available
    const worker = await getWorkerById(worker_id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    if (!worker.is_available) {
      return res.status(400).json({ success: false, message: 'Worker is currently unavailable' });
    }

    // Calculate price from hourly rate × duration
    const hours = parseFloat(duration_hours) || 1;
    const total_price = parseFloat(worker.hourly_rate) * hours;

    const booking = await createBooking({
      customer_id: req.user.id,
      worker_id,
      service,
      description,
      scheduled_at,
      duration_hours: hours,
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
 * @desc    Get all bookings assigned to the authenticated worker
 * @access  Private (worker)
 */
const getWorkerBookings = async (req, res, next) => {
  try {
    // Resolve the worker profile from the authenticated user's ID
    const workerProfile = await getWorkerByUserId(req.user.id);
    if (!workerProfile) {
      return res.status(404).json({ success: false, message: 'Worker profile not found for this account' });
    }
    const bookings = await getBookingsByWorker(workerProfile.id);
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/:id
 * @desc    Get a single booking by ID (customer or worker who owns it)
 * @access  Private
 */
const getBooking = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only the customer or the assigned worker's user account may view
    const workerProfile = await getWorkerByUserId(req.user.id);
    const isCustomer = booking.customer_id === req.user.id;
    const isWorker = workerProfile && booking.worker_id === workerProfile.id;

    if (!isCustomer && !isWorker && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status (worker confirms / marks in-progress / completes)
 * @access  Private (worker who owns the booking, or admin)
 */
const changeBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'status field is required' });
    }

    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only the worker assigned to this booking (or admin) may update status
    const workerProfile = await getWorkerByUserId(req.user.id);
    const isAssignedWorker = workerProfile && booking.worker_id === workerProfile.id;

    if (!isAssignedWorker && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking status' });
    }

    const updated = await updateBookingStatus(req.params.id, status);
    res.status(200).json({ success: true, booking: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking (customer who made it, or admin)
 * @access  Private (customer owner)
 */
const removeBooking = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only the customer who created the booking (or admin) may cancel
    if (booking.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    // Prevent cancelling already-completed bookings
    if (booking.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed booking' });
    }

    const cancelled = await cancelBooking(req.params.id);
    res.status(200).json({ success: true, message: 'Booking cancelled', booking: cancelled });
  } catch (error) {
    next(error);
  }
};

module.exports = { makeBooking, getMyBookings, getWorkerBookings, getBooking, changeBookingStatus, removeBooking };
