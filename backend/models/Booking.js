const { query } = require('../config/db');

/**
 * Booking Model
 *
 * Table schema (SQL):
 * ─────────────────────────────────────────────────────────────
 * CREATE TYPE booking_status AS ENUM (
 *   'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
 * );
 *
 * CREATE TABLE bookings (
 *   id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   customer_id     UUID NOT NULL REFERENCES users(id),
 *   worker_id       UUID NOT NULL REFERENCES workers(id),
 *   service         VARCHAR(100) NOT NULL,
 *   description     TEXT,
 *   scheduled_at    TIMESTAMPTZ NOT NULL,
 *   duration_hours  NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
 *   total_price     NUMERIC(10, 2),
 *   status          booking_status NOT NULL DEFAULT 'pending',
 *   address         TEXT NOT NULL,
 *   notes           TEXT,
 *   created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * ─────────────────────────────────────────────────────────────
 */

const VALID_STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

/**
 * Create a new booking.
 * @param {{ customer_id, worker_id, service, description, scheduled_at, duration_hours, total_price, address, notes }} data
 */
const createBooking = async (data) => {
  const { customer_id, worker_id, service, description, scheduled_at, duration_hours, total_price, address, notes } = data;
  const sql = `
    INSERT INTO bookings (customer_id, worker_id, service, description, scheduled_at, duration_hours, total_price, address, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const { rows } = await query(sql, [customer_id, worker_id, service, description, scheduled_at, duration_hours, total_price, address, notes]);
  return rows[0];
};

/**
 * Get all bookings for a specific customer.
 * @param {string} customer_id
 */
const getBookingsByCustomer = async (customer_id) => {
  const sql = `
    SELECT b.*, u.name AS worker_name, u.avatar_url AS worker_avatar
    FROM bookings b
    JOIN workers w ON b.worker_id = w.id
    JOIN users u ON w.user_id = u.id
    WHERE b.customer_id = $1
    ORDER BY b.scheduled_at DESC
  `;
  const { rows } = await query(sql, [customer_id]);
  return rows;
};

/**
 * Get all bookings assigned to a specific worker.
 * @param {string} worker_id
 */
const getBookingsByWorker = async (worker_id) => {
  const sql = `
    SELECT b.*, u.name AS customer_name, u.phone AS customer_phone
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    WHERE b.worker_id = $1
    ORDER BY b.scheduled_at ASC
  `;
  const { rows } = await query(sql, [worker_id]);
  return rows;
};

/**
 * Get a single booking by ID.
 * @param {string} id
 */
const getBookingById = async (id) => {
  const { rows } = await query('SELECT * FROM bookings WHERE id = $1', [id]);
  return rows[0] || null;
};

/**
 * Update booking status.
 * @param {string} id
 * @param {string} status - one of VALID_STATUSES
 */
const updateBookingStatus = async (id, status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of ${VALID_STATUSES.join(', ')}`);
  }
  const sql = `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
  const { rows } = await query(sql, [status, id]);
  return rows[0] || null;
};

/**
 * Cancel a booking (sets status to 'cancelled').
 * @param {string} id
 */
const cancelBooking = async (id) => updateBookingStatus(id, 'cancelled');

module.exports = { createBooking, getBookingsByCustomer, getBookingsByWorker, getBookingById, updateBookingStatus, cancelBooking };
