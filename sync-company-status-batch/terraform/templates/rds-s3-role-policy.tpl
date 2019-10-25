{
  "Version": "2012-10-17",
  "Statement": [
      {
         "Sid": "s3import",
         "Action": [
           "s3:Get*",
           "s3:List*"
         ],
         "Effect": "Allow",
         "Resource": [
           "arn:aws:s3:::${application_id}*/*",
           "arn:aws:s3:::${application_id}*"
         ] 
       },
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
        }
  ]
}