const errorResponse = (error) => {
  return {
    statusCode: error.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(error)
  }
};

const okResponse = (responseData) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(responseData)
  }
};

module.exports = {
  errorResponse,
  okResponse
}
