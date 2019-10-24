#!/usr/bin/env bash

#TODO: better error handling
exit_on_error() {
    if [ $? -eq 0 ]; then
        echo "Error in job. Exiting."
        exit 1
    fi
}

get_ssm_parameter() {
    return $(aws ssm get-parameter --name $1 --with-decryption | jq --raw-output '.Parameter.Value')
}
echo "Starting the job shell script"

pwd && ls

# set default value for env variables if not set
echo RESOURCE_REGION is $RESOURCE_REGION
export RESOURCE_REGION="${RESOURCE_REGION:-ap-southeast-2}"
export AWS_DEFAULT_REGION=$RESOURCE_REGION

$(get_ssm_parameter "$SSM_KEY_DB_ENDPOINT") && export PGHOST=$?
$(get_ssm_parameter "$SSM_KEY_DB_USER") && export PGUSER=$?
$(get_ssm_parameter "$SSM_KEY_DB_PASSWORD") && export PGPASSWORD=$?
$(get_ssm_parameter "$SSM_KEY_DB_NAME") && export PGDATABASE=$?
$(get_ssm_parameter "$SSM_KEY_DB_PORT") && export PGPORT=$?
export PGDBSCHEMA=public

#node node_modules/db-migrate/bin/db-migrate
node index.js
