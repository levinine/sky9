const uuid = require('uuid');
const { dynamoDB } = require('../infrastructure/dynamoDbLib');
const Ajv = require('ajv');
const ajv = new Ajv();

const accountSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    status: { type: 'string' }
  },
  required: ['name', 'email', 'status'],
  additionalProperties: true
}

const validate = ajv.compile(accountSchema);


const getAccounts = () => {
  const params = {
    TableName: process.env.ACCOUNT_TABLE
  }
  return dynamoDB.scan(params).promise();
};

const getAccount = id => {
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Key: {
      'id': id
    }
  }
  return dynamoDB.get(params).promise();
};

const createAccount = async data => {
  if (!validate(data)) return validate.errors;
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Item: {
      id: uuid.v1(),
      name: data.name,
      email: data.email,
      status: data.status
    }
  }
  await dynamoDB.put(params).promise();
  return params.Item;
};

const updateAccount = async accountData => {
  if (!validate(accountData)) return validate.errors;
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Key: {
      'id': accountData.id
    },
    UpdateExpression: 'SET #name = :name, email = :email, #status= :status',
    ExpressionAttributeNames: { '#name': 'name', '#status': 'status' },
    ExpressionAttributeValues: {
      ':name': accountData.name,
      ':email': accountData.email,
      ':status': accountData.status
    },
    ReturnValues: 'ALL_NEW'
  }
  return await dynamoDB.update(params).promise();
}

const deleteAccount = id => {
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Key: {
      'id': id
    },
    ReturnValues: 'ALL_OLD'
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
