'use strict';

const errorMessages = {
  BUSINESS_NUMBER_MISSING_ERR:
    'businessNumber is not passed or blank or undefined',
};

const queries = {
  findByBusinessNumber: (businessNumber) => {
    return {
      text: `SELECT search.business_number, search.name,
      search.restricted_flag, search.service_name, 
      search.tagline, search.email FROM 
          FROM company_master as search 
          WHERE search.business_number = $1`,
      values: [businessNumber],
    };
  },
};

const searchByBusinessNumber = async (pool, searchParams) => {
  const client = await pool.connect();
  try {
    validate(searchParams);
    const queryResponse = await client.query(
        queries.findByBusinessNumber(searchParams.businessNumber),
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
  const {businessNumber} = searchParams;
  if (!businessNumber) {
    errors.push(errorMessages.BUSINESS_NUMBER_MISSING_ERR);
  }
  if (errors.length > 0) throw new Error(errors.join('. '));
};

module.exports = {
  searchByBusinessNumber,
  errorMessages,
};
