const jobProcessor = require('../sync-company-status');

test('Able to sync csv data from S3 to company database', async () => {
  const PGMock2 = require('pgmock2').default;
  const pgmock = new PGMock2();

  try {
    await jobProcessor.syncCompanyStatus(true, pgmock);
  } catch (e) {
    return {
      message: () => `Error in load`,
      pass: false,
    };
  }

  // TODO: change this to a useful test
  pgmock.add(
      'SELECT * FROM company_master WHERE business_number = $1',
      ['number'],
      {
        rowCount: 1,
        rows: [
          {business_number: 1111111110, name: 'Test', restricted_flag: true},
        ],
      }
  );
  const conn = await pgmock.connect();
  try {
    const data = await conn.query(
        'SELECT * FROM company_master WHERE business_number = $1',
        [1111111110]
    );
    console.log(data);
  } catch (e) {
    return {
      message: () => `Error in query`,
      pass: false,
    };
  }
});
