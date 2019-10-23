#!/usr/bin/env bash

source ./util.sh
set_aws_provisioning_creds
source ./terraform/deploy.sh
unset_aws_creds
