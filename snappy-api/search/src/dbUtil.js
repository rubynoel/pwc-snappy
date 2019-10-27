const {Pool} = require('pg');
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env['RESOURCE_REGION'],
});
const ssm = new AWS.SSM();

const getParameter = async (paramName) => {
  const params = {
    Name: paramName,
    WithDecryption: true,
  };
  const data = await ssm.getParameter(params).promise();
  return data.Parameter.Value;
};

const getPool = async () => {
  const pool = new Pool({
    user: await getParameter(process.env['SSM_KEY_DB_USER']),
    host: await getParameter(process.env['SSM_KEY_DB_HOST']),
    database: await getParameter(process.env['SSM_KEY_DB_NAME']),
    password: await getParameter(process.env['SSM_KEY_DB_PASSWORD']),
    port: await getParameter(process.env['SSM_KEY_DB_PORT']),
  });
  return pool;
};

module.exports = {getPool};
