const { dynamoDB } = require('../infrastructure/dynamoDbLib');
const Ajv = require('ajv');
const ajv = new Ajv();

const accountSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    owner: { type: 'string' },
    budget: { type: 'string' }
  },
  required: ['id', 'name'],
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
  if (!validate(data)) {
    console.log(`Can't store account ${JSON.stringify(data)}, validation failed: ${JSON.stringify(validate.errors)}`);
    return validate.errors;
  } else {
    const params = {
      TableName: process.env.ACCOUNT_TABLE,
      Item: {
        id: data.id,
        name: data.name,
        email: data.email,
        owner: data.owner,
        budget: data.budget
      }
    }
    await dynamoDB.put(params).promise();
    return params.Item;
  }
};

const updateAccount = async accountData => {
  if (!validate(accountData)) return validate.errors;
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Key: {
      'id': accountData.id
    },
    UpdateExpression: 'SET #name = :name, #email = :email, #owner = :owner, #budget = :budget',
    ExpressionAttributeNames: { '#name': 'name', '#email': 'email', '#owner': 'owner', '#budget': 'budget' },
    ExpressionAttributeValues: {
      ':name': accountData.name,
      ':email': accountData.email,
      ':owner': accountData.owner,
      ':budget': accountData.budget || null
    },
    ReturnValues: 'ALL_NEW'
  }
  return await dynamoDB.update(params).promise();
}

const deleteAccount = id => {
  const params = {
    TableName: process.env.ACCOUNT_TABLE,
    Key: { 'id': id },
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
