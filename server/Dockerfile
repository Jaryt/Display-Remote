FROM node:latest as build-stage
WORKDIR /app/
COPY package*.json /app/
RUN npm install
COPY ./ .

EXPOSE 5000
CMD ["node", "index.js"]