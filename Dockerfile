# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Set production environment
ENV NODE_ENV=production

# Enable SWC for faster builds
ENV NEXT_SHARP_PATH=/tmp/node-sharp

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up directories and permissions
RUN mkdir -p .next/cache \
    && mkdir -p prisma \
    && mkdir -p /app/data \
    && chown -R nextjs:nodejs . \
    && chmod -R 755 .

# Copy necessary files for Prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Set DATABASE_URL environment variable
ENV DATABASE_URL="file:/app/data/garden.db"

# Install and set up Prisma
USER root
RUN npm install prisma --save-dev
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
RUN touch /app/data/garden.db && chown nextjs:nodejs /app/data/garden.db && chmod 644 /app/data/garden.db
RUN npx prisma db push
USER nextjs

# Copy public folder and static files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cleanup dev dependencies
USER root
RUN npm prune --production && chown -R nextjs:nodejs /app/node_modules

# Switch to non-root user
USER nextjs

# Expose the listening port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the server with required setup
CMD ["/bin/sh", "-c", "mkdir -p /app/data && npx prisma db push && node server.js"]

#My Only Partially-AI Generated File. Docker will never not confuse me.