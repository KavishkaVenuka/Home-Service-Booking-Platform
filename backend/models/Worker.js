const { query } = require('../config/db');

/**
 * Worker Model
 *
 * Table schema (SQL):
 * ─────────────────────────────────────────────────────────────
 * CREATE TABLE workers (
 *   id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   bio               TEXT,
 *   service_category  VARCHAR(100) NOT NULL,  -- e.g. 'Plumbing', 'Cleaning'
 *   hourly_rate       NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
 *   years_experience  INT NOT NULL DEFAULT 0,
 *   avg_rating        NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
 *   total_reviews     INT NOT NULL DEFAULT 0,
 *   is_available      BOOLEAN NOT NULL DEFAULT TRUE,
 *   location          VARCHAR(255),
 *   latitude          NUMERIC(9, 6),
 *   longitude         NUMERIC(9, 6),
 *   created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Create a worker profile linked to an existing user.
 * @param {{ user_id, bio, service_category, hourly_rate, years_experience, location }} data
 */
const createWorker = async (data) => {
  const { user_id, bio, service_category, hourly_rate, years_experience, location } = data;
  const sql = `
    INSERT INTO workers (user_id, bio, service_category, hourly_rate, years_experience, location)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const { rows } = await query(sql, [user_id, bio, service_category, hourly_rate, years_experience, location]);
  return rows[0];
};

/**
 * Get all available workers, optionally filtered by service category.
 * Joins with users table to include name and avatar.
 * @param {string|null} category
 */
const getAllWorkers = async (category = null) => {
  let sql = `
    SELECT w.*, u.name, u.email, u.avatar_url, u.phone
    FROM workers w
    JOIN users u ON w.user_id = u.id
    WHERE w.is_available = TRUE AND u.is_active = TRUE
  `;
  const params = [];
  if (category) {
    params.push(category);
    sql += ` AND w.service_category = $${params.length}`;
  }
  sql += ' ORDER BY w.avg_rating DESC';
  const { rows } = await query(sql, params);
  return rows;
};

/**
 * Get a single worker profile by worker ID.
 * @param {string} id
 */
const getWorkerById = async (id) => {
  const sql = `
    SELECT w.*, u.name, u.email, u.avatar_url, u.phone
    FROM workers w
    JOIN users u ON w.user_id = u.id
    WHERE w.id = $1
  `;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
};

/**
 * Update a worker's profile.
 * @param {string} id
 * @param {{ bio, service_category, hourly_rate, years_experience, location, is_available }} fields
 */
const updateWorker = async (id, fields) => {
  const { bio, service_category, hourly_rate, years_experience, location, is_available } = fields;
  const sql = `
    UPDATE workers
    SET bio = $1, service_category = $2, hourly_rate = $3, years_experience = $4,
        location = $5, is_available = $6, updated_at = NOW()
    WHERE id = $7
    RETURNING *
  `;
  const { rows } = await query(sql, [bio, service_category, hourly_rate, years_experience, location, is_available, id]);
  return rows[0] || null;
};

/**
 * Recalculate and update a worker's average rating.
 * Called after a new review is created.
 * @param {string} worker_id
 */
const refreshWorkerRating = async (worker_id) => {
  const sql = `
    UPDATE workers
    SET avg_rating   = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE worker_id = $1),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE worker_id = $1),
        updated_at   = NOW()
    WHERE id = $1
    RETURNING avg_rating, total_reviews
  `;
  const { rows } = await query(sql, [worker_id]);
  return rows[0];
};

/**
 * Get a worker profile by the linked user ID.
 * Used to resolve req.user.id → worker profile in protected routes.
 * @param {string} user_id
 */
const getWorkerByUserId = async (user_id) => {
  const sql = `
    SELECT w.*, u.name, u.email, u.avatar_url, u.phone
    FROM workers w
    JOIN users u ON w.user_id = u.id
    WHERE w.user_id = $1
  `;
  const { rows } = await query(sql, [user_id]);
  return rows[0] || null;
};

module.exports = { createWorker, getAllWorkers, getWorkerById, getWorkerByUserId, updateWorker, refreshWorkerRating };
