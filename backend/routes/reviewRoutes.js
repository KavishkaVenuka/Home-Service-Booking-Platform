const express = require('express');
const router = express.Router();
const { submitReview, getWorkerReviews, getMyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// GET  /api/reviews/worker/:workerId  — public: all reviews for a worker
router.get('/worker/:workerId', getWorkerReviews);

// GET  /api/reviews/my                — private: reviews written by current user
router.get('/my', protect, getMyReviews);

// POST /api/reviews                   — private: submit a review
router.post('/', protect, submitReview);

module.exports = router;
