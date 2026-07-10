const { createWorker, getAllWorkers, getWorkerById, getWorkerByUserId, updateWorker } = require('../models/Worker');
const { updateUser } = require('../models/User');

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
 * @route   GET /api/workers/me
 * @desc    Get the authenticated worker's own profile
 * @access  Private (role: worker)
 */
const getMyProfile = async (req, res, next) => {
  try {
    const worker = await getWorkerByUserId(req.user.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'No worker profile found for this account' });
    }
    res.status(200).json({ success: true, worker });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/workers/:id
 * @desc    Update a worker profile (owner only) — also syncs name/phone/avatar_url to users table
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

    const { bio, service_category, hourly_rate, years_experience, location, is_available, name, phone, avatar_url } = req.body;

    // Also update the linked users record if personal fields are provided
    if (name !== undefined || phone !== undefined || avatar_url !== undefined) {
      await updateUser(target.user_id, {
        name:       name       ?? target.name,
        phone:      phone      ?? target.phone,
        avatar_url: avatar_url ?? target.avatar_url,
      });
    }

    const updated = await updateWorker(req.params.id, { bio, service_category: service_category ?? target.service_category, hourly_rate, years_experience, location, is_available });

    res.status(200).json({ success: true, worker: { ...updated, name: name ?? target.name, phone: phone ?? target.phone, avatar_url: avatar_url ?? target.avatar_url } });
  } catch (error) {
    next(error);
  }
};

module.exports = { listWorkers, getWorker, getMyProfile, createWorkerProfile, updateWorkerProfile };
