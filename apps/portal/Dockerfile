FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm
RUN pnpm fetch --prod
COPY . /app

FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=base /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["node", "server.js"]