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
  validate(params);
  const {fieldName, fieldValue, from, limit, isMocked, poolMock} = params;
  const pgPool = isMocked ? poolMock : getPool();
  const pageLimit =
    limit && limit > 0 && limit <= pageLimitMax ? limit : pageLimitMax;

  switch (fieldName) {
    case searchFields.COMPANY_NAME:
      const searchResults = await searchByCompanyName(pgPool, {
        keyword: fieldValue,
        offset: from,
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

const errorMessages = {
  FIELDNAME_MISSING_ERR: 'fieldName is not passed or blank or undefined',
  FIELDVALUE_MISSING_ERR: 'fieldValue is not passed or blank or undefined',
  OFFSET_MISSING_ERR: 'Offset value must be a number between 0 and limit-1',
  LIMIT_MISSING_ERR: 'Limit value must be a non zero positive number',
};

const validate = (searchParams) => {
  const errors = [];
  const {fieldName, fieldValue, from, limit} = searchParams;
  if (!fieldName) {
    errors.push(errorMessages.FIELDNAME_MISSING_ERR);
  }
  if (!fieldValue) {
    errors.push(errorMessages.FIELDVALUE_MISSING_ERR);
  }
  if (!from || from < 0 || from >= limit) {
    errors.push(errorMessages.OFFSET_MISSING_ERR);
  }
  if (!limit) {
    errors.push(errorMessages.LIMIT_MISSING_ERR);
  }
  if (errors.length > 0) throw new Error(errors.join('. '));
};

module.exports = {search};
