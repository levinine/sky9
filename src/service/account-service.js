const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDB =
new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT
});

const getAccounts = () => {
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
  }
  return dynamoDB.scan(params).promise();
};

const getAccount = id => {
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Key: {
      "id": id
    }
  }
  return dynamoDB.get(params).promise();
};

const createAccount = async data => {
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Item:{
      id: uuid.v1(),
      name: data.name,
      email: data.email,
      status: data.status,
      IAMUsers: data.IAMUsers
    }
  }
  await dynamoDB.put(params).promise();
  return params.Item;
};

const updateAccount = async accountData => {
  console.log(accountData);
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Key:{
      "id": accountData.id
    },
    UpdateExpression:"SET #name = :name, email = :email, #status= :status, IAMUsers = :IAMUsers",
    ExpressionAttributeNames: {"#name":"name", "#status":"status"},
    ExpressionAttributeValues: {
      ":name": accountData.name,
      ":email": accountData.email,
      ":status": accountData.status,
      ":IAMUsers": accountData.IAMUsers
    },
    ReturnValues: "UPDATED_NEW"
  }
  const updatedAccount = dynamoDB.update(params).promise();
  return updatedAccount;
}

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount
};