FROM node:19-alpine

COPY package.json /app/
COPY index.js /app/

WORKDIR /app

RUN npm install

CMD [ "npm", "start" ]