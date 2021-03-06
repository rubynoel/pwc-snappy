#!/usr/bin/env bash
set -e
source ./common.sh
source ./env.sh
# deploy infra and network dependencies
docker build . -t pwc-base-infra:latest --file ./base/Dockerfile
STAGE=dev AWS_REGION=ap-southeast-2 GITHUB_TOKEN=$GITHUB_ACCESS_TOKEN docker run --env STAGE --env AWS_REGION --env GITHUB_TOKEN pwc-base-infra:latest

# deploy the cicd pipelines
docker build . -t pwc-cicd:latest --file ./cicd/Dockerfile
STAGE=dev AWS_REGION=ap-southeast-2 GITHUB_TOKEN=$GITHUB_ACCESS_TOKEN docker run -v /var/run/docker.sock:/var/run/docker.sock --env STAGE --env AWS_REGION --env GITHUB_TOKEN pwc-cicd:latest
