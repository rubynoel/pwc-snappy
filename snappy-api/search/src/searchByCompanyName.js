'use strict';

const searchByCompanyName = async (pool, searchParams) => {
  const client = await pool.connect();
  try {
    console.log(`Connected to db ${client}`);
    // const queryResponse = await client.query(queries.createTmpTableQuery());
    // console.log(`Search Query Response ${JSON.stringify(queryResponse)}`);
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  searchByCompanyName,
};
