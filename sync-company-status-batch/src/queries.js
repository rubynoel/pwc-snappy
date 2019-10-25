'use strict';

const createTmpTableQuery = () => `CREATE TEMP TABLE tmp_company_master(
      id serial,
      name varchar(80), 
      service_name varchar(80), 
      tagline varchar(80),
      email varchar(80), 
      business_number varchar(80), 
      restricted_flag boolean)`;

const importFromS3ToTmpTableQuery = (
    fromDataBucket,
    fromFileObjectKey,
    fromRegion
) => {
  return fromDataBucket && fromFileObjectKey && fromRegion ?
    {
      text: `SELECT aws_s3.table_import_from_s3(
      'tmp_company_master', '', '(format csv, header true)', 
      $1, 
      $2, 
      $3)`,
      values: [fromDataBucket, fromFileObjectKey, fromRegion],
    } :
    null;
};

const insertMasterTableQuery = () =>
  `INSERT INTO company_master  
    SELECT new_companies.name, new_companies.service_name, 
    new_companies.tagline, new_companies.email, 
    new_companies.business_number_int "business_number", 
    new_companies.restricted_flag FROM 
      (SELECT stg.*, regexp_replace(stg.business_number, 
        '[^0-9]+', '', 'g') "business_number_int"
        FROM tmp_company_master as stg EXCEPT select tmp.* from (
          SELECT tmpRaw.*, 
          regexp_replace(tmpRaw.business_number, 
            '[^0-9]+', '', 'g') "business_number_int" 
          FROM tmp_company_master tmpRaw) as tmp 
          JOIN company_master AS mas1 
          ON tmp.business_number_int = mas1.business_number) as new_companies`;

const updateMasterTableQuery = () => `UPDATE company_master_test1  
    SET name = stg.name, service_name = stg.service_name, 
    tagline = stg.tagline, email = stg.email, 
    restricted_flag = stg.restricted_flag 
    FROM  (
      select tmp.* from (
        SELECT tmpRaw.*, regexp_replace(tmpRaw.business_number, 
            '[^0-9]+', '', 'g') "business_number_int" 
          FROM test tmpRaw) as tmp 
          JOIN company_master_test1 AS mas1 
          ON tmp.business_number_int = mas1.business_number) as stg 
          WHERE company_master_test1.business_number = stg.business_number_int`;

module.exports = {
  createTmpTableQuery,
  importFromS3ToTmpTableQuery,
  insertMasterTableQuery,
  updateMasterTableQuery,
};
