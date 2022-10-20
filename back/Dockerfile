FROM node:lts-alpine
 
RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache curl
 
COPY package*.json ./
RUN npm i

COPY tsconfig.json ./
 
COPY src src
 
CMD npm start