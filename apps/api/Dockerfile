FROM oven/bun:1
WORKDIR /app
COPY apps/api/dist /app

EXPOSE 3000
ENTRYPOINT [ "bun", "run", "main.js" ]