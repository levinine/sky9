const AWS = require('aws-sdk');
const { omit } = require('lodash');
const { clouds, creationStatuses } = require('../utils');

// COMMON Service for DynamoDB handling

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMO_DB_REGION,
  endpoint: process.env.DYNAMO_DB_ENDPOINT
});

const getAccounts = async (tableName) => {
  const params = {
    TableName: tableName
  }
  const accounts = await dynamoDB.scan(params).promise();
  return accounts.Items;
};

const getAccount = async (id, tableName) => {
  const params = {
    TableName: tableName,
    Key: {
      'id': id
    }
  }
  const account = await dynamoDB.get(params).promise();
  return account.Item;
};

const getTheLatestAccount = async (tableName) => {
  let accounts = await getAccounts(tableName);
  accounts = accounts.map(account => { return { id: account.id, createdTime: new Date(account.createdTime) }} );
  accounts = accounts.sort((a, b) => b.createdTime - a.createdTime);
  return accounts[0];
}

const createAccount = async (account, cloud) => {

  if (!account.name || !account.owner || !account.ownerFirstName || !account.ownerLastName) {
    console.log(`Can't store account ${JSON.stringify(account)}, missing one of mandatory attributes`);
    throw new Error('Missing one or more of: name, owner, ownerFirstName, ownerLastName');
  }
  if (cloud === clouds.AWS) {
    account.name = account.name.startsWith(process.env.ORGANIZATION) ? account.name : `${process.env.ORGANIZATION}-${account.name}`;
    account.adGroupName = account.name;
  }
  if (cloud === clouds.GCP) {
    // do not use 'name' property, because GCP allows less characters for project name
    account.adGroupName = account.name.startsWith(process.env.GCP_ORGANIZATION) ? account.name : `${process.env.GCP_ORGANIZATION}-${account.name}`
  }

  account.id = `${new Date().getTime()}`;
  account.email = `${account.name}@${process.env.ORGANIZATION_DOMAIN}`;
  account.createdTime = `${new Date()}`;
  account.status = creationStatuses.INPROGRESS;
  const params = {
    TableName: cloud === clouds.AWS ? process.env.ACCOUNT_TABLE : process.env.ACCOUNT_GCP_TABLE,
    Item: account
  }
  await dynamoDB.put(params).promise();
  return account;
};

const accountAttributes = ['name', 'email', 'owner', 'ownerFirstName', 'ownerLastName', 'budget', 'actualSpend', 'forecastedSpend', 'history', 'awsAccountId', 'gcpProjectId', 'adGroupName', 'createdTime', 'createdBy', 'members', 'status'];
const updateAccount = async (account, tableName) => {
  if (!account.id) {
    throw new Error('Missing account.id');
  }
  const updateAttributes = accountAttributes.filter(a => account[a] !== undefined);
  const params = {
    TableName: tableName,
    Key: { 'id': account.id },
    UpdateExpression: 'SET ' + updateAttributes.map(a => `#${a} = :${a}`).join(', '),
    ExpressionAttributeNames: updateAttributes.reduce((o, a) => { o['#' + a] = a; return o; }, {}),
    ExpressionAttributeValues: updateAttributes.reduce((o, a) => { o[':' + a] = account[a]; return o; }, {}),
    ReturnValues: 'ALL_NEW'
  };
  // console.log('Executing update: ', params);
  const updatedAccount = await dynamoDB.update(params).promise();
  console.log('Updated account in DynamoDB: ', updatedAccount);
  return updatedAccount.Attributes;
}

const addAccountHistoryRecord = async (accountId, type, record, tableName) => {
  if (!accountId) {
    console.log(`addAccountHistoryRecord called without accountId for type ${type} and record ${JSON.stringify(record)}`);
    return;
  }
  if (record.account) {
    record = omit(record, 'account.history');
  }
  const updateResponse = await dynamoDB.update({
    TableName: tableName,
    Key: { id: accountId },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'set #history = list_append(if_not_exists(#history, :empty_list), :record)',
    ExpressionAttributeNames: {
      '#history': 'history'
    },
    ExpressionAttributeValues: {
      ':record': [{ timestamp: new Date().getTime(), type, record }],
      ':empty_list': []
    }
  }).promise();
  return updateResponse.Attributes;
}

const deleteAccount = (id, tableName) => {
  const params = {
    TableName: tableName,
    Key: { 'id': id },
    ReturnValues: 'ALL_OLD'
  }
  return dynamoDB.delete(params).promise();
};

module.exports = {
  getAccounts,
  getAccount,
  getTheLatestAccount,
  createAccount,
  updateAccount,
  addAccountHistoryRecord,
  deleteAccount
};
