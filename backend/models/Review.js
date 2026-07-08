const { query } = require('../config/db');

/**
 * Review Model
 *
 * Table schema (SQL):
 * ─────────────────────────────────────────────────────────────
 * CREATE TABLE reviews (
 *   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   booking_id  UUID UNIQUE NOT NULL REFERENCES bookings(id),   -- one review per booking
 *   customer_id UUID NOT NULL REFERENCES users(id),
 *   worker_id   UUID NOT NULL REFERENCES workers(id),
 *   rating      SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
 *   comment     TEXT,
 *   created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Create a review for a completed booking.
 * @param {{ booking_id, customer_id, worker_id, rating, comment }} data
 */
const createReview = async ({ booking_id, customer_id, worker_id, rating, comment }) => {
  const sql = `
    INSERT INTO reviews (booking_id, customer_id, worker_id, rating, comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const { rows } = await query(sql, [booking_id, customer_id, worker_id, rating, comment]);
  return rows[0];
};

/**
 * Get all reviews for a given worker, including reviewer name.
 * @param {string} worker_id
 */
const getReviewsByWorker = async (worker_id) => {
  const sql = `
    SELECT r.*, u.name AS customer_name, u.avatar_url AS customer_avatar
    FROM reviews r
    JOIN users u ON r.customer_id = u.id
    WHERE r.worker_id = $1
    ORDER BY r.created_at DESC
  `;
  const { rows } = await query(sql, [worker_id]);
  return rows;
};

/**
 * Check whether a review already exists for a booking.
 * Prevents duplicate reviews.
 * @param {string} booking_id
 */
const reviewExistsForBooking = async (booking_id) => {
  const { rows } = await query('SELECT id FROM reviews WHERE booking_id = $1', [booking_id]);
  return rows.length > 0;
};

/**
 * Get all reviews written by a specific customer.
 * @param {string} customer_id
 */
const getReviewsByCustomer = async (customer_id) => {
  const sql = `
    SELECT r.*, u.name AS worker_name
    FROM reviews r
    JOIN workers w ON r.worker_id = w.id
    JOIN users u ON w.user_id = u.id
    WHERE r.customer_id = $1
    ORDER BY r.created_at DESC
  `;
  const { rows } = await query(sql, [customer_id]);
  return rows;
};

module.exports = { createReview, getReviewsByWorker, reviewExistsForBooking, getReviewsByCustomer };
