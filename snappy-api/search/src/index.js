'use strict';

const {search} = require('./search');

exports.handler = async (event, context) => {
  console.log('request: ' + JSON.stringify(event));

  let apiResponse = {};
  try {
    const searchResponse = await search({
      pageSize: 5,
      from: 0,
    });

    if (searchResponse) {
      const searchResult = {
        total: searchResponse.total,
        rows: searchResponse.rows,
      };
      apiResponse = {
        statusCode: 200,
        headers: {
          'x-custom-header': 'my custom header value',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(searchResult),
      };
    } else {
      throw new Error(`Could not obtain search response`);
    }
  } catch (err) {
    apiResponse = {
      statusCode: '500',
      headers: {
        'x-custom-header': 'my custom header value',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(err),
    };
  }

  console.log('apiResponse: ' + JSON.stringify(apiResponse));
  return apiResponse;
};
