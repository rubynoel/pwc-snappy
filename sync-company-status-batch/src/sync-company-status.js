'use strict';

const pg = require('pg');

const syncCompanyStatus = (dbConfig) => {
  /* var dbConfig = {
    user: "username",
    password: "mypassword",
    database: "myDB",
    host: "myhost.com",
    port: 5432
  };*/
  return loadCompanyData(dbConfig);
};

const loadCompanyData = (dbConfig) => {
  const pgClient = new pg.Client(dbConfig);
  pgClient.connect();
  pgClient
      .query(
      "SELECT aws_s3.table_import_from_s3('company_master','', '(format csv)',:'s3_uri')" //eslint-disable-line
      )
      .promise()
      .then((response) => {
        pgClient.end();
        return response.rows;
      })
      .catch((err) => {
        pgClient.end();
        console.log(`Error occured in data load ${err}`);
        Promise.reject(new Error(`Error occured in data load query ${err}`));
      });
};

exports.syncCompanyStatus = syncCompanyStatus;
