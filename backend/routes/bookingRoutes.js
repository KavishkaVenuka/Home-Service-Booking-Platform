const express = require('express');
const router = express.Router();
const {
  makeBooking,
  getMyBookings,
  getWorkerBookings,
  getBooking,
  changeBookingStatus,
  removeBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes are protected
router.use(protect);

// POST   /api/bookings           — create a booking
router.post('/', makeBooking);

// GET    /api/bookings/my        — customer's own bookings
router.get('/my', getMyBookings);

// GET    /api/bookings/worker    — bookings assigned to the authenticated worker
router.get('/worker', getWorkerBookings);

// GET    /api/bookings/:id       — single booking
router.get('/:id', getBooking);

// PATCH  /api/bookings/:id/status — update status (confirm, complete, etc.)
router.patch('/:id/status', changeBookingStatus);

// DELETE /api/bookings/:id       — cancel booking
router.delete('/:id', removeBooking);

module.exports = router;
