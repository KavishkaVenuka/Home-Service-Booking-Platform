const express = require('express');
const router = express.Router();
const { submitReview, getWorkerReviews, getMyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// GET  /api/reviews/my                  — private: all reviews written by the logged-in customer
// NOTE: literal routes MUST be declared before parameterised routes
router.get('/my', protect, getMyReviews);

// GET  /api/reviews/worker/:workerId    — public: all reviews for a specific worker
router.get('/worker/:workerId', getWorkerReviews);

// POST /api/reviews                     — private: submit a review for a completed booking
router.post('/', protect, submitReview);

module.exports = router;
