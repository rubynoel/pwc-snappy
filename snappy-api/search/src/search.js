'use strict';

const {getPool} = require('./dbUtil');
const {searchByCompanyName} = require('./searchByCompanyName');

const searchFields = {
  COMPANY_NAME: 'companyName',
  BUSINESS_NUMER: 'businessNumber',
  RESTRICTED_STATUS: 'restrictedStatus',
};

const pageLimitMax = 100;

const search = async (params) => {
  const pgPool = params.isMocked ? params.poolMock : getPool();

  const pageLimit =
    params.limit && params.limit > 0 && params.limit <= pageLimitMax ?
      params.limit :
      pageLimitMax;
  switch (params.fieldName) {
    case searchFields.COMPANY_NAME:
      const searchResults = await searchByCompanyName(pgPool, {
        keyword: params.fieldValue,
        offset: params.from,
        limit: pageLimit,
      });
      console.log(`${searchResults}`);
      break;
    case searchFields.BUSINESS_NUMER:
      break;
    case searchFields.RESTRICTED_STATUS:
      break;
    default:
      break;
  }

  return {total: 1000, rows: [{companyName: 'dummy'}]};
};

module.exports = {search};
