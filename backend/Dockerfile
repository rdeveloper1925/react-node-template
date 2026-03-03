# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ── Stage 2: Migrate ─────────────────────────────────────────────────────────
# Keeps all deps (including drizzle-kit) so `drizzle-kit push` is available.
# Reads schema directly from source — no pre-generated SQL files needed.
FROM node:20-alpine AS migrate

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json drizzle.config.ts ./
COPY src ./src

CMD ["npx", "drizzle-kit", "push"]

# ── Stage 3: Production ──────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
