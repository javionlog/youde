FROM node:22-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --filter shared --filter api

RUN pnpm deploy --filter api --prod /app/deploy

FROM oven/bun:1-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod

COPY --from=deps /app/deploy/node_modules ./node_modules
COPY tsconfig.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/

RUN bun --env-file=apps/api/.env.${BUILD_MODE} apps/api/bun.build.ts

FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./

EXPOSE 3000
ENTRYPOINT ["bun", "run", "main.js"]
