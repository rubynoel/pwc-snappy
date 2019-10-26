'use strict';

const {getPool} = require('./dbUtil');
const {searchByCompanyName} = require('./searchByCompanyName');

const search = async (params) => {
  const pgPool = params.isMocked ? params.poolMock : getPool();
  searchByCompanyName(pgPool, {});
  return {total: 1000, rows: [{companyName: 'dummy'}]};
};

module.exports = {search};
