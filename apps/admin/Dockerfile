FROM node:22-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/admin/package.json ./apps/admin/

RUN pnpm install --filter shared --filter admin

COPY packages/shared/ ./packages/shared/
COPY apps/admin/ ./apps/admin/

RUN pnpm --filter admin build:${BUILD_MODE}

FROM nginx:alpine
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
