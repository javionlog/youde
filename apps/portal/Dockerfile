FROM node:22-alpine AS base
WORKDIR /app
COPY . .

FROM node:alpine AS prod
WORKDIR /app
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app .

EXPOSE 3000
CMD ["node", "server.js"]