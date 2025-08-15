# ---- Stage 1: Builder ----
FROM node:18-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy dependency files first (better cache)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with memory control
# Limit concurrency for low-memory EC2 (like t2.micro)
RUN pnpm install --frozen-lockfile --prefer-offline --child-concurrency=1

# Copy app source
COPY . .

# Build for production
RUN NODE_OPTIONS="--max-old-space-size=2048" pnpm build

# ---- Stage 2: Runner ----
FROM node:18-alpine AS runner

# Enable corepack
RUN corepack enable

WORKDIR /app

# Copy only the necessary build artifacts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set production environment
ENV NODE_ENV=production
EXPOSE 3000

# Use pnpm to start the app
CMD ["pnpm", "start"]
