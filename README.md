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

CREATE TABLE test (id SERIAL, name varchar(80), service_name varchar(80), tagline varchar(80), email varchar(80), business_number varchar(80), restricted_flag boolean);

SELECT aws_s3.table_import_from_s3('test','', '(format csv)', aws_commons.create_s3_uri('pwc-snappy-dev-company-status-sync-s3bucket-i5na9hg2bfx3', '/test/datafile', 'ap-southeast-2'));

SELECT aws_s3.table_import_from_s3('test','', '(format csv, header true)', 'pwc-snappy-dev-company-status-sync-s3bucket-i5na9hg2bfx3', 'test/datafile/company_data.csv', 'ap-southeast-2');

## How to install postgresql in Redhat Linux

sudo su
dnf -y install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm

dnf -qy module disable postgresql

dnf install postgresql12-server postgresql12-contrib

---

steps
CREATE TABLE test (id SERIAL, name varchar(80), service_name varchar(80), tagline varchar(80), email varchar(80), business_number varchar(80), restricted_flag boolean);

SELECT aws_s3.table_import_from_s3('test','', '(format csv, header true)', 'pwc-snappy-dev-company-status-sync-s3bucket-i5na9hg2bfx3', 'test/datafile/company_data.csv', 'ap-southeast-2');

CREATE TABLE company_master_test1 (name varchar(80), service_name varchar(80), tagline varchar(80), email varchar(80), business_number varchar(80), restricted_flag boolean);

INSERT INTO company_master_test1 as (SELECT \* FROM test as stg_tbl join company_master_test1 mas on regexp_replace(stg_tbl.business_number, '[^0-9]+', '', 'g') = mas.business_number

UPDATE table company_master_test1 mas SET mas.business_number = stg_tbl.business_number_int FROM ( SELECT tmp.\*, regexp_replace(stg_tbl.business_number, '[^0-9]+', '', 'g') as business_number_int FROM test as tmp )as stg_tbl JOIN company_master_test1 as mas1 ON stg_tbl.business_number_int = mas1.business_number WHERE stg_tbl.business_number_int = mas.business_number;

UPDATE table company_master_test1 as mas SET mas.business_number = stg.business_number_int
FROM (
SELECT tmp.\*, regexp_replace(tmp.business_number, '[^0-9]+', '', 'g') "business_number_int" FROM test as tmp
JOIN company_master_test1 AS mas1 ON tmp.business_number_int = mas1.business_number
) as stg
WHERE mas.business_number = stg.business_number_int;

select _ FROM company_master_test1 as mas, (select tmp._ from (SELECT tmpRaw.\*, regexp_replace(tmpRaw.business_number, '[^0-9]+', '', 'g') "business_number_int" FROM test tmpRaw) as tmp JOIN company_master_test1 AS mas1 ON tmp.business_number_int = mas1.business_number) as stg WHERE mas.business_number = stg.business_number_int;

UPDATE company_master_test1 SET name = stg.name, service_name = stg.service_name, tagline = stg.tagline, email = stg.email, restricted_flag = stg.restricted_flag FROM (select tmp._ from (SELECT tmpRaw._, regexp_replace(tmpRaw.business_number, '[^0-9]+', '', 'g') "business_number_int" FROM test tmpRaw) as tmp JOIN company_master_test1 AS mas1 ON tmp.business_number_int = mas1.business_number) as stg WHERE company_master_test1.business_number = stg.business_number_int;

INSERT INTO company_master_test1 SET business_number = stg.business_number_int FROM (select tmp.business_number_int from (SELECT tmpRaw.\*, regexp_replace(tmpRaw.business_number, '[^0-9]+', '', 'g') "business_number_int" FROM test tmpRaw) as tmp JOIN company_master_test1 AS mas1 ON tmp.business_number_int = mas1.business_number) as stg WHERE company_master_test1.business_number = stg.business_number_int;
