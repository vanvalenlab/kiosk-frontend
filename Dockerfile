FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y npm

COPY ./public /react_interface/public
COPY ./src /react_interface/src
COPY ./package.json /react_interface
COPY ./package-lock.json /react_interface
COPY ./webpack.config.js /react_interface

WORKDIR /react_interface

RUN npm install

CMD npm start
