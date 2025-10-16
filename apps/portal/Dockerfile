FROM node:22-alpine AS base
WORKDIR /app

RUN pnpm fetch
COPY . /app

EXPOSE 3000
CMD ["node", "server.js"]