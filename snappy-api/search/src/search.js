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
  let response = {};
  switch (fieldName) {
    case searchFields.COMPANY_NAME:
      response = await searchByCompanyName(pgPool, {
        keyword: fieldValue,
        offset: offset,
        limit: pageLimit,
      });
      break;
    case searchFields.BUSINESS_NUMER:
      response = await searchByBusinessNumber(pgPool, {
        businessNumber: fieldValue,
      });
      break;
    case searchFields.RESTRICTED_STATUS:
      response = await searchByRestrictedStatus(pgPool, {
        restrictedFlag: fieldValue,
        offset: offset,
        limit: pageLimit,
      });
      break;
    default:
      break;
  }
  console.log(`query response is ${response}`);
  let searchResults = {};
  if (
    response &&
    response.queryResponse &&
    response.queryResponse.rows &&
    response.queryResponse.rows.length > 0
  ) {
    const rows = response.queryResponse.rows.map((record) => {
      return {
        businessNumber: record.business_number,
        name: record.name,
        restrictedFlag: record.restricted_flag,
        service: record.service_name,
        tagline: record.tagline,
        email: record.email,
      };
    });
    searchResults = {
      rows: rows,
      total:
        response.countQueryResponse &&
        response.countQueryResponse.rows &&
        response.countQueryResponse.rows.length > 0 ?
          response.countQueryResponse.rows[0].count :
          response.queryResponse.rows.length,
    };
  } else {
    searchResults = {
      rows: [],
      total: 0,
    };
  }

  return searchResults;
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
