#!/usr/bin/env bash

#TODO: better error handling
exit_on_error() {
    if [ $? -eq 0 ]; then
        echo "Error in job. Exiting."
        exit 1
    fi
}

get_ssm_parameter() {
    return $(aws ssm get-parameter --name "$1" --with-decryption | jq --raw-output '.Parameter.Value')
}
echo "Starting the job shell script"

pwd && ls

# set default value for env variables if not set
echo RESOURCE_REGION is $RESOURCE_REGION
export RESOURCE_REGION="${RESOURCE_REGION:-ap-southeast-2}"
export AWS_DEFAULT_REGION=$RESOURCE_REGION

export DB_HOST=$(get_ssm_parameter "$SSM_KEY_DB_ENDPOINT")
export DB_USERNAME=$(get_ssm_parameter "$SSM_KEY_DB_USER")
export DB_PASSWORD=$(get_ssm_parameter "$SSM_KEY_DB_PASSWORD")
export DB_NAME=$(get_ssm_parameter "$SSM_KEY_DB_NAME")
export DB_PORT=$(get_ssm_parameter "$SSM_KEY_DB_PORT")

#node node_modules/db-migrate/bin/db-migrate
node index.js
