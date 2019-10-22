#!/usr/bin/env bash

# deploy infra and network dependencies
docker build . -t pwc-base-destroy:latest --file ./network/Dockerfile

STAGE=dev AWS_REGION=ap-southeast-2 docker run --env STAGE --env AWS_REGION pwc-base-destroy:latest
