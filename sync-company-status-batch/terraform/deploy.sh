#!/usr/bin/env bash

# Create/Update the terraform remote backend
appResourceName=company-status-sync
cfn_stack_name="$APPLICATION_ID"-"$STAGE"-$appResourceName
aws cloudformation deploy --template-file ./cfn-templates/S3.yml --parameter-overrides ApplicationId=$APPLICATION_ID-$appResourceName --stack-name $cfn_stack_name
stack_output=$(aws cloudformation describe-stacks --stack-name $cfn_stack_name)

# Not using tfvars as these are variables are common to all environments
# In cases where maintaining different values per env is required,
# this is achieved by using STAGE env variable
# eg., company_data_file_object_key has different values per stage (
# where stage can be anything like dev, test, prod etc)
export TF_VAR_s3_kms_key_id=$(echo $stack_output | jq --raw-output '.Stacks[0].Outputs[0].OutputValue')
export TF_VAR_s3_backend_name=$(echo $stack_output | jq --raw-output '.Stacks[0].Outputs[1].OutputValue')
export TF_VAR_aws_account_id=$AWS_ACCOUNT_ID
export TF_VAR_stage=$STAGE
export TF_VAR_aws_region=$AWS_DEFAULT_REGION
export TF_VAR_application_id=$APPLICATION_ID
export TF_VAR_batch_job_ecr_repo_url=$ECR_REPO_URL
export TF_VAR_batch_job_ecr_repo_name=$ECR_REPO_NAME
export TF_VAR_batch_job_image_name=$IMAGE_TAG
export TF_VAR_batch_name=sync-company-status
export TF_VAR_rds_db_name=SnappyDB
# TODO: use a different bucket for company status sync batch job
export TF_VAR_company_data_bucket=$TF_VAR_s3_backend_name
export TF_VAR_company_data_file_object_key=company_status_data/$STAGE/DataFile.csv

echo "Terraform backend is"$TF_VAR_s3_backend_name
terraform init -backend-config="bucket=$TF_VAR_s3_backend_name" -backend-config="kms_key_id=$TF_VAR_s3_kms_key_id" -backend-config="region=$TF_VAR_aws_region" -backend-config="key=$TF_VAR_application_id/cicdAmi/$STAGE" .

terraform plan -out=./tfplan .

terraform apply --auto-approve ./tfplan
