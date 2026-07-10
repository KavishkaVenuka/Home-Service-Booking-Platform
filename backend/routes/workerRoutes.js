const express = require('express');
const router = express.Router();
const { listWorkers, getWorker, getMyProfile, createWorkerProfile, updateWorkerProfile } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET  /api/workers          — list all available workers (public, filter by ?category=)
router.get('/', listWorkers);

// GET  /api/workers/me       — authenticated worker's own profile (MUST be before /:id)
router.get('/me', protect, authorize('worker', 'admin'), getMyProfile);

// GET  /api/workers/:id      — single worker profile (public)
router.get('/:id', getWorker);

// POST /api/workers          — create a worker profile (must be logged in as a 'worker' role)
router.post('/', protect, authorize('worker', 'admin'), createWorkerProfile);

// PUT  /api/workers/:id      — update a worker profile (protected; owner check done in controller)
router.put('/:id', protect, authorize('worker', 'admin'), updateWorkerProfile);

module.exports = router;
