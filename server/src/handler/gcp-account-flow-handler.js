'use strict';
const accountService = require('../service/account-service');
const activeDirectoryService = require('../service/active-directory-service');
const { getGcpAuthClient, getGcpAccountKeys } = require('../service/gcp-auth-client-service');
const { clouds } = require('../utils');

function NotReady(message) {
  this.name = 'NOT_READY';
  this.message = message || 'Not yet';
}
NotReady.prototype = new Error();

// Create account for dynamo for gcp
const createAccount = async (account) => {
    console.log(account);
    try {
      const tableName = process.env.ACCOUNT_GCP_TABLE;
      account = await accountService.createAccount(account, clouds.AWS);
      account = await accountService.addAccountHistoryRecord(account.id, 'DynamoDB created', { account }, tableName);
      account.tableName = tableName;
      return account;
    } catch (error) {
      console.log('Account creation step failed', error);
      throw error;
    }
  };

const createAdGroup = async (account) => {
  console.log('Create AD group step', account);
  const result = await activeDirectoryService.execAdRunbook(account.adName, account.owner); // name 
  account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation requested', {}, account.tableName);
  console.log('Create AD group step finished', result);
  return account;
}

const validateAdGroup = async (account) => {
  let group;
  try {
    group = await activeDirectoryService.findGroupByName(account.name);
  } catch (error) {
    console.log('AD Group validation failed', error);
  }
  if (!group) {
    throw new NotReady();
  } else {
    account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation verified', {}, account.tableName);
    return account;
  }
}

const createGcpAccount = async (account) => {
  console.log(`Creating GCP account ${JSON.stringify(account)}`);
  // FOR HTTP Trigger uncomment next 3 lines
  // const httpTemp = JSON.parse(account.body);
  // const account = httpTemp;

  try {
    const gcpClient = await getGcpAuthClient();
    const url = 'https://cloudresourcemanager.googleapis.com/v3/projects';
    const body = {
      "projectId": account.name,
      "displayName": account.name,
      "parent": `folders/${process.env.GCP_PARENT_FOLDER_VALUE}`
    }
    const createdAccount = await gcpClient.request({ method: 'POST', url: url, data: body });
    // response from gcp -> { "name": "operations/cp.6791935560210989313" }
    account.gcpCreationResponse = createdAccount;
    account = await accountService.addAccountHistoryRecord(account.id, 'GCP account creation requested', { account }, account.tableName);
    console.log(`Finished creating GCP account`, createdAccount);
    return account;
  } catch (error) {
    console.log('GCP account creation step failed', error);
    throw error;
  }
}

const assignAdGroupAsProjectOwner = async (account) => {
  console.log(`Assign ad group as ${JSON.stringify(account1)}`);
  // FOR HTTP Trigger uncomment next 2 lines
  // const httpTemp = JSON.parse(account.body);
  // const account = httpTemp;

  try {
    const gcpClient = await getGcpAuthClient();
    const getPolicyUrl = `https://cloudresourcemanager.googleapis.com/v3/projects/${account.name}:getIamPolicy`;
    const previousPolicyResponse = await gcpClient.request({ method: 'POST', url: getPolicyUrl });
    let previousPolicy = previousPolicyResponse.data;
    previousPolicy.bindings[0].members.push(`group:${account.email}`);

    const setPolicyUrl = `https://cloudresourcemanager.googleapis.com/v3/projects/${account.name}:setIamPolicy`;
    const updatedPolicy = {
      policy: previousPolicy,
      updateMask: "bindings"
    }
    await gcpClient.request({ method: 'POST', url: setPolicyUrl, data: updatedPolicy });
    account = await accountService.addAccountHistoryRecord(account.id, 'AD Group assigned as a project owner', { account }, account.tableName);
    console.log(`Finished assigning ad group as a project owner`);
    return account;
  } catch (error) {
    console.log('Assigning ad group as a project owner failed', error);
    throw error;
  }
}

const setBillingAccount = async (account) => {
  // console.log(`Creating GCP account ${JSON.stringify(account)}`);
  // const provisionAccount = await awsServiceCatalogService.provisionAccount(account);
  account = await accountService.addAccountHistoryRecord(account.id, 'GCP set billing account', { provisionAccount }, account.tableName);
  console.log(`Finished setting billing account`);
  return account;
}

const createNotificationChannel = async (account) => {
  // console.log(`Creating GCP account ${JSON.stringify(account)}`);
  // const provisionAccount = await awsServiceCatalogService.provisionAccount(account);
  account = await accountService.addAccountHistoryRecord(account.id, 'GCP create notification channel', { provisionAccount }, account.tableName);
  console.log(`Finished creation of notification channel`);
  return account;
}


const setBudget = async (account) => {
  // console.log(`Creating GCP account ${JSON.stringify(account)}`);
  // const provisionAccount = await awsServiceCatalogService.provisionAccount(account);
  account = await accountService.addAccountHistoryRecord(account.id, 'GCP set budget', { provisionAccount }, account.tableName);
  console.log(`Finished setting budget`);
  return account;
}

module.exports = {
  createAccount,
  createAdGroup,
  validateAdGroup,
  createGcpAccount,
  assignAdGroupAsProjectOwner,
  setBillingAccount,
  createNotificationChannel,
  setBudget
};
