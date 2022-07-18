FROM node:18-alpine

#Python fix
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /proovikas
COPY package*.json ./

RUN mkdir -p ./node_modules
RUN mkdir -p ./client/node_modules
RUN mkdir -p ./server/node_modules


RUN npm install
WORKDIR ./client
COPY ./package*.json .
RUN npm install
WORKDIR .../server
COPY ./package*.json .
RUN npm install
# Bundle app source
COPY . .

EXPOSE 3000
EXPOSE 5000

CMD ["npm", "start"]