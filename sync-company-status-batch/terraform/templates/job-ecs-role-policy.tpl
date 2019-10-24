{
  "Version": "2012-10-17",
  "Statement": [
            {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "kms:*",
            "Resource": "arn:aws:kms:*:*:alias/${application_id}/*"
        },
        {
            "Sid": "AllowKMSKeyActions",
            "Effect": "Allow",
            "Action": [
                "kms:Encrypt",
                "kms:Decrypt",
                "kms:ListKeys",
                "kms:ListAliases",
                "kms:DescribeKey",
                "kms:ListKeyPolicies",
                "kms:GetKeyPolicy",
                "kms:GetKeyRotationStatus",
                "iam:ListUsers",
                "iam:ListRoles"
            ],
            "Resource": "*"
        },
        {
            "Sid": "AllowS3Read",
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::${application_id}*/*",
                "arn:aws:s3:::${application_id}*"
            ]
        },
        {
            "Sid": "AllowSSMActionsForSnappy",
            "Effect": "Allow",
            "Action": "ssm:Get*",
            "Resource": [
                "arn:aws:ssm:*:*:parameter/${application_id}",
                "arn:aws:ssm:*:*:parameter/${application_id}/*"
            ]
        },
        {
            "Sid": "AllowSSMRead",
            "Effect": "Allow",
            "Action": "ssm:Describe*",
            "Resource": "*"
        }
  ]
}