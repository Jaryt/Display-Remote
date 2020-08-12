FROM  arm32v7/node:12 as build-stage

WORKDIR /app/
COPY package*.json /app/
RUN npm install --only=prod
COPY ./ .

EXPOSE 5000
CMD ["node", "index.js"]