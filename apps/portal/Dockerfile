FROM node:22-alpine AS builder
WORKDIR /app

ARG BUILD_MODE=prod

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/portal/package.json ./apps/portal/

RUN pnpm install --filter shared --filter portal --ignore-scripts

COPY packages/shared/ ./packages/shared/
COPY apps/portal/ ./apps/portal/

RUN pnpm --filter shared build:${BUILD_MODE}
RUN pnpm --filter portal build:${BUILD_MODE}

FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/apps/portal/dist ./dist
COPY --from=builder /app/apps/portal/build ./

EXPOSE 4000
ENTRYPOINT ["node", "server.js"]
