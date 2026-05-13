FROM node:22-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --filter shared --filter api

COPY tsconfig.json ./
COPY packages/shared/ ./packages/shared/

RUN pnpm --filter shared build:prod

FROM oven/bun:1-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared ./packages/shared

# 调试：确认 shared 的 dist 产物存在
RUN ls -la packages/shared/dist/ || echo "shared dist not found ❌"
RUN cat packages/shared/dist/main.js | head -5 || echo "main.js not found ❌"
RUN ls -la node_modules/@youde/ || echo "@youde not found ❌"
RUN ls -la node_modules/@youde/shared/dist/ || echo "shared dist not found ❌"

COPY tsconfig.json ./
COPY apps/api/ ./apps/api/

RUN bun --env-file=apps/api/.env.${BUILD_MODE} apps/api/bun.build.ts

FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./

EXPOSE 3000
ENTRYPOINT ["bun", "run", "main.js"]
