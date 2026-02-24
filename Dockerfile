FROM node:22

# Install python (required for yt-dlp)
RUN apt-get update && apt-get install -y python3 python-is-python3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]