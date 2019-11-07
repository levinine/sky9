const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDB = 
new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT
})

const getAccounts = () => {
  try {
    const params = {
      TableName: process.env.AccountTableName, 
    }    
    return dynamoDB.scan(params).promise();
  } catch(error){ 
    console.log(error.message);
    throw error;
  }  
};

const getAccount = id => {
  try {
    const params = {
      TableName: process.env.AccountTableName,
      Key: {
        "id": id
      }
    }
    return dynamoDB.getItem(params).promise();
  } catch(error) {
    console.log(error.message);
    throw error;
  }
};

const createAccount = async data => {
  try { 
    const params = {
      TableName: process.env.AccountTableName,
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
  } catch(error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = {
  getAccounts,
  getAccount,
  createAccount
};
  