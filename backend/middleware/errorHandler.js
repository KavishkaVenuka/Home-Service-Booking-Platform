/**
 * Global Express error handler.
 * Must be registered AFTER all routes (4 parameters = error handler).
 *
 * Error shape returned to client:
 * {
 *   success: false,
 *   message: string,
 *   stack: string  (only in development)
 * }
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Default to 500 if no status code set on the error
  let statusCode = err.statusCode || res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // PostgreSQL unique constraint violation (e.g., duplicate email)
  if (err.code === '23505') {
    statusCode = 409;
    message = 'A record with that value already exists';
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Referenced resource does not exist';
  }

  // PostgreSQL not-null violation
  if (err.code === '23502') {
    statusCode = 400;
    message = `Field '${err.column}' is required`;
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
