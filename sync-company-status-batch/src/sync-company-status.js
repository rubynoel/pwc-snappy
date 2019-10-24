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
  return new Promise(loadCompanyData(dbConfig));
};

const loadCompanyData = (dbConfig) => {
  const loadDataQuery = () => {
    const pgClient = new pg.Client(dbConfig);
    pgClient.connect();
    pgClient
        .query(
            'SELECT aws_s3.table_import_from_s3(\'company_master\',\'\', \'(format csv)\',:\'s3_uri\')'
        )
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

  loadDataQuery
      .then((response) => {
        console.log(`PG response is ${response}`);
      })
      .catch((err) => {
        console.log(`Error occured in data load ${err}`);
        Promise.reject(new Error(`Error occured in data load ${err}`));
      });
};

exports.syncCompanyStatus = syncCompanyStatus;
