"use strict";

const pg = require("pg");

const syncCompanyStatus = dbConfig => {
  /*var dbConfig = {
    user: "username",
    password: "mypassword",
    database: "myDB",
    host: "myhost.com",
    port: 5432
  };*/
  var client = new pg.Client(dbConfig);
  client.connect();
  client.end();
};

exports.syncCompanyStatus = syncCompanyStatus;
