const errorHandler = (error) => {
  return {
    statusCode: error.statusCode,
    body: JSON.stringify(error)
  }
};

module.exports = errorHandler;
