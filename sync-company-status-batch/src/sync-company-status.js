'use strict';

const {Pool} = require('pg');
const pool = new Pool();

const syncCompanyStatus = () => {
  (async () => {
    const client = await pool.connect();
    try {
      const importToTmpTableQuery =
        "SELECT aws_s3.table_import_from_s3('company_master','', '(format csv)',:'s3_uri')"; //eslint-disable-line
      const importToTmpTableQueryRes = await client.query(
          importToTmpTableQuery
      );
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
  })().catch((e) => console.error(e.stack));
};

exports.syncCompanyStatus = syncCompanyStatus;
