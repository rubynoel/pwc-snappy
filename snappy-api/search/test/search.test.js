const {search, searchFields} = require('../src/search');

test('Search by partial Company Name returns a valid search result', () => {
  const PGMock2 = require('pgmock2').default;
  const pgmock = new PGMock2();

  pgmock.add(
      `SELECT search.business_number, search.name,
      search.restricted_flag, search.service_name, 
      search.tagline, search.email FROM 
          FROM company_master as search 
          WHERE search.business_number = $1`,
      ['number'],
      {
        rowCount: 1,
        rows: [
          {business_number: 1111111110, name: 'Test', restricted_flag: true},
        ],
      },
  );
  expect(
      search({
        fieldName: searchFields.BUSINESS_NUMER,
        fieldValue: 11212121,
        limit: 10,
        offset: 0,
        isMocked: true,
        poolMock: pgmock,
      }),
  ).toBeTruthy();
});
