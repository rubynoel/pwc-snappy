'use strict';

const {search} = require('./search');

exports.handler = async (event, context) => {
  console.log('request: ' + JSON.stringify(event));

  const {fieldName, fieldValue} = event.pathParameters ?
    event.pathParameters :
    {};
  const {from, limit} = event.queryStringParameters ?
    event.queryStringParameters :
    {};

  const apiResponse = {};
  try {
    const searchResponse = await search({
      fieldName,
      fieldValue,
      limit,
      offset: from,
    });

    if (searchResponse) {
      apiResponse = {
        statusCode: 200,
        body: JSON.stringify(searchResponse),
      };
    } else {
      throw new Error(`Could not obtain search response`);
    }
  } catch (err) {
    apiResponse = {
      statusCode: 500,
      body: JSON.stringify('Internal Error'),
    };
  }

  console.log('apiResponse: ' + JSON.stringify(apiResponse));
  return apiResponse;
};
