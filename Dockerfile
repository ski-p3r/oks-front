# ---- Stage 1: Build the app ----
FROM node:18-alpine AS builder

# Enable corepack (pnpm)
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app for production
RUN pnpm build

# ---- Stage 2: Run the app ----
FROM node:18-alpine AS runner

# Enable corepack (pnpm)
RUN corepack enable

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set environment variables
ENV NODE_ENV=production
EXPOSE 3000

# Start Next.js in production mode
CMD ["pnpm", "start"]
