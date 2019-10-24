#!/usr/bin/env bash

export DB_USERNAME=$(aws ssm get-parameter --name "$SSM_KEY_DB_USER" --with-decryption | jq --raw-output '.Parameter.Value')
echo DB_USERNAME is $DB_USERNAME

node index.js
