CREATE EXTENSION aws_s3 CASCADE;

CREATE TABLE company_master (name varchar(80), service_name varchar(80), tagline varchar(80), email varchar(80), business_number bigint, restricted_flag boolean, updated_on TIMESTAMP);

/*UPDATE company_master_test1  SET name = stg.name, service_name = stg.service_name, tagline = stg.tagline, email = stg.email, restricted_flag = stg.restricted_flag FROM  (select tmp.* from (SELECT tmpRaw.*, regexp_replace(tmpRaw.business_number, '[^0-9]+', '', 'g') "business_number_int" FROM test tmpRaw) as tmp JOIN company_master_test1 AS mas1 ON tmp.business_number_int = mas1.business_number) as stg WHERE company_master_test1.business_number = stg.business_number_int;

INSERT INTO company_master_test1  SELECT new_companies.name, new_companies.service_name, new_companies.tagline, new_companies.email, new_companies.business_number_int "business_number", new_companies.restricted_flag FROM (SELECT stg.*, regexp_replace(stg.business_number, '[^0-9]+', '', 'g') "business_number_int" FROM test as stg EXCEPT select tmp.* from (SELECT tmpRaw.*, regexp_replace(tmpRaw.business_number, '[^0-9]+', '', 'g') "business_number_int" FROM test tmpRaw) as tmp JOIN company_master_test1 AS mas1 ON tmp.business_number_int = mas1.business_number) as new_companies;
*/