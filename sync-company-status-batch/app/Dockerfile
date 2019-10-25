FROM node:8.16.2-alpine

RUN apk add --update bash \
    python \
    python-dev \
    py-pip \
    build-base \
    zip \ 
    unzip \
    wget \
    jq \
    curl \
    docker openrc \
    terraform \
    && pip install awscli --upgrade \
    && apk --purge -v del py-pip \
    && rm -rf /var/cache/apk/*

RUN echo "Terraform installed" && terraform --version
RUN echo "AWS CLI installed" && aws --version

WORKDIR /app

COPY ./app/dist /app
COPY ./app/entrypoint.sh /app
COPY ./app/db /app/db
COPY ./app/migrations /app/migrations
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]