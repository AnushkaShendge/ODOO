FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
COPY .env.example .env
EXPOSE 5000
CMD ["node", "index.js"] 