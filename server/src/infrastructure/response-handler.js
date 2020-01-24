const responseHandler = (responseData) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(responseData)
  }
};

module.exports = responseHandler;
