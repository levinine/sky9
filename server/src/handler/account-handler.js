'use strict';
const accountService = require('../service/account-service');
const accountSyncService = require('../service/account-sync-service');
const errorHandler = require('../infrastructure/error-handler');
const responseHandler = require('../infrastructure/response-handler');

const getAccount = async (event) => {
  try {
    const id = event.pathParameters.id;
    const account = await accountService.getAccount(id);
    return responseHandler(account);
  } catch (error) {
    return errorHandler(error);
  }
};

const getAccounts = async () => {
  try {
    const accounts = await accountService.getAccounts();
    return responseHandler(accounts);
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
};

const createAccount = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const account = await accountService.createAccount(data);
    return responseHandler(account);
  } catch (error) {
    console.log('Account creation failed', error);
    return errorHandler(error);
  }
};

const updateAccount = async (event) => {
  try {
    const id = event.pathParameters.id;
    const data = JSON.parse(event.body);
    if (id === data.id) {
      const account = await accountService.updateAccount(data);
      return responseHandler(account);
    } else {
      return errorHandler('Id doesnt match');
    }
  } catch (error) {
    console.log('Account update failed', error);
    return errorHandler(error);
  }
};

const deleteAccount = async event => {
  // sls invoke local -s local -f DeleteAccount -e accountId=[accountId]
  const id = process.env.accountId;
  const account = await accountService.deleteAccount(id);
  return account;
};

const syncAccounts = async () => {
  try {
    await accountSyncService.syncAccounts();
    return responseHandler({ 'status': 'OK' });
  } catch (error) {
    console.log('Account sync failed', error);
    return errorHandler(error);
  }
}

const createBudget = async () => {
  // sls invoke local -s local -f CreateBudget -e accountId=[accountId] -e budget=[budget] -e owner=[owner]
  const accountId = process.env.accountId;
  const budget = process.env.budget;
  const owner = process.env.owner;
  accountSyncService.createBudget(accountId, accountId, owner, budget);
}

module.exports = {
  getAccount,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  syncAccounts,
  createBudget
};
