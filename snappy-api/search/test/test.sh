#!/usr/bin/env bash

export STAGE=dev
export APPLICATION_ID=pwc-snappy
export SSM_KEY_DB_USER=/pwc-snappy/dev/rds/username/master
export SSM_KEY_DB_HOST=/pwc-snappy/dev/rds/address
export SSM_KEY_DB_NAME=/pwc-snappy/dev/rds/database_name
export SSM_KEY_DB_PASSWORD=/pwc-snappy/dev/rds/password/master
export SSM_KEY_DB_PORT=/pwc-snappy/dev/rds/port
AWS_ACCOUNT_ID=142410210152
provisioning_role=arn:aws:iam::$AWS_ACCOUNT_ID:role/MomentonTechTestProvisioningRole
    assumedRole=$(
        aws sts assume-role --role-arn "$PROVISIONING_ROLE" --role-session-name SnappyTechTestProvisioningRole-EnvDependencies-Session
    )
    export AWS_ACCESS_KEY_ID=$(echo $assumedRole | grep -o '"AccessKeyId": *"[^"]*"' | grep -o '"[^"]*"$' | cut -d '"' -f2)
    export AWS_SECRET_ACCESS_KEY=$(echo $assumedRole | grep -o '"SecretAccessKey": *"[^"]*"' | grep -o '"[^"]*"$' | cut -d '"' -f2)
    export AWS_SESSION_TOKEN=$(echo $assumedRole | grep -o '"SessionToken": *"[^"]*"' | grep -o '"[^"]*"$' | cut -d '"' -f2)


./node_modules/.bin/jest jest test/index.test.js

unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN