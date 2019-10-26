const {handler} = require('../src/index');

test('Lambda handler returns a valid api response', async () => {
  const response = await handler();
  expect(response).toBeTruthy();
  expect(response.statusCode).toEqual(200);
});
