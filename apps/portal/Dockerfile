FROM node:22-alpine
WORKDIR /app
COPY ./dist /app/dist
COPY ./build /app

EXPOSE 4000
ENTRYPOINT [ "node", "server.js" ]