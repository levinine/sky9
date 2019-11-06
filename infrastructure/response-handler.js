const responseHandler = (responseData) => {
    return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: responseData
    }
};

module.exports = responseHandler;