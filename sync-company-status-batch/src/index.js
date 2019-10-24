'use strict';

const AWS = require('aws-sdk');
const jobProcessor = require('./sync-company-status');
const ssm = new AWS.SSM();

AWS.config.update({
  region: process.env['RESOURCE_REGION'],
});

const processJob = () => {
  console.log('Running batch..');

  jobProcessor.syncCompanyStatus(
      (dbConfig = {
        user: getSSMParameter(process.env['SSM_KEY_DB_USER']),
        password: getSSMParameter(process.env['SSM_KEY_DB_PASSWORD']),
        database: getSSMParameter(process.env['SSM_KEY_DB_ENDPOINT']),
        host: getSSMParameter(process.env['SSM_KEY_DB_ENDPOINT']),
        port: getSSMParameter(process.env['SSM_KEY_DB_PORT']),
      })
  );
};

const getSSMParameter = (name) => {
  ssm
      .getParameter({
        Name: `${name}`,
        WithDecryption: true,
      })
      .promise()
      .then((data) =>
      data.Parameter ?
        data.Parameter.Value :
        Promise.reject(new Error(`SSM Parameter ${name} is not set.`))
      );
};
processJob();
