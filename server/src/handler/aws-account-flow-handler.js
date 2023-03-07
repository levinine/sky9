'use strict';
const accountService = require('../service/account-service');
const awsBudgetService = require('../service/aws-budget-service');
const awsServiceCatalogService = require('../service/aws-service-catalog-service');
const awsOrganizationService = require('../service/aws-organization-service');
const activeDirectoryService = require('../service/active-directory-service');
const { clouds } = require('../utils');

function NotReady(message) {
  this.name = 'NOT_READY';
  this.message = message || 'Not yet';
}
NotReady.prototype = new Error();

// Create account for dynamo for aws
const createAccount = async (account) => {
  console.log(account);
  try {
    const tableName = process.env.ACCOUNT_TABLE;
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
  const result = await activeDirectoryService.execAdRunbook(account.adGroupName, account.owner, clouds.AWS);
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

const createAwsAccount = async (account) => {
  console.log(`Creating AWS account ${JSON.stringify(account)}`);
  const provisionAccount = await awsServiceCatalogService.provisionAccount(account);
  account = await accountService.addAccountHistoryRecord(account.id, 'AWS account creation requested', { provisionAccount }, account.tableName);
  console.log(`Finished creating AWS account`);
  return account;
}

const falseErrors = [
  'AWS Control Tower is not authorized to baseline the VPC in the managed account.'
];
const emailAlreadyExistsError = 'AWS account with that email already exists';
const validateAwsAccount = async (account) => {
  console.log(`Validate creation of AWS account ${JSON.stringify(account)}`);
  const provisionedAccounts = await awsServiceCatalogService.listProvisionedAccounts();
  const provisionedAccount = provisionedAccounts.find(provisionedAccount => provisionedAccount.Name === account.name);
  console.log(`Found AWS account:`, provisionedAccount);

  if (provisionedAccount && provisionedAccount.Status === 'ERROR' && provisionedAccount.StatusMessage.includes(emailAlreadyExistsError)) {
    throw new Error(provisionedAccount.StatusMessage);
  }

  if (!provisionedAccount || !(provisionedAccount.Status === 'AVAILABLE' || (provisionedAccount.Status === 'ERROR' && falseErrors.includes(provisionedAccount.StatusMessage)))) {
    throw new NotReady();
  }

  const organizationAccount = await awsOrganizationService.getAccountByName(account.name);
  account = await accountService.updateAccount({ id: account.id, awsAccountId: organizationAccount.Id }, account.tableName);
  account = await accountService.addAccountHistoryRecord(account.id, 'AWS account creation validated', { provisionedAccount, organizationAccount, account }, account.tableName);
  return account;
}

const createBudget = async (account) => {
  const budget = await awsBudgetService.createBudget(account.awsAccountId, account.name, account.owner, account.budget);
  account = await accountService.addAccountHistoryRecord(account.id, 'AWS budget created', { budget }, account.tableName);
  return account;
}

const validateSsoGroup = async (account) => {
  console.log('Validate AD group propagated to SSO', account);
  return account;
}

const assignSsoGroup = async (account) => {
  console.log('Assign SSO group to AWS account', account);
  return account;
}

module.exports = {
  createAccount,
  createAdGroup,
  validateAdGroup,
  createAwsAccount,
  validateAwsAccount,
  createBudget,
  validateSsoGroup,
  assignSsoGroup
};
