FROM node:22-alpine
WORKDIR /app
COPY apps/portal/dist /app/dist
COPY apps/portal/build /app

EXPOSE 4000
ENTRYPOINT [ "node", "server.js" ]