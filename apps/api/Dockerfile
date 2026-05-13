FROM node:22-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm

# 第一步：复制所有 package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# 第二步：安装所有依赖
RUN pnpm install --filter shared --filter api

# 第三步：复制根 tsconfig 和 shared 源码
COPY tsconfig.json ./
COPY packages/shared/ ./packages/shared/

# 第四步：构建 shared，生成 dist/main.js
RUN pnpm --filter shared build:prod

# 验证 shared 构建产物
RUN ls -la packages/shared/dist/ || echo "shared dist not found ❌"
RUN grep "flattenTree" packages/shared/dist/main.js || echo "flattenTree not in shared ❌"

# 第五步：复制 api 源码
COPY apps/api/ ./apps/api/

# 验证 node_modules 中 @youde/shared 的结构
RUN ls -la node_modules/@youde/shared/
RUN cat node_modules/@youde/shared/package.json
RUN ls -la node_modules/@youde/shared/dist/

# 第六步：deploy，此时 shared 已有 dist 产物
RUN pnpm deploy --filter api --prod /app/deploy

# 验证 deploy 结果
RUN ls -la /app/deploy/node_modules/@youde/ || echo "@youde not found in deploy ❌"
RUN ls -la /app/deploy/node_modules/@youde/shared/dist/ || echo "shared dist not found in deploy ❌"

FROM oven/bun:1-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod

COPY --from=deps /app/deploy/node_modules ./node_modules
COPY tsconfig.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/

# 验证 builder 阶段
RUN ls -la node_modules/@youde/ || echo "@youde not found in builder ❌"

RUN bun --env-file=apps/api/.env.${BUILD_MODE} apps/api/bun.build.ts

# 验证打包产物
RUN grep "flattenTree" apps/api/dist/main.js || echo "flattenTree not in dist ❌"

FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./

EXPOSE 3000
ENTRYPOINT ["bun", "run", "main.js"]
