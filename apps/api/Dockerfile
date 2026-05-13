FROM node:22-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --filter shared --filter api

# 构建 shared
COPY tsconfig.json ./
COPY packages/shared/ ./packages/shared/
RUN pnpm --filter shared build:prod

# 复制 api 源码
COPY apps/api/ ./apps/api/

RUN ls -la node_modules/@youde/ || echo "@youde not found ❌"
RUN ls -la node_modules/@youde/shared/ || echo "shared not found ❌"
RUN ls -la node_modules/@youde/shared/dist/ || echo "shared dist not found ❌"
RUN cat node_modules/@youde/shared/package.json || echo "package.json not found ❌"

# pnpm deploy 会自动：
# 1. 解析所有 workspace 依赖为真实文件
# 2. 只保留 dependencies，去掉 devDependencies
# 3. 将 @youde/shared 的真实产物放入 node_modules
RUN pnpm deploy --filter api --prod /app/deploy

FROM oven/bun:1-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod



# deploy 目录下的 node_modules 是真实文件，无 symlink 问题
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
