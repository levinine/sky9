const AWS = require('aws-sdk');

module.exports.dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMO_DB_REGION,
  endpoint: process.env.DYNAMO_DB_ENDPOINT
});
