set_aws_provisioning_creds() {
    assumedRole=$(
        aws sts assume-role --role-arn "$PROVISIONING_ROLE" --role-session-name SnappyTechTestProvisioningRole-EnvDependencies-Session
    )
    export AWS_ACCESS_KEY_ID=$(echo $assumedRole | jq --raw-output '.Credentials.AccessKeyId')
    export AWS_SECRET_ACCESS_KEY=$(echo $assumedRole | jq --raw-output '.Credentials.SecretAccessKey')
    export AWS_SESSION_TOKEN=$(echo $assumedRole | jq --raw-output '.Credentials.SessionToken')
}

unset_aws_creds() {
    unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
}

provision_terraform_backend() {
    aws cloudformation deploy --template-file ./cfn-templates/S3.yml --parameter-overrides ApplicationId=$2 --stack-name $1
}

build_image_and_push_to_ecr() {
    $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)
    local IMAGE_TAG=$1
    local build_dir=$2
    docker build $build_dir -t ${ECR_REPO_NAME}:$IMAGE_TAG
    docker tag $ECR_REPO_NAME:$IMAGE_TAG $ECR_REPO_URL/$ECR_REPO_NAME:$IMAGE_TAG
    docker push $ECR_REPO_URL/$ECR_REPO_NAME:$IMAGE_TAG
}

if [[ -z "${AWS_ACCOUNT_ID}" ]]; then
    # If AWS_ACCOUNT_ID is not passed try to infer the account id from ec2 instance metadata url
    export AWS_ACCOUNT_ID=$(curl http://169.254.169.254/latest/dynamic/instance-identity/document | jq --raw-output '.accountId')
fi

echo AWS_ACCOUNT_ID is $AWS_ACCOUNT_ID
export PROVISIONING_ROLE=arn:aws:iam::$AWS_ACCOUNT_ID:role/SnappyTechTestProvisioningRole

# set default value for env variables if not set
export AWS_DEFAULT_REGION="${AWS_REGION:-ap-southeast-2}"
export APPLICATION_ID="${APPLICATION_ID:-pwc-snappy}"
export STAGE="${STAGE:-unittest}"

export ECR_REPO_NAME=${APPLICATION_ID}-${STAGE}
export ECR_REPO_URL=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
