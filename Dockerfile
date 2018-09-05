FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y npm

WORKDIR /react_interface

COPY ./package.json ./package-lock.json /react_interface/
RUN npm install

COPY . /react_interface

CMD npm run startdocker
