'use strict';

const errors = {
  KEYWORD_MISSING_ERR: 'Company Name is not passed or blank or undefined',
};
const searchByCompanyName = async (pool, searchParams) => {
  const client = await pool.connect();
  try {
    console.log(`Connected to db ${client}`);
    if (!searchParams.keyword) {
      throw new Error(errors.KEYWORD_MISSING_ERR);
    }
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  searchByCompanyName,
};
