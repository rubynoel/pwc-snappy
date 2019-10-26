'use strict';

const errorMessages = {
  KEYWORD_MISSING_ERR: 'Company Name is not passed or blank or undefined',
  OFFSET_MISSING_ERR: 'Offset value must be a number between 0 and limit-1',
  LIMIT_MISSING_ERR: 'Limit value must be a non zero positive number',
};

const queries = {
  findByCompanyName: (keyword) => {
    return {
      text: `SELECT mas.business_number, mas.name,
        mas.restricted_flag, mas.service_name, 
        mas.tagline, mas.email, FROM (
          SELECT mas.business_number, mas.name,
          mas.restricted_flag, mas.service_name, 
          mas.tagline, mas.email, 
          to_tsvector(mas.name) as document 
          FROM company_master mas) as search 
          WHERE search.document @@ to_tsquery($1)
          ORDER BY ts_rank(search.document, to_tsquery('english', $1)) DESC
          offset $2 limit $3`,
      values: [keyword],
    };
  },
};

const searchByCompanyName = async (pool, searchParams) => {
  const client = await pool.connect();
  try {
    console.log(`Connected to db ${client}`);
    validate(searchParams);
    const queryResponse = await client.query(
        queries.findByCompanyName(searchParams.keyword),
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
  const {keyword, offset, limit} = searchParams;
  if (!keyword) {
    errors.push(errorMessages.KEYWORD_MISSING_ERR);
  }
  if (!offset || offset < 0 || offset >= limit) {
    errors.push(errorMessages.OFFSET_MISSING_ERR);
  }
  if (!limit) {
    errors.push(errorMessages.LIMIT_MISSING_ERR);
  }
  if (errors.length > 0) throw new Error(errors.join('. '));
};

module.exports = {
  searchByCompanyName,
};
