# Snappy Day Zero Setup

This folder contains scripts needed to provision the day zero dependencies for Snappy such as networking resources like VPC, subnets, etc and CICD pipelines.

## Pre-requisities

An AWS EC2 instance with Docker installed. Login to the instance to execute the setup scripts in this repository. The instance must be configured with an instance profile with the permissions as listed in _provisioning-role-policy.json_. Refer [EC2 Provisioning Instance Role](#EC2-Provisioning-Instance-Role) section to set this up.

**Note**: The scripts will detect the AWS account id from the EC2 instance metadata and provision resources in this account. If you wish to provision the resources in a different account, the scripts need to be modified to use a cross account role in target account that is assumable by this instance to provision resources in the target account.

### EC2 Provisioning Instance Role

Execute the below commands from the AWS cli (with a profile that has create permissions in IAM). Alternatively you can use the AWS console to perform these steps by using the policy json file provided.

#### If the EC2 instance does not exist or is not associated with an instance profile yet

- Create a EC2 Instance Role with the required permissions for provisioning snappy resources

```
aws iam create-policy --policy-name SnappyTechTestProvisioningRolePolicy --policy-document file://provisioning-role-policy.json
```

The output of the create-policy command will be a json similar to the sample output below. Copy the value of the Arn field to use in subsequent commands.

```
{
    "Policy": {
        "PolicyName": "SnappyTechTestProvisioningRolePolicy",
        "PermissionsBoundaryUsageCount": 0,
        "CreateDate": "2019-10-18T10:12:17Z",
        "AttachmentCount": 0,
        "IsAttachable": true,
        "PolicyId": "ZXR6A36LTYANPAI7NJ5UV",
        "DefaultVersionId": "v1",
        "Path": "/",
        "Arn": "arn:aws:iam::0123456789012:policy/SnappyTechTestProvisioningRolePolicy",
        "UpdateDate": "2019-10-18T10:12:17Z"
    }
}
```

```
aws iam create-role --role-name SnappyTechTestProvisioningRole --assume-role-policy-document file://provisioning-role-trust-policy.json
```

Substitute the value for policy-arn parameter with the Arn value copied from the create-policy command output.

```
aws iam attach-role-policy --policy-arn arn:aws:iam::0123456789012:policy/SnappyTechTestProvisioningRolePolicy --role-name SnappyTechTestProvisioningRole

aws iam create-instance-profile --instance-profile-name SnappyTechTestProvisioningInstanceProfile

aws iam add-role-to-instance-profile --instance-profile-name SnappyTechTestProvisioningInstanceProfile --role-name SnappyTechTestProvisioningRole

```

Specify the SnappyTechTestProvisioningInstanceProfile either during new EC2 instance launch in the IAM role field of the Instance Details section or attach the profile to the existing instance using Attach/Replace IAM Role in Instance Settings.

#### If you already have an instance profile associated with this EC2 instance

```

aws iam create-policy --policy-name SnappyTechTestProvisioningRolePolicy --policy-document file://provisioning-role-policy.json

```

The output of the create-policy command will be a json similar to the sample output below. Copy the value of the Arn field to use in the next command.

```
aws iam attach-role-policy --policy-arn arn:aws:iam::0123456789012:policy/SnappyTechTestProvisioningRolePolicy --role-name NameOfExistingInstanceRole

```