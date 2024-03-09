FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
EXPOSE 3307

CMD [ "node", "index.js" ]