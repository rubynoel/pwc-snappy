#!/usr/bin/env bash

exit_on_error() {
    if [ $? -eq 0 ]; then
        echo "Error in job. Exiting."
    fi
}

get_ssm_parameter() {
    local value = $(aws ssm get-parameter --name "$1" --with-decryption | jq --raw-output '.Parameter.Value')
    if [ -z "$value" ]; then
        echo "Unable to get SSM Parameter $1"
        exit 1
    else
        echo "$1 is $value"
    fi
    return value
}
echo "Starting the job shell script"

pwd && ls

export DB_HOST=$(get_ssm_parameter "$SSM_KEY_DB_ENDPOINT")
export DB_USERNAME=$(get_ssm_parameter "$SSM_KEY_DB_USER")
export DB_PASSWORD=$(get_ssm_parameter "$SSM_KEY_DB_PASSWORD")
export DB_NAME=$(get_ssm_parameter "$SSM_KEY_DB_NAME")
export DB_PORT=$(get_ssm_parameter "$SSM_KEY_DB_PORT")

node index.js
