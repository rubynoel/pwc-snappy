"use strict";

const AWS = require("aws-sdk");
const region = process.env["RESOURCE_REGION"];

const uuid = require("uuid");

AWS.config.update({
  region: "region"
});

const syncCompanyStatus = async () => {
  console.log("Running batch..");
};

syncCompanyStatus();
