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

psql --host=psql --host=pwc-snappy-dev-company-db.cbdns62mkwjj.ap-southeast-2.rds.amazonaws.com --port=5432 --username=rdssystemuser --password --dbname=SnappyDB

CREATE TABLE test (name varchar(80), taglinevarchar(80), email varchar(80), business_number varchar(80), restricted_flag boolean);

SELECT aws_s3.table_import_from_s3('test','', '(format csv)', aws_commons.create_s3_uri('pwc-snappy-dev-company-status-sync-s3bucket-i5na9hg2bfx3', '/test/datafile', 'ap-southeast-2'));

SELECT aws_s3.table_import_from_s3('test','', '(format csv)', 'pwc-snappy-dev-company-status-sync-s3bucket-i5na9hg2bfx3', '/test/datafile', 'ap-southeast-2');

## How to install postgresql in Redhat Linux

sudo su
dnf -y install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm

dnf -qy module disable postgresql

dnf install postgresql12-server postgresql12-contrib
