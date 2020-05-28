# pwc-snappy

## setup
Has day zero scripts for vpc setup and cicd pipeline setup(AWS Code Pipeline).
Commits to the master branch trigger AWS Code Pipeline to build and deploy snappy-api and snappy-ui.

## sync-company-status-batch
Scheduled batch run every 10 mins to load csv file from S3 to RDS Postgres using AWS Batch and Cloudwatch events. Batch runs securely within VPC using ECS tasks. RDS connection details are retrieved by the task from encrypted params in SSM Parameter Store.

## snappy-api
Rest apis for snappy search
The rest api is secured with IAM auth. Lambda runs securely within VPC in private subnet and connects to RDS. RDS connection details are retrieved by lambda from encrypted params in SSM Parameter Store.

## snappy-ui
React app for snappy search.
When user signs in, the app authenticates the user with Cognito identity provider and obtains temporary IAM credentials using Cognito Identity Pool Federated Identities. The IAM credentials are passed to the Snappy rest api for searching company database by name, business number and restricted status.
Api Urls are hardcoded as of now. No time to webpack :-)
