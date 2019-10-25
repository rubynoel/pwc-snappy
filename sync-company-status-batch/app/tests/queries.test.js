const queries = require('../src/queries');

test('All queries are valid', () => {
  expect(queries.createTmpTableQuery()).toBeTruthy();
  expect(queries.importFromS3ToTmpTableQuery()).toBeNull();
  expect(
      queries.importFromS3ToTmpTableQuery('testbucket', 'file', 'region')
  ).toBeTruthy();
  expect(queries.insertMasterTableQuery()).toBeTruthy();
  expect(queries.updateMasterTableQuery()).toBeTruthy();
});
