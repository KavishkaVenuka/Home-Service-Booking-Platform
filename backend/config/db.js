const { Pool } = require('pg');

/**
 * PostgreSQL connection pool.
 * Uses environment variables for configuration.
 * In Docker Compose, DB_HOST will be the service name (e.g., "postgres").
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'home_service_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  // Connection pool settings
  max: 20,                  // max connections in pool
  idleTimeoutMillis: 30000, // close idle connections after 30s
  connectionTimeoutMillis: 2000, // fail if no connection available in 2s
});

/**
 * Verifies the database connection on startup.
 * Throws an error if the connection cannot be established.
 */
const connectDB = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    console.log(`✅ PostgreSQL connected at: ${res.rows[0].now}`);
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    throw error;
  }
};

/**
 * Execute a parameterized query against the pool.
 * @param {string} text - SQL query string with $1, $2 ... placeholders
 * @param {Array}  params - Array of parameter values
 * @returns {Promise<pg.QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, connectDB, query };
