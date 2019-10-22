#!/usr/bin/env bash

source ./env.sh
# deploy infra and network dependencies
docker build . -t pwc-base-destroy:latest --file ./base/Dockerfile

STAGE=dev AWS_REGION=ap-southeast-2 GITHUB_TOKEN=$GITHUB_ACCESS_TOKEN docker run --env STAGE --env AWS_REGION --env GITHUB_TOKEN pwc-base-destroy:latest
