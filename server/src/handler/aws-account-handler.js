const { okResponse, errorResponse } = require('./responses');
const accountService = require('../service/account-service');
const accountSyncService = require('../service/account-sync-service');
const awsBudgetService = require('../service/aws-budget-service');
const { clouds } = require('../utils');

const tableName = process.env.ACCOUNT_TABLE;

const getAccount = async (event) => {
  try {
    const id = event.pathParameters.id;
    const account = await accountService.getAccount(id, tableName);
    return okResponse(account);
  } catch (error) {
    return errorResponse(error);
  }
};

const getAccounts = async () => {
  try {
    const accounts = await accountService.getAccounts(tableName);
    return okResponse(accounts);
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};

const createAccount = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const account = await accountService.createAccount(data, clouds.AWS);
    return okResponse(account);
  } catch (error) {
    console.log('Account creation failed', error);
    return errorResponse(error);
  }
};

const updateAccount = async (event) => {
  console.log('updateAccount', event);
  try {
    const id = event.pathParameters.id;
    const account = { ...JSON.parse(event.body), id };
    const updatedAccount = await accountService.updateAccount(account, tableName);
    return okResponse(updatedAccount);
  } catch (error) {
    console.log('Account update failed', error);
    return errorResponse(error);
  }
};

const deleteAccount = async event => {
  const id = process.env.accountId || event.accountId;
  const account = await accountService.deleteAccount(id, tableName);
  return account;
};

const syncAccounts = async () => {
  try {
    const result = await accountSyncService.syncAccounts();
    return okResponse(result);
  } catch (error) {
    console.log('Account sync failed', error);
    return errorResponse(error);
  }
}

const syncBudgets = async () => {
  try {
    const result = await accountSyncService.syncBudgets();
    return okResponse(result);
  } catch (error) {
    console.log('Budget sync failed', error);
    return errorResponse(error);
  }
}

const syncOwners = async () => {
  try {
    const result = await accountSyncService.syncOwners();
    return okResponse(result);
  } catch (error) {
    console.log('Owners sync failed', error);
    return errorResponse(error);
  }
}

const createBudget = async () => {
  const accountId = process.env.accountId;
  const budget = process.env.budget;
  const owner = process.env.owner;
  await awsBudgetService.createBudget(accountId, accountId, owner, budget);
}

module.exports = {
  getAccount,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  syncAccounts,
  syncBudgets,
  syncOwners,
  createBudget
};
