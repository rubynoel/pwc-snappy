{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Resource": [
        "*"
      ],
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeDhcpOptions",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface",
        "ec2:DescribeSubnets",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeVpcs"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterfacePermission"
      ],
      "Resource": [
        "arn:aws:ec2:*:*:network-interface/*"
      ],
      "Condition": {
        "StringEquals": {
          "ec2:Vpc": ["${vpc_arn}"]
        }
      }
    },{
      "Effect": "Allow",
      "Action": [
        "ec2:*"
      ],
      "Resource":  "*",
      "Condition": {
        "StringLike": {
          "ec2:Vpc": ["${vpc_arn}"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "${codepipeline_bucket_arn}",
        "${codepipeline_bucket_arn}/*"
      ]
    },{
            "Sid": "AllowECRActions",
            "Effect": "Allow",
            "Action": "ecr:*",
            "Resource": [
                "arn:aws:ecr:*:*:repository/${application_id}-*",
                "arn:aws:ecr:*:*:repository/${application_id}-*/*"
            ]
        },
        {
            "Sid": "AllowECRGetAuthorizationToken",
            "Effect": "Allow",
            "Action": "ecr:GetAuthorizationToken",
            "Resource": "*"
        },{
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "kms:Create*",
                "kms:List*",
                "kms:UntagResource",
                "kms:Update*",
                "kms:Get*",
                "kms:Describe*",
                "kms:CancelKeyDeletion",
                "kms:Revoke*",
                "kms:TagResource",
                "kms:Disable*",
                "kms:ScheduleKeyDeletion",
                "kms:Delete*",
                "kms:Enable*",
                "kms:Put*"
            ],
            "Resource": "*"
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
            "Action": "kms:*",
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
                "iam:Get*",
                "iam:List*",
                "iam:Create*"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Sid": "VisualEditor3",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::${application_id}*/*",
                "arn:aws:s3:::${application_id}*"
            ]
        },
        {
            "Sid": "VisualEditor4",
            "Effect": "Allow",
            "Action": "cloudformation:*",
            "Resource": "arn:aws:cloudformation:*:*:stack/${application_id}-*/*"
        }, 
        {
            "Sid": "AllowIAMActionsForSnappyByResourceName",
            "Effect": "Allow",
            "Action": "iam:*",
            "Resource": [
                "arn:aws:iam::*:policy/${application_id}*",
                "arn:aws:iam::*:role/${application_id}*",
                "arn:aws:iam::*:role/${application_id}*/*",
                "arn:aws:iam::*:policy/${application_id}*/*",
                "arn:aws:iam::*:instance-profile/${application_id}*",
            ]
        },{
            "Sid": "AllowSSMActionsForSnappy",
            "Effect": "Allow",
            "Action": "ssm:*",
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
        },
        {
            "Sid": "AllowBatchRead",
            "Effect": "Allow",
            "Action": ["batch:Describe*","batch:List*"],
            "Resource": "*"
        },
        {
            "Sid": "AllowBatchWrite",
            "Effect": "Allow",
            "Action": "batch:*",
            "Resource": [
                "arn:aws:batch:*:*:*/${application_id}*",
                "arn:aws:batch:*:*:*/${application_id}*/*",
                "arn:aws:batch:*:*:job-definition/${application_id}*:*"
            ]
        }
  ]
}