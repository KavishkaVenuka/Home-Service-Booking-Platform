# 🏠 HomeServe — Home Service Booking Platform

> A multi-vendor marketplace connecting homeowners with trusted, verified home service professionals.

[![CI/CD](https://github.com/your-org/home-service-booking-platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-org/home-service-booking-platform/actions)

---

## 📁 Project Structure

```
Home-Service-Booking-Platform/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions CI/CD pipeline
├── backend/                    # Node.js + Express + PostgreSQL API
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   ├── controllers/            # Business logic (auth, worker, booking, review)
│   ├── middleware/             # JWT auth, global error handler
│   ├── models/                 # DB query helpers (User, Worker, Booking, Review)
│   ├── routes/                 # Express route definitions
│   ├── server.js               # App entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/         # Navbar, Footer
│   │   ├── pages/              # Home, WorkerProfile, BookingSystem, RatingReview
│   │   └── services/
│   │       └── api.js          # Axios instance with JWT interceptor
│   ├── nginx.conf              # Nginx config for production SPA serving
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── terraform/                  # AWS infrastructure as code
│   ├── main.tf                 # VPC, EC2, RDS resources
│   ├── variables.tf
│   └── outputs.tf
├── docker-compose.yml          # Local development orchestration
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Node.js 20+](https://nodejs.org/) (for running without Docker)
- [Git](https://git-scm.com/)

### 1. Clone & Configure

```bash
git clone https://github.com/your-org/home-service-booking-platform.git
cd home-service-booking-platform

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and set your JWT secret:
```env
JWT_SECRET=your_super_secret_jwt_key
```

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000       |
| Backend   | http://localhost:5000       |
| DB (pg)   | localhost:5432              |

### 3. Health Check

```bash
curl http://localhost:5000/api/health
# → {"status":"ok","timestamp":"..."}
```

---

## 🛠️ Running Without Docker

### Backend

```bash
cd backend
npm install
# Ensure PostgreSQL is running locally, then:
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Database Schema

The SQL schemas are documented inline within each model file. Run these to initialize your database:

```sql
-- Users
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  phone      VARCHAR(20),
  role       VARCHAR(20) NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workers
CREATE TABLE workers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio              TEXT,
  service_category VARCHAR(100) NOT NULL,
  hourly_rate      NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  years_experience INT NOT NULL DEFAULT 0,
  avg_rating       NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  total_reviews    INT NOT NULL DEFAULT 0,
  is_available     BOOLEAN NOT NULL DEFAULT TRUE,
  location         VARCHAR(255),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings
CREATE TYPE booking_status AS ENUM ('pending','confirmed','in_progress','completed','cancelled');
CREATE TABLE bookings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id    UUID NOT NULL REFERENCES users(id),
  worker_id      UUID NOT NULL REFERENCES workers(id),
  service        VARCHAR(100) NOT NULL,
  description    TEXT,
  scheduled_at   TIMESTAMPTZ NOT NULL,
  duration_hours NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  total_price    NUMERIC(10,2),
  status         booking_status NOT NULL DEFAULT 'pending',
  address        TEXT NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID UNIQUE NOT NULL REFERENCES bookings(id),
  customer_id UUID NOT NULL REFERENCES users(id),
  worker_id   UUID NOT NULL REFERENCES workers(id),
  rating      SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 🔌 API Reference

| Method   | Endpoint                       | Auth | Description                     |
|----------|--------------------------------|------|---------------------------------|
| `GET`    | `/api/health`                  | —    | Health check                    |
| `POST`   | `/api/auth/register`           | —    | Register new user               |
| `POST`   | `/api/auth/login`              | —    | Login, receive JWT              |
| `GET`    | `/api/auth/me`                 | ✅   | Get current user profile        |
| `GET`    | `/api/workers`                 | —    | List workers (`?category=`)     |
| `GET`    | `/api/workers/:id`             | —    | Get worker profile              |
| `POST`   | `/api/workers`                 | ✅   | Create worker profile           |
| `PUT`    | `/api/workers/:id`             | ✅   | Update worker profile           |
| `POST`   | `/api/bookings`                | ✅   | Create booking                  |
| `GET`    | `/api/bookings/my`             | ✅   | Customer's bookings             |
| `GET`    | `/api/bookings/worker`         | ✅   | Worker's bookings               |
| `PATCH`  | `/api/bookings/:id/status`     | ✅   | Update booking status           |
| `DELETE` | `/api/bookings/:id`            | ✅   | Cancel booking                  |
| `POST`   | `/api/reviews`                 | ✅   | Submit review                   |
| `GET`    | `/api/reviews/worker/:id`      | —    | Get reviews for a worker        |
| `GET`    | `/api/reviews/my`              | ✅   | Get current user's reviews      |

---

## ☁️ Infrastructure (Terraform / AWS)

```bash
cd terraform

# Initialize providers
terraform init

# Preview what will be created
terraform plan -var="ec2_public_key=$(cat ~/.ssh/id_ed25519.pub)" \
               -var="db_password=YourSecurePassword123"

# Apply (creates real AWS resources — costs apply)
terraform apply ...

# Destroy when done
terraform destroy ...
```

**Resources created:**
- VPC with public/private subnets across 2 AZs
- EC2 `t3.micro` instance with Docker pre-installed (Elastic IP)
- RDS PostgreSQL `db.t3.micro` in private subnets
- Security groups with least-privilege rules

---

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push:

1. **Test Backend** — runs Jest tests with a live PostgreSQL service container
2. **Lint Frontend** — ESLint + Vite build verification (parallel with backend)
3. **Build & Push** *(main branch only)* — builds Docker images and pushes to Docker Hub
4. **Deploy** *(main branch only)* — placeholder for SSH/ECS deployment

**Required GitHub Secrets:**

| Secret                  | Description                    |
|-------------------------|--------------------------------|
| `DOCKERHUB_USERNAME`    | Your Docker Hub username       |
| `DOCKERHUB_TOKEN`       | Docker Hub access token        |

---

## 🧰 Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Frontend       | React 18, Vite, Tailwind CSS 3      |
| Backend        | Node.js 20, Express 4               |
| Database       | PostgreSQL 16                       |
| Auth           | JWT + bcryptjs                      |
| Containerization | Docker, Docker Compose             |
| CI/CD          | GitHub Actions                      |
| Infrastructure | Terraform, AWS EC2, AWS RDS         |

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.