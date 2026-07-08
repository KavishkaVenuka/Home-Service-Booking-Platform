const { query } = require('../config/db');

/**
 * User Model
 *
 * Table schema (SQL):
 * ─────────────────────────────────────────────────────────────
 * CREATE TABLE users (
 *   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   name        VARCHAR(100) NOT NULL,
 *   email       VARCHAR(255) UNIQUE NOT NULL,
 *   password    VARCHAR(255) NOT NULL,           -- bcrypt hash
 *   phone       VARCHAR(20),
 *   role        VARCHAR(20) NOT NULL DEFAULT 'customer',  -- 'customer' | 'worker' | 'admin'
 *   avatar_url  TEXT,
 *   is_active   BOOLEAN NOT NULL DEFAULT TRUE,
 *   created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Create a new user.
 * @param {{ name, email, password, phone, role }} data
 */
const createUser = async ({ name, email, password, phone, role = 'customer' }) => {
  const sql = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role, created_at
  `;
  const { rows } = await query(sql, [name, email, password, phone, role]);
  return rows[0];
};

/**
 * Find a user by email (includes password for auth).
 * @param {string} email
 */
const findUserByEmail = async (email) => {
  const { rows } = await query('SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]);
  return rows[0] || null;
};

/**
 * Find a user by ID (excludes password).
 * @param {string} id
 */
const findUserById = async (id) => {
  const sql = `SELECT id, name, email, phone, role, avatar_url, created_at FROM users WHERE id = $1`;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
};

/**
 * Update user profile fields.
 * @param {string} id
 * @param {{ name, phone, avatar_url }} fields
 */
const updateUser = async (id, fields) => {
  const { name, phone, avatar_url } = fields;
  const sql = `
    UPDATE users SET name = $1, phone = $2, avatar_url = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING id, name, email, phone, avatar_url
  `;
  const { rows } = await query(sql, [name, phone, avatar_url, id]);
  return rows[0] || null;
};

/**
 * Soft-delete a user (mark inactive).
 * @param {string} id
 */
const deleteUser = async (id) => {
  await query('UPDATE users SET is_active = FALSE WHERE id = $1', [id]);
};

module.exports = { createUser, findUserByEmail, findUserById, updateUser, deleteUser };
