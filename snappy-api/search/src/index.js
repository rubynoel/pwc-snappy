'use strict';

const {search} = require('./search');

module.exports.handler = async (event, context) => {
  let apiResponse = {};
  try {
    console.log('request: ' + JSON.stringify(event));

    const {fieldName, fieldValue} = event.pathParameters ?
      event.pathParameters :
      {};
    const {from, limit} = event.queryStringParameters ?
      event.queryStringParameters :
      {};

    const searchResponse = await search({
      fieldName,
      fieldValue,
      limit,
      offset: from,
    });

    if (searchResponse) {
      apiResponse = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(searchResponse),
      };
    } else {
      throw new Error(`Could not obtain search response`);
    }
  } catch (err) {
    apiResponse = {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify('Internal Error'),
    };
  }

  console.log('apiResponse: ' + JSON.stringify(apiResponse));
  return apiResponse;
};
