'use strict';
const accountService = require('../service/account-service');
const awsBudgetService = require('../service/aws-budget-service');
const awsServiceCatalogService = require('../service/aws-service-catalog-service');
const awsOrganizationService = require('../service/aws-organization-service');
const activeDirectoryService = require('../service/active-directory-service');

function NotReady(message) {
  this.name = 'NOT_READY';
  this.message = message || 'Not yet';
}
NotReady.prototype = new Error();

const createAccount = async (account) => {
  console.log(account);
  try {
    account = await accountService.createAccount(account);
    account = await accountService.addAccountHistoryRecord(account.id, 'DynamoDB created', { account });
    return account;
  } catch (error) {
    console.log('Account creation step failed', error);
    throw error;
  }
};

const createAdGroup = async (account) => {
  console.log('Create AD group step', account);
  const result = await activeDirectoryService.execAdRunbook(account.name, account.owner);
  account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation requested', {});
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
    account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation verified', {});
    return account;
  }
}

const createAwsAccount = async (account) => {
  console.log(`Creating AWS account ${JSON.stringify(account)}`);
  const provisionAccount = await awsServiceCatalogService.provisionAccount(account);
  account = await accountService.addAccountHistoryRecord(account.id, 'AWS account creation requested', { provisionAccount });
  console.log(`Finished creating AWS account`);
  return account;
}

const falseErrors = [
  'AWS Control Tower is not authorized to baseline the VPC in the managed account.'
];
const validateAwsAccount = async (account) => {
  console.log(`Validate creation of AWS account ${JSON.stringify(account)}`);
  const provisionedAccounts = await awsServiceCatalogService.listProvisionedAccounts();
  const provisionedAccount = provisionedAccounts.find(provisionedAccount => provisionedAccount.Name === account.name);
  console.log(`Found AWS account:`, provisionedAccount);
  if (!provisionedAccount || !(provisionedAccount.Status === 'AVAILABLE' || (provisionedAccount.Status === 'ERROR' && falseErrors.includes(provisionedAccount.StatusMessage)))) {
    throw new NotReady();
  }
  const organizationAccount = await awsOrganizationService.getAccountByName(account.name);
  account = await accountService.updateAccount({ id: account.id, awsAccountId: organizationAccount.Id });
  account = await accountService.addAccountHistoryRecord(account.id, 'AWS account creation validated', { provisionedAccount, organizationAccount, account });
  return account;
}

const createBudget = async (account) => {
  const budget = await awsBudgetService.createBudget(account.awsAccountId, account.name, account.owner, account.budget);
  account = await accountService.addAccountHistoryRecord(account.id, 'AWS budget created', { budget });
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
