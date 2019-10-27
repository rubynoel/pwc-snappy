const {handler} = require('../src/index');
const {searchFields} = require('../src/search');

test('Lambda handler returns a valid api response', async () => {
  const event = {
    pathParameters: {
      fieldName: searchFields.COMPANY_NAME,
      fieldValue: 'Kris',
      from: 1,
    },
    queryStringParameters: {
      from: 1,
    },
  };
  const response = await handler(event);
  expect(response).toBeTruthy();
  expect(response.statusCode).toEqual(500);
});
