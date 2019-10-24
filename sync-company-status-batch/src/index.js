"use strict";

const AWS = require("aws-sdk");
const region = process.env["RESOURCE_REGION"];
const jobProcessor = require("./sync-company-status");
const ssm = new AWS.SSM();

AWS.config.update({
  region: "region"
});

const processJob = () => {
  console.log("Running batch..");

  jobProcessor.syncCompanyStatus(
    (dbConfig = {
      user: getSSMParameter(process.env["SSM_KEY_DB_ENDPOINT"]),
      password: getSSMParameter(process.env["SSM_KEY_DB_ENDPOINT"]),
      database: getSSMParameter(process.env["SSM_KEY_DB_ENDPOINT"]),
      host: getSSMParameter(process.env["SSM_KEY_DB_ENDPOINT"]),
      port: getSSMParameter(process.env["SSM_KEY_DB_PORT"])
    })
  );
};

const getSSMParameter = name => {
  ssm
    .getParameter({
      Name: `${name}`,
      WithDecryption: true
    })
    .promise()
    .then(data =>
      data.Parameter
        ? data.Parameter.Value
        : Promise.reject(new Error(`SSM Parameter ${name} is not set.`))
    );
};
processJob();
