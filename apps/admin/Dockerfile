FROM node:22-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod

# ✅ 验证参数
RUN echo "BUILD_MODE=${BUILD_MODE}"

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/admin/package.json ./apps/admin/

# ✅ 验证依赖配置
RUN echo "=== pnpm-workspace.yaml ===" && cat pnpm-workspace.yaml

RUN pnpm install --filter shared --filter admin

COPY packages/shared/ ./packages/shared/
COPY apps/admin/ ./apps/admin/

# ✅ 验证文件结构
RUN echo "=== admin 目录 ===" && ls -la apps/admin/ && \
  echo "=== shared 目录 ===" && ls -la packages/shared/ && \
  echo "=== admin scripts ===" && \
  cat apps/admin/package.json | grep -A 10 '"scripts"'

RUN pnpm --filter admin build:${BUILD_MODE}

FROM nginx:alpine
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
