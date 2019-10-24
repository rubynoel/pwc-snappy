'use strict';

const {Pool} = require('pg');
const pool = new Pool();

const syncCompanyStatus = async () => {
  const client = await pool.connect();
  try {
    // Create a temp table that exists only for the duration of the transaction to use as a staging table
    const createTmpTableQuery =
      'CREATE TEMP TABLE tmp_company_master(name varchar(80), tagline	varchar(80), email varchar(80), business_number varchar(80), restricted_flag boolean)';
    const createTmpTableQueryRes = await client.query(createTmpTableQuery);
    console.log(`Temp table created ${createTmpTableQuery}`);

    const importToTmpTableQuery =
      "SELECT aws_s3.table_import_from_s3('tmp_company_master','', '(format csv)',:'s3_uri')"; //eslint-disable-line
    const importToTmpTableQueryRes = await client.query(importToTmpTableQuery);
    console.log(`Response from db is ${importToTmpTableQueryRes}`);
    /* await client.query('BEGIN');
      const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id';
      const res = await client.query(queryText, ['brianc']);
      const insertPhotoText =
        'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)';
      const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo'];
      await client.query(insertPhotoText, insertPhotoValues);
      await client.query('COMMIT');*/
  } catch (e) {
    // await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

exports.syncCompanyStatus = syncCompanyStatus;
