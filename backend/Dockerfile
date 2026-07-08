# ──────────────────────────────────────────────────────────────
# Stage 1: Base — install production dependencies
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./
RUN npm ci --only=production

# ──────────────────────────────────────────────────────────────
# Stage 2: Development — includes devDependencies
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS development
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]

# ──────────────────────────────────────────────────────────────
# Stage 3: Production — lean image
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

# Copy production node_modules from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy application source
COPY . .

# Change ownership to non-root user
RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 5000

# Use node directly in production (not nodemon)
CMD ["node", "server.js"]
