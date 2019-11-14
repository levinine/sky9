const AWS = require('aws-sdk');

module.exports.dynamoDB = 
new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
  endpoint: process.env.DB_ENDPOINT
})