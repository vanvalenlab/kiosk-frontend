FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y npm

WORKDIR /react_interface

COPY ./package.json /react_interface
COPY ./package-lock.json /react_interface
RUN npm install

COPY ./webpack.docker.js /react_interface
COPY ./test_image /react_interface
COPY ./public /react_interface/public
COPY ./src /react_interface/src

#ENV AWS_ACCESS_KEY_ID="AKIAJVU4424U3GBF56QQ" \
#    AWS_SECRET_ACCESS_KEY="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" \
#    AWS_REGION="us-east-1" \
#    EXPRESS_HOST="localhost" \
#    EXPRESS_PORT=8080 \
#    AWS_S3_BUCKET="deepcell-output"

CMD npm run startdocker
