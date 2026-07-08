const express = require('express');
const router = express.Router();
const { listWorkers, getWorker, createWorkerProfile, updateWorkerProfile } = require('../controllers/workerController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/workers          — list all workers (public)
router.get('/', listWorkers);

// GET /api/workers/:id      — single worker profile (public)
router.get('/:id', getWorker);

// POST /api/workers         — create worker profile (protected)
router.post('/', protect, createWorkerProfile);

// PUT /api/workers/:id      — update worker profile (protected)
router.put('/:id', protect, updateWorkerProfile);

module.exports = router;
