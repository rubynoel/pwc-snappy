FROM node:8.16.2-alpine

RUN apk update

RUN apk add --update zip unzip wget python3-pip jq curl

RUN pip3 install awscli --upgrade

RUN echo "AWS CLI installed" && aws --version