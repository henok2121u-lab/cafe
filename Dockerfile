# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `prisma generate` only needs DATABASE_URL to be a resolvable value (Prisma
# 7 loads prisma.config.ts, which reads it, for every CLI command) — it never
# opens a connection. The real value is supplied at container runtime.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV UPLOAD_DIR=/app/uploads

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# The standalone output's node_modules only bundles what server.js traces as
# a runtime import, which excludes the `prisma` CLI itself (needed below to
# run `migrate deploy` at container start). Replace it with the full install
# instead of hand-picking the CLI's transitive deps, which would be fragile
# to keep in sync — then reapply the generated client engine on top, since
# the full install's copy of @prisma/client predates `prisma generate`.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN mkdir -p /app/uploads

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node server.js"]
