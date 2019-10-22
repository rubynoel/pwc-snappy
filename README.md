# pwc-snappy

Code Challenge for Snappy

"kms:Create*",
"kms:Describe*",
"kms:Enable*",
"kms:List*",
"kms:Put*",
"kms:Update*",
"kms:Revoke*",
"kms:Disable*",
"kms:Get*",
"kms:Delete*",
"kms:TagResource",
"kms:UntagResource",
"kms:ScheduleKeyDeletion,
"kms:CancelKeyDeletion"

              ,
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": "iam:*",
            "Resource": [
                "arn:aws:iam::*:policy/pwc-snappy*",
                "arn:aws:iam::*:role/pwc-snappy*"
            ]
        }
