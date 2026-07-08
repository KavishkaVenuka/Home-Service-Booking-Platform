const { createReview, getReviewsByWorker, reviewExistsForBooking, getReviewsByCustomer } = require('../models/Review');
const { getBookingById } = require('../models/Booking');
const { refreshWorkerRating } = require('../models/Worker');

/**
 * @route   POST /api/reviews
 * @desc    Submit a review for a completed booking
 * @access  Private (customer)
 */
const submitReview = async (req, res, next) => {
  try {
    const { booking_id, rating, comment } = req.body;

    // Verify booking exists and is completed
    const booking = await getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review a completed booking' });
    }
    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this booking' });
    }

    // Check for existing review
    const alreadyReviewed = await reviewExistsForBooking(booking_id);
    if (alreadyReviewed) {
      return res.status(409).json({ success: false, message: 'This booking has already been reviewed' });
    }

    const review = await createReview({
      booking_id,
      customer_id: req.user.id,
      worker_id: booking.worker_id,
      rating,
      comment,
    });

    // Recalculate worker's aggregate rating
    await refreshWorkerRating(booking.worker_id);

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reviews/worker/:workerId
 * @desc    Get all reviews for a specific worker
 * @access  Public
 */
const getWorkerReviews = async (req, res, next) => {
  try {
    const reviews = await getReviewsByWorker(req.params.workerId);
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reviews/my
 * @desc    Get all reviews submitted by the authenticated customer
 * @access  Private (customer)
 */
const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await getReviewsByCustomer(req.user.id);
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitReview, getWorkerReviews, getMyReviews };
