const { Pool } = require("pg");
const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env["RESOURCE_REGION"]
});
const ssm = new AWS.SSM();

const getParameter = paramName => {
  const params = {
    Name: paramName,
    WithDecryption: true
  };
  console.log(`paramName is ${paramName}`);
  const data = ssm.getParameter(params);
  console.log(`data is ${data}`);
  return data.Parameter.Value;
};

const getPool = () => {
  const pool = new Pool({
    user: getParameter(process.env["SSM_KEY_DB_USER"]),
    host: getParameter(process.env["SSM_KEY_DB_HOST"]),
    database: getParameter(process.env["SSM_KEY_DB_NAME"]),
    password: getParameter(process.env["SSM_KEY_DB_PASSWORD"]),
    port: getParameter(process.env["SSM_KEY_DB_PORT"])
  });
  return pool;
};

module.exports = { getPool };
