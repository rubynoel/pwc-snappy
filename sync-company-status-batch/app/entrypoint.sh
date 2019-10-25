#!/usr/bin/env bash

#TODO: better error handling
exit_on_error() {
    if [ $? -ne 0 ]; then
        echo "Error in job. Exiting."
        exit 1
    fi
}
pwd
ls
# set default value for env variables if not set
echo RESOURCE_REGION is $RESOURCE_REGION
export RESOURCE_REGION="${RESOURCE_REGION:-ap-southeast-2}"
export AWS_DEFAULT_REGION=$RESOURCE_REGION

# TODO: Move ssm get parameter to a function
export PGHOST=$(aws ssm get-parameter --name $SSM_KEY_DB_HOST --with-decryption | jq --raw-output '.Parameter.Value')
export PGUSER=$(aws ssm get-parameter --name $SSM_KEY_DB_USER --with-decryption | jq --raw-output '.Parameter.Value')
export PGPASSWORD=$(aws ssm get-parameter --name $SSM_KEY_DB_PASSWORD --with-decryption | jq --raw-output '.Parameter.Value')
export PGDATABASE=$(aws ssm get-parameter --name $SSM_KEY_DB_NAME --with-decryption | jq --raw-output '.Parameter.Value')
export PGPORT=$(aws ssm get-parameter --name $SSM_KEY_DB_PORT --with-decryption | jq --raw-output '.Parameter.Value')
export PGDBSCHEMA=public

node node_modules/db-migrate/bin/db-migrate up --config ./db/config/database.json --env thisEnv --migrations-dir ./migrations || exit_on_error
node app.js
echo "Job exit code is "$?
