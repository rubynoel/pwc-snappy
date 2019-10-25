#!/usr/bin/env bash

#TODO: better error handling
exit_on_error() {
    if [ $? -eq 0 ]; then
        echo "Error in job. Exiting."
        exit 1
    fi
}

ssm_get_parameter() {
    value=$(aws ssm get-parameter --name $1 --with-decryption | jq --raw-output '.Parameter.Value')
    echo "Value in function is"$value
    return "$value"
}

echo "Starting the job shell script"

pwd && ls

# set default value for env variables if not set
echo RESOURCE_REGION is $RESOURCE_REGION
export RESOURCE_REGION="${RESOURCE_REGION:-ap-southeast-2}"
export AWS_DEFAULT_REGION=$RESOURCE_REGION
#$(get_ssm_parameter "$SSM_KEY_DB_ENDPOINT") &&
# TODO: Move ssm get parameter to a function
ssm_get_parameter $SSM_KEY_DB_HOST && PGHOST=$?
export PGHOST=$(aws ssm get-parameter --name $SSM_KEY_DB_HOST --with-decryption | jq --raw-output '.Parameter.Value')
export PGUSER=$(aws ssm get-parameter --name $SSM_KEY_DB_USER --with-decryption | jq --raw-output '.Parameter.Value')
export PGPASSWORD=$(aws ssm get-parameter --name $SSM_KEY_DB_PASSWORD --with-decryption | jq --raw-output '.Parameter.Value')
export PGDATABASE=$(aws ssm get-parameter --name $SSM_KEY_DB_NAME --with-decryption | jq --raw-output '.Parameter.Value')
export PGPORT=$(aws ssm get-parameter --name $SSM_KEY_DB_PORT --with-decryption | jq --raw-output '.Parameter.Value')
export PGDBSCHEMA=public

echo PGHOST is $PGHOST
node node_modules/db-migrate/bin/db-migrate up --config ./db/config/database.json --env thisEnv --migrations-dir ./db/migrations
node index.js
echo "Job exit code is "$?
