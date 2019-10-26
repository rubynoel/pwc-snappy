'use strict';

const AWS = require('aws-sdk');
const jobProcessor = require('./sync-company-status');

AWS.config.update({
  region: process.env['RESOURCE_REGION'],
});

const processJob = () => {
  jobProcessor.syncCompanyStatus().catch((e) => {
    console.error(e.stack);
    process.exit(1);
  });
};
processJob();
