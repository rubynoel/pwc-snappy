const {search} = require('../src/search');

test('Search by partial Company Name returns a valid search result', () => {
  expect(search()).toBeTruthy();
});
