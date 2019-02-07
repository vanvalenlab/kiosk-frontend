FROM node:carbon-alpine-yarn

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./
RUN yarn

COPY . .

CMD yarn start:prod
