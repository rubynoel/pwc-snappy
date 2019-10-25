'use strict';

const {Pool} = require('pg');
const pool = new Pool();
const region = process.env['RESOURCE_REGION'];
const queries = require('./queries');

const syncCompanyStatus = async (isMocked, poolMock) => {
  const pgPool = isMocked ? poolMock : pool;
  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');
    // Create a temp table that exists only for the duration of the
    // transaction to use as a staging table
    const createTmpTableQueryRes = await client.query(
        queries.createTmpTableQuery()
    );
    console.log(`Temp table created ${JSON.stringify(createTmpTableQueryRes)}`);
    // Load the s3 csv data into the temporary staging table
    const importToTmpTableQueryRes = await client.query(
        queries.importFromS3ToTmpTableQuery(dataBucket, fileObjectKey, region)
    );
    console.log(
        `Response from db is ${JSON.stringify(importToTmpTableQueryRes)}`
    );
    // Update the status of existing companies in the company master table
    const updateMasterTableQueryRes = await client.query(
        queries.updateMasterTableQuery()
    );
    console.log(
        `Response from db is ${JSON.stringify(updateMasterTableQueryRes)}`
    );
    // Insert the non-existing rows from staging table to company master table
    const insertMasterTableQueryRes = await client.query(
        queries.insertMasterTableQuery()
    );
    console.log(
        `Response from db is ${JSON.stringify(insertMasterTableQueryRes)}`
    );

    /* await client.query('BEGIN');
      const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id';
      const res = await client.query(queryText, ['brianc']);
      const insertPhotoText =
        'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)';
      const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo'];
      await client.query(insertPhotoText, insertPhotoValues);
      await client.query('COMMIT');*/
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  syncCompanyStatus,
};

// exports.syncCompanyStatus = syncCompanyStatus;
