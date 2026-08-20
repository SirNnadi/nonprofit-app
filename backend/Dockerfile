FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./

EXPOSE 5000

CMD ["node", "server.js"]
