FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y npm

COPY ./public /react_interface/public
COPY ./src /react_interface/src
COPY ./package.json /react_interface
COPY ./package-lock.json /react_interface
COPY ./webpack.docker.js /react_interface

WORKDIR /react_interface

#ENV S3_ACCESS_KEY_ID="AKIAJVU4424U3GBF56QQ" \
#    S3_ACCESS_KEY="OhuOdv6YLstff6aShxtIO4gKS78AdfZ63OTpqAY5" \
#    S3_REGION="us-east-1" \
#    FLASK_PORT=8080 \
#    FLASK_HOST=131.215.8.170 \
#    S3_BUCKETNAME="deepcell-output"

RUN npm install

CMD npm run startdocker
