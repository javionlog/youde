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

COPY apps/api/ ./apps/api/
RUN pnpm deploy --filter api --prod /app/deploy

# ✅ pnpm deploy 对 workspace 本地包只做快照，产物可能不完整
# 手动将 shared 构建产物覆盖到 deploy 后的 node_modules 中
RUN cp -rf /app/packages/shared/dist /app/deploy/node_modules/@youde/shared/dist

FROM oven/bun:1-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod

COPY --from=deps /app/deploy/node_modules ./node_modules
COPY tsconfig.json ./
COPY apps/api/ ./apps/api/

RUN bun --env-file=apps/api/.env.${BUILD_MODE} apps/api/bun.build.ts

FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./

EXPOSE 3000
ENTRYPOINT ["bun", "run", "main.js"]
