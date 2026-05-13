//workspaceCode:assistant-17786606966930_1=chat=litellm/claude-sonnet-4.6
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

FROM oven/bun:1-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod

# 复制 deploy 后的 node_modules（包含第三方依赖）
COPY --from=deps /app/deploy/node_modules ./node_modules
# 直接复制 shared 源码，让 Bun 打包时能完整解析所有导出
COPY --from=deps /app/packages/shared/ ./packages/shared/
COPY tsconfig.json ./
COPY apps/api/ ./apps/api/

RUN bun --env-file=apps/api/.env.${BUILD_MODE} apps/api/bun.build.ts

FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./

EXPOSE 3000
ENTRYPOINT ["bun", "run", "main.js"]
