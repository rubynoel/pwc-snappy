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
  findByRestrictedStatus: (restricted) => {
    return {
      text: `SELECT search.business_number, search.name,
      search.restricted_flag, search.service_name, 
      search.tagline, search.email FROM 
      FROM company_master as search 
      WHERE search.business_number is $1`,
      values: [restricted],
    };
  },
};

const searchByRestrictedStatus = async (pool, searchParams) => {
  const client = await pool.connect();
  try {
    validate(searchParams);
    const queryResponse = await client.query(
        queries.findByRestrictedStatus(
        searchParams.restrictedFlag === restrictedStatus.RESTRICTED ?
          true :
          false,
        ),
    );
    console.log(`Search response is ${JSON.stringify(queryResponse)}`);
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
