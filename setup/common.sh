set_aws_provisioning_creds() {
    assumedRole=$(
        aws sts assume-role --role-arn "$PROVISIONING_ROLE" --role-session-name SnappyTechTestProvisioningRole-EnvDependencies-Session
    )
    export AWS_ACCESS_KEY_ID=$(echo $assumedRole | jq --raw-output '.Credentials.AccessKeyId')
    export AWS_SECRET_ACCESS_KEY=$(echo $assumedRole | jq --raw-output '.Credentials.SecretAccessKey')
    export AWS_SESSION_TOKEN=$(echo $assumedRole | jq --raw-output '.Credentials.SessionToken')
}

set_aws_provisioning_creds_withoutjq() {
    # convenience method to run outside docker container without jq installed
    provisioning_role=arn:aws:iam::$AWS_ACCOUNT_ID:role/MomentonTechTestProvisioningRole
    assumedRole=$(
        aws sts assume-role --role-arn "$provisioning_role" --role-session-name MomentonTechTestProvisioningRole-EnvDependencies-Session
    )
    export AWS_ACCESS_KEY_ID=$(echo $assumedRole | grep -o '"AccessKeyId": *"[^"]*"' | grep -o '"[^"]*"$' | cut -d '"' -f2)
    export AWS_SECRET_ACCESS_KEY=$(echo $assumedRole | grep -o '"SecretAccessKey": *"[^"]*"' | grep -o '"[^"]*"$' | cut -d '"' -f2)
    export AWS_SESSION_TOKEN=$(echo $assumedRole | grep -o '"SessionToken": *"[^"]*"' | grep -o '"[^"]*"$' | cut -d '"' -f2)

}

unset_aws_creds() {
    unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

provision_terraform_backend() {
    cfn_stack_name=$1
    aws cloudformation deploy --template-file ./cfn-templates/S3.yml --parameter-overrides ApplicationId=$APPLICATION_ID --stack-name $cfn_stack_name
    echo "cfn deploy done"
}

build_image_and_push_to_ecr() {
    $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)
    local IMAGE_TAG=$1
    local build_dir=$2
    docker build $build_dir -t ${ECR_REPO_NAME}:$IMAGE_TAG
    docker tag $ECR_REPO_NAME:$IMAGE_TAG $ECR_REPO_URL/$ECR_REPO_NAME:$IMAGE_TAG
    docker push $ECR_REPO_URL/$ECR_REPO_NAME:$IMAGE_TAG
}

# Get the account id from the instance metadata url
export AWS_ACCOUNT_ID=$(curl http://169.254.169.254/latest/dynamic/instance-identity/document | jq --raw-output '.accountId')
echo AWS_ACCOUNT_ID is $AWS_ACCOUNT_ID
export PROVISIONING_ROLE=arn:aws:iam::$AWS_ACCOUNT_ID:role/SnappyTechTestProvisioningRole

# set default value for env variables if not set
export AWS_DEFAULT_REGION="${AWS_REGION:-ap-southeast-2}"
export APPLICATION_ID="${APPLICATION_ID:-pwc-snappy}"
export STAGE="${STAGE:-unittest}"

export ECR_REPO_NAME=${APPLICATION_ID}-${STAGE}
export ECR_REPO_URL=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
