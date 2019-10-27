'use strict';

const {getPool} = require('./dbUtil');
const {searchByCompanyName} = require('./searchByCompanyName');
const {searchByBusinessNumber} = require('./searchByBusinessNumber');
const {searchByRestrictedStatus} = require('./searchByRestrictedStatus');

const searchFields = {
  COMPANY_NAME: 'companyName',
  BUSINESS_NUMER: 'businessNumber',
  RESTRICTED_STATUS: 'restrictedStatus',
};

const paginationDefaults = {offset: 0, limit: 100};

const search = async (params) => {
  validate(params);
  const {fieldName, fieldValue, from, limit, isMocked, poolMock} = params;
  const pgPool = isMocked ? poolMock : await getPool();
  const defaultLimit = paginationDefaults.limit;
  const defaultOffset = paginationDefaults.offset;
  const pageLimit =
    !isNaN(limit) && limit > 0 && limit <= defaultLimit ? limit : defaultLimit;
  const offset = !isNaN(from) ? from : defaultOffset;
  let searchResults = {};
  switch (fieldName) {
    case searchFields.COMPANY_NAME:
      searchResults = await searchByCompanyName(pgPool, {
        keyword: fieldValue,
        offset: offset,
        limit: pageLimit,
      });
      break;
    case searchFields.BUSINESS_NUMER:
      searchResults = await searchByBusinessNumber(pgPool, {
        businessNumber: fieldValue,
      });
      break;
    case searchFields.RESTRICTED_STATUS:
      searchResults = await searchByRestrictedStatus(pgPool, {
        restrictedFlag: fieldValue,
        offset: offset,
        limit: pageLimit,
      });
      break;
    default:
      break;
  }
  console.log(`${searchResults}`);
  let response = {};
  if (
    searchResults &&
    searchResults.queryResponse &&
    searchResults.queryResponse.rows &&
    searchResults.queryResponse.rows.length > 0
  ) {
    const rows = searchResults.rows.map((record) => {
      return {
        businessNumber: record.business_number,
        name: record.name,
        restrictedFlag: record.restricted_flag,
        service: record.service_name,
        tagline: record.tagline,
        email: record.email,
      };
    });
    response = {
      rows: rows,
      total: searchResults.countQueryResponse.rows[0].count,
    };
  } else {
    response = {
      rows: [],
      total: 0,
    };
  }

  return response;
};

const errorMessages = {
  FIELDNAME_MISSING_ERR: 'fieldName is not passed or blank or undefined',
  FIELDVALUE_MISSING_ERR: 'fieldValue is not passed or blank or undefined',
  OFFSET_MISSING_ERR: 'Offset value must be a number between 0 and limit-1',
  LIMIT_MISSING_ERR: 'Limit value must be a non zero positive number',
};

const validate = (searchParams) => {
  const errors = [];
  const {fieldName, fieldValue} = searchParams;
  if (!fieldName) {
    errors.push(errorMessages.FIELDNAME_MISSING_ERR);
  }
  if (!fieldValue) {
    errors.push(errorMessages.FIELDVALUE_MISSING_ERR);
  }

  if (errors.length > 0) throw new Error(errors.join('. '));
};

module.exports = {search, errorMessages, searchFields};
