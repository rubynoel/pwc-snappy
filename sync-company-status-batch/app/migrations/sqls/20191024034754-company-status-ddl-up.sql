CREATE EXTENSION aws_s3 CASCADE;

CREATE TABLE company_master (name varchar(80), service_name varchar(80), tagline varchar(80), email varchar(80), business_number bigint, restricted_flag boolean, created_on TIMESTAMP, updated_on TIMESTAMP);