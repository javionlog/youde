FROM node:22-alpine AS base
WORKDIR /app

RUN pnpm install
COPY . /app

EXPOSE 3000
CMD ["node", "server.js"]