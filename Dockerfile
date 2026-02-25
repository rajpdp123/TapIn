FROM node:20-alpine
WORKDIR /app
COPY deploy/package.json .
COPY deploy/server.js .
COPY tapin-prototype-standalone.html index.html
EXPOSE 3000
CMD ["node", "server.js"]
