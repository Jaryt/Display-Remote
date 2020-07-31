FROM node:latest as build-stage
WORKDIR /app/
COPY package*.json /app/
RUN npm install
COPY ./ .

EXPOSE 5000
RUN mkdir /app/media/
CMD ["node", "index.js"]