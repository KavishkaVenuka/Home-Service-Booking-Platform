-- ============================================================
-- Home Service Booking Platform — Initial Schema
-- Run this once against your PostgreSQL database:
--   psql -U postgres -d home_service_db -f config/schema.sql
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,           -- bcrypt hash
  phone       VARCHAR(20),
  role        VARCHAR(20)  NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'worker', 'admin')),
  avatar_url  TEXT,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── WORKERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workers (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio               TEXT,
  service_category  VARCHAR(100) NOT NULL,
  hourly_rate       NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  years_experience  INT          NOT NULL DEFAULT 0,
  avg_rating        NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  total_reviews     INT          NOT NULL DEFAULT 0,
  is_available      BOOLEAN      NOT NULL DEFAULT TRUE,
  location          VARCHAR(255),
  latitude          NUMERIC(9, 6),
  longitude         NUMERIC(9, 6),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT workers_user_id_unique UNIQUE (user_id)   -- one profile per user
);

-- ─── BOOKING STATUS ENUM ─────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;   -- safe to re-run
END $$;

-- ─── BOOKINGS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID           NOT NULL REFERENCES users(id),
  worker_id       UUID           NOT NULL REFERENCES workers(id),
  service         VARCHAR(100)   NOT NULL,
  description     TEXT,
  scheduled_at    TIMESTAMPTZ    NOT NULL,
  duration_hours  NUMERIC(4, 2)  NOT NULL DEFAULT 1.00,
  total_price     NUMERIC(10, 2),
  status          booking_status NOT NULL DEFAULT 'pending',
  address         TEXT           NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ─── REVIEWS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID      UNIQUE NOT NULL REFERENCES bookings(id),   -- one review per booking
  customer_id UUID      NOT NULL REFERENCES users(id),
  worker_id   UUID      NOT NULL REFERENCES workers(id),
  rating      SMALLINT  NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_workers_category   ON workers (service_category);
CREATE INDEX IF NOT EXISTS idx_workers_available  ON workers (is_available);
CREATE INDEX IF NOT EXISTS idx_bookings_customer  ON bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker    ON bookings (worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_reviews_worker     ON reviews (worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer   ON reviews (customer_id);
