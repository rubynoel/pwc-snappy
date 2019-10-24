CREATE EXTENSION aws_s3 CASCADE;

CREATE TABLE company_master (name varchar(80), tagline	varchar(80), email varchar(80), business_number varchar(80), restricted_flag boolean);