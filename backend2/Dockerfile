FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
COPY .env.example .env
EXPOSE 3000
CMD ["node", "server.js"] 