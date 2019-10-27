'use strict';

const restrictedStatus = {
  RESTRICTED: 'true',
  NOT_RESTRICTED: 'false',
};

const errorMessages = {
  RESTRICTED_STATUS_MISSING_ERR: `restrictedStatus must be either 
  '${restrictedStatus.RESTRICTED}' 
  or '${restrictedStatus.NOT_RESTRICTED}'`,
};

const queries = {
  findByRestrictedStatus: (restricted, offset, limit) => {
    return {
      text: `SELECT search.business_number, search.name,
      search.restricted_flag, search.service_name, 
      search.tagline, search.email  
      FROM company_master as search 
      WHERE search.restricted_flag is $1
      ORDER BY search.updated_on DESC
      offset $2 limit $3`,
      values: [restricted, offset, limit],
    };
  },
  countFindByRestrictedStatus: (restricted) => {
    return {
      text: `SELECT count(search.business_number)  
      FROM company_master as search 
      WHERE search.restricted_flag is $1`,
      values: [restricted],
    };
  },
};

const searchByRestrictedStatus = async (pool, searchParams) => {
  const client = await pool.connect();
  try {
    validate(searchParams);
    const {restrictedFlag, offset, limit} = searchParams;
    const restrictedFlagQueryParam =
      restrictedFlag === restrictedStatus.RESTRICTED ? true : false;
    const queryResponse = await client.query(
        queries.findByRestrictedStatus(restrictedFlagQueryParam, offset, limit),
    );
    console.log(`Search response is ${JSON.stringify(queryResponse)}`);
    const countQueryResponse = await client.query(
        queries.countFindByRestrictedStatus(restrictedFlagQueryParam),
    );
    console.log(`Search response is ${JSON.stringify(countQueryResponse)}`);
    return {
      queryResponse: queryResponse,
      countQueryResponse: countQueryResponse,
    };
  } catch (e) {
    console.error(e.stack);
    throw e;
  } finally {
    client.release();
  }
};

// Validations specific to company name search
const validate = (searchParams) => {
  const errors = [];
  const {restrictedFlag} = searchParams;
  if (
    restrictedFlag !== restrictedStatus.RESTRICTED &&
    restrictedFlag !== restrictedStatus.NOT_RESTRICTED
  ) {
    errors.push(errorMessages.RESTRICTED_STATUS_MISSING_ERR);
  }
  if (errors.length > 0) throw new Error(errors.join('. '));
};

module.exports = {
  searchByRestrictedStatus,
  errorMessages,
  restrictedStatus,
};
