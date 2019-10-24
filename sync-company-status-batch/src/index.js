'use strict';

const AWS = require('aws-sdk');
const jobProcessor = require('./sync-company-status');
const ssm = new AWS.SSM();

AWS.config.update({
  region: process.env['RESOURCE_REGION'],
});

const processJob = async () => {
  console.log('Running batch..');

  jobProcessor.syncCompanyStatus(
      (dbConfig = {
        user: await getSSMParameter(process.env['SSM_KEY_DB_USER']),
        password: await getSSMParameter(process.env['SSM_KEY_DB_PASSWORD']),
        database: await getSSMParameter(process.env['SSM_KEY_DB_ENDPOINT']),
        host: await getSSMParameter(process.env['SSM_KEY_DB_ENDPOINT']),
        port: await getSSMParameter(process.env['SSM_KEY_DB_PORT']),
      })
  );
};

const getSSMParameter = (name) => {
  return new Promise((resolve, reject) => {
    ssm
        .getParameter({
          Name: `${name}`,
          WithDecryption: true,
        })
        .promise()
        .then((data) =>
        data.Parameter ?
          resolve(data.Parameter.Value) :
          reject(new Error(`SSM Parameter ${name} is not set.`))
        );
  });
};
processJob();
