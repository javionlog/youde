FROM node:22-alpine
WORKDIR /app

ARG BUILD_MODE=prod

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --filter shared --filter api

COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/

FROM oven/bun:1-alpine AS builder

RUN pnpm --filter api build:${BUILD_MODE}

FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./

EXPOSE 3000
ENTRYPOINT ["bun", "run", "main.js"]
