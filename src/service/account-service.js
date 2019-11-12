const uuid = require('uuid');
const AWS = require('aws-sdk');
const Ajv = require('ajv');
const ajv = new Ajv();


const accountSchema = {
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string", "format": "date" },
    "status": { "type": "string" },
    "IAMUsers": {
      "type": "array",
      "items": [{
         "type": "string", 
         "format": "date" 
      }]
    }
  }
}

const validator = ajv.addSchema(accountSchema);

const dynamoDB =
new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
  endpoint: process.env.DB_ENDPOINT
})

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
  const valid = validator.validate(data);
  console.log(valid);
  if(!valid) return valid;
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

const updateAccount = accountData => {
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

const deleteAccount = id => {
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Key: {
      "id": id
    }
  }
  return dynamoDB.delete(params).promise();
};

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount
};