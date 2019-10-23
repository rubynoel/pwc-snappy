#!/usr/bin/env bash

source .env.sh
docker-compose up

docker-compose run --workdir="/code/src" batch npm "run" "build"

docker-compose run --workdir="/code" -v /var/run/docker.sock:/var/run/docker.sock batch sh "deployDev.sh"

docker-compose run --workdir="/code/src" batch npm "run" "test"

#docker-compose run --workdir="/code/sync-company-status-batch/src" batch "npm run build"

docker-compose down
