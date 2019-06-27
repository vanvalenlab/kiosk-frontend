FROM node:carbon-alpine

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./
RUN yarn

COPY . .

RUN yarn build

RUN rm -rf server/ src/

CMD yarn start:prod
