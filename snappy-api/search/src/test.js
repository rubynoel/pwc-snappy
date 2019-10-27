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
  console.log(`paramName is ${paramName}`);
  const data = await ssm.getParameter(params).promise();
  console.log(`data is ${data.Parameter.Value}`);
  return data.Parameter.Value;
};

const getPool = async () => {
  const pool = new Pool({
    user: await getParameter('/pwc-snappy/dev/rds/username/master'),
    host: await getParameter('/pwc-snappy/dev/rds/address'),
    database: await getParameter('/pwc-snappy/dev/rds/database_name'),
    password: await getParameter('/pwc-snappy/dev/rds/password/master'),
    port: await getParameter('/pwc-snappy/dev/rds/port'),
  });
  return pool;
};

getPool();
