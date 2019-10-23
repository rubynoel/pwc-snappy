#!/usr/bin/env bash

source ./common.sh

# Get the terraform remote backend state bucket
set_aws_provisioning_creds
cfn_stack_name="$APPLICATION_ID"-"$STAGE"
stack_output=$(aws cloudformation describe-stacks --stack-name $cfn_stack_name)
unset_aws_creds

export TF_VAR_s3_kms_key_id=$(echo $stack_output | jq --raw-output '.Stacks[0].Outputs[0].OutputValue')
export TF_VAR_s3_backend_name=$(echo $stack_output | jq --raw-output '.Stacks[0].Outputs[1].OutputValue')
export TF_VAR_aws_account_id=$AWS_ACCOUNT_ID
export TF_VAR_stage=$STAGE
export TF_VAR_aws_region=$AWS_DEFAULT_REGION
export TF_VAR_application_id=$APPLICATION_ID
export TF_VAR_provisioning_role_arn=$PROVISIONING_ROLE
export TF_VAR_github_token=$GITHUB_TOKEN

terraform init -backend-config="bucket=$TF_VAR_s3_backend_name" -backend-config="kms_key_id=$TF_VAR_s3_kms_key_id" -backend-config="region=$TF_VAR_aws_region" -backend-config="key=$TF_VAR_application_id/cicdAmi/$STAGE" -backend-config="role_arn=$PROVISIONING_ROLE" ./terraform
export TF_LOG=DEBUG
terraform destroy --auto-approve ./terraform
