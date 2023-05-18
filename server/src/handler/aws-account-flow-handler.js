'use strict';
const accountService = require('../service/account-service');
const awsBudgetService = require('../service/aws-budget-service');
const awsServiceCatalogService = require('../service/aws-service-catalog-service');
const awsOrganizationService = require('../service/aws-organization-service');
const activeDirectoryService = require('../service/active-directory-service');
const { clouds, creationStatuses } = require('../utils');

function NotReady(message) {
  this.name = 'NOT_READY';
  this.message = message || 'Not yet';
}
NotReady.prototype = new Error();

function CreationFailed(message, id) {
  this.name = 'CREATION_FAILED';
  this.message = message || 'Creation failed';
  this.stack = JSON.stringify({ account: { id: id }});
}
CreationFailed.prototype = new Error();

const tableName = process.env.ACCOUNT_TABLE;

// Create account for dynamo for aws
const createAccount = async (account) => {
  try {
    account.tableName = tableName;
    account = await accountService.createAccount(account, clouds.AWS);
    account = await accountService.addAccountHistoryRecord(account.id, 'DynamoDB created', { account }, tableName);
    return account;
  } catch (error) {
    console.log('Account creation step failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
};

const createAdGroup = async (account) => {
  try {
    console.log('Create AD group step', account);
    const result = await activeDirectoryService.execAdRunbook(account.adGroupName, account.owner, clouds.AWS);
    account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation requested', {}, account.tableName);
    console.log('Create AD group step finished', result);
    return account;
  } catch (error) {
    console.log('Create AD group step failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const validateAdGroup = async (account) => {
  let group;
  try {
    group = await activeDirectoryService.findGroupByName(account.adGroupName);
  } catch (error) {
    console.log('AD Group validation failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
  if (!group) {
    throw new NotReady();
  } else {
    account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation verified', {}, account.tableName);
    return account;
  }
}

const createAwsAccount = async (account) => {
  try {
    console.log(`Creating AWS account ${JSON.stringify(account)}`);
    const provisionAccount = await awsServiceCatalogService.provisionAccount(account);
    account = await accountService.addAccountHistoryRecord(account.id, 'AWS account creation requested', { provisionAccount }, account.tableName);
    console.log(`Finished creating AWS account`);
    return account;
  } catch (error) {
    console.log('Create AWS account step failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const falseErrors = [
  'AWS Control Tower is not authorized to baseline the VPC in the managed account.'
];
const emailAlreadyExistsError = 'AWS account with that email already exists';
const validateAwsAccount = async (account) => {
  try {
    console.log(`Validate creation of AWS account ${JSON.stringify(account)}`);
    const provisionedAccounts = await awsServiceCatalogService.listProvisionedAccounts();
    const provisionedAccount = provisionedAccounts.find(provisionedAccount => provisionedAccount.Name === account.name);
    console.log(`Found AWS account:`, provisionedAccount);
  
    if (provisionedAccount && provisionedAccount.Status === 'ERROR' && provisionedAccount.StatusMessage.includes(emailAlreadyExistsError)) {
      throw new CreationFailed(provisionedAccount.StatusMessage, account.id);
  
    }
  
    if (!provisionedAccount || !(provisionedAccount.Status === 'AVAILABLE' || (provisionedAccount.Status === 'ERROR' && falseErrors.includes(provisionedAccount.StatusMessage)))) {
      throw new NotReady();
    }
  
    const organizationAccount = await awsOrganizationService.getAccountByName(account.name);
    account = await accountService.updateAccount({ id: account.id, awsAccountId: organizationAccount.Id }, account.tableName);
    account = await accountService.addAccountHistoryRecord(account.id, 'AWS account creation validated', { provisionedAccount, organizationAccount, account }, account.tableName);
    return account;
  } catch (error) {
    if (error instanceof NotReady) {
      throw error;
    }
    console.log('Validate AWS account step failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const createBudget = async (account) => {
  try {
    const budget = await awsBudgetService.createBudget(account.awsAccountId, account.name, account.owner, account.budget);
    account = await accountService.addAccountHistoryRecord(account.id, 'AWS budget created', { budget }, account.tableName);
    return account;
  } catch (error) {
    console.log('Create budget step failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const validateSsoGroup = async (account) => {
  console.log('Validate AD group propagated to SSO', account);
  return account;
}

const assignSsoGroup = async (account) => {
  console.log('Assign SSO group to AWS account', account);
  return account;
}

const setCreationAsDone = async (account) => {
  account.status = creationStatuses.DONE;
  account = await accountService.updateAccount({ id: account.id, status: account.status }, account.tableName || tableName);
  account = await accountService.addAccountHistoryRecord(account.id, 'Mark AWS creation as done', {}, account.tableName || tableName);
  return account;
}

const setCreationAsFailed = async (errorInput) => {
  const errorCause = errorInput.Cause;
  const parsedCause = JSON.parse(errorCause);
  const parsedTrace = JSON.parse(parsedCause.trace[0]);
  const accountId = parsedTrace.account.id;
  let account = await accountService.updateAccount({ id: accountId, status: creationStatuses.FAILED }, tableName);
  account = await accountService.addAccountHistoryRecord(accountId, 'Mark AWS creation as failed', {}, tableName);
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
  assignSsoGroup,
  setCreationAsDone,
  setCreationAsFailed
};
