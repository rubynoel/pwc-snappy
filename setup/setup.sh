#!/usr/bin/env bash
set -e
source ./common.sh
source ./env.sh
# deploy infra and network dependencies
docker build . -t pwc-base-infra:latest --file ./base/Dockerfile
STAGE=dev AWS_REGION=ap-southeast-2 GITHUB_TOKEN=$GITHUB_ACCESS_TOKEN docker run --env STAGE --env AWS_REGION --env GITHUB_TOKEN pwc-base-infra:latest

#set_aws_provisioning_creds_withoutjq
#Push build container images to ecr for use in ci pipeline
#build_image_and_push_to_ecr "batch-build" "./cicd/batch"

docker build . -t pwc-cicd:latest --file ./cicd/Dockerfile
STAGE=dev AWS_REGION=ap-southeast-2 GITHUB_TOKEN=$GITHUB_ACCESS_TOKEN docker run -v /var/run/docker.sock:/var/run/docker.sock --env STAGE --env AWS_REGION --env GITHUB_TOKEN pwc-cicd:latest
