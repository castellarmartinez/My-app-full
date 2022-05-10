FROM node:alpine

WORKDIR /usr/My-app-full

COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]
