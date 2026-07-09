const { createWorker, getAllWorkers, getWorkerById, getWorkerByUserId, updateWorker } = require('../models/Worker');

/**
 * @route   GET /api/workers
 * @desc    Get all available workers, optionally filter by ?category=Plumbing
 * @access  Public
 */
const listWorkers = async (req, res, next) => {
  try {
    const { category } = req.query;
    const workers = await getAllWorkers(category || null);
    res.status(200).json({ success: true, count: workers.length, workers });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/workers/:id
 * @desc    Get a single worker profile by ID
 * @access  Public
 */
const getWorker = async (req, res, next) => {
  try {
    const worker = await getWorkerById(req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.status(200).json({ success: true, worker });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/workers
 * @desc    Create a worker profile for the authenticated user
 * @access  Private (role: worker | admin)
 */
const createWorkerProfile = async (req, res, next) => {
  try {
    const { bio, service_category, hourly_rate, years_experience, location } = req.body;

    // Guard: required fields
    if (!service_category || hourly_rate === undefined) {
      return res.status(400).json({ success: false, message: 'service_category and hourly_rate are required' });
    }

    // Guard: each user may only have one worker profile
    const existing = await getWorkerByUserId(req.user.id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A worker profile already exists for this account' });
    }

    const worker = await createWorker({
      user_id: req.user.id,
      bio,
      service_category,
      hourly_rate,
      years_experience,
      location,
    });

    res.status(201).json({ success: true, worker });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/workers/:id
 * @desc    Update a worker profile (owner only)
 * @access  Private (role: worker | admin)
 */
const updateWorkerProfile = async (req, res, next) => {
  try {
    const target = await getWorkerById(req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Ownership check: only the worker whose user_id matches, or an admin
    if (target.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const { bio, hourly_rate, years_experience, location, is_available } = req.body;
    const updated = await updateWorker(req.params.id, { bio, hourly_rate, years_experience, location, is_available });

    res.status(200).json({ success: true, worker: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { listWorkers, getWorker, createWorkerProfile, updateWorkerProfile };
