const { createWorker, getAllWorkers, getWorkerById, updateWorker } = require('../models/Worker');

/**
 * @route   GET /api/workers
 * @desc    Get all available workers, optionally filter by ?category=
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
 * @access  Private (role: worker)
 */
const createWorkerProfile = async (req, res, next) => {
  try {
    const { bio, service_category, hourly_rate, years_experience, location } = req.body;
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
 * @desc    Update a worker profile
 * @access  Private (owner only)
 */
const updateWorkerProfile = async (req, res, next) => {
  try {
    const { bio, hourly_rate, years_experience, location, is_available } = req.body;
    const updated = await updateWorker(req.params.id, { bio, hourly_rate, years_experience, location, is_available });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.status(200).json({ success: true, worker: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { listWorkers, getWorker, createWorkerProfile, updateWorkerProfile };
