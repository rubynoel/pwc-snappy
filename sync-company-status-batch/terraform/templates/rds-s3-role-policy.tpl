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
       }
  ]
}