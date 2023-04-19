const { okResponse, errorResponse } = require('./responses');
const accountService = require('../service/account-service');
const accountSyncService = require('../service/gcp-account-sync-service');
const { getBudgetList, updateBudget } = require('../service/gcp-budget-service');
const { clouds, budgetNameSuffix } = require('../utils');

const tableName = process.env.ACCOUNT_GCP_TABLE;

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

const updateAccount = async (event) => {
  console.log('updateAccount', event);
  try {
    const id = event.pathParameters.id;
    const account = { ...JSON.parse(event.body), id };

    const oldStateAccount = await accountService.getAccount(id, tableName);

    // check and update budget in gcp if needed
    if (oldStateAccount.budget != account.budget) {
      const budgets = await getBudgetList();
      const budgetsForUpdate = budgets.filter(budget => budget.displayName === `${account.name}${budgetNameSuffix.EMAIL}` || budget.displayName === `${account.name}${budgetNameSuffix.PUBSUB}`);

      await Promise.all(budgetsForUpdate.map(async (budget) => {
        await updateBudget(budget, account.budget);
      }));
    }

    // update account project in dynamodb
    const updatedAccount = await accountService.updateAccount(account, tableName);
    
    return okResponse(updatedAccount);
  } catch (error) {
    console.log('Account update failed', error);
    return errorResponse(error);
  }
};

const createAccount = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const account = await accountService.createAccount(data, clouds.GCP);
    return okResponse(account);
  } catch (error) {
    console.log('Account creation failed', error);
    return errorResponse(error);
  }
};

// Description
// GCP does not have an API for getting spent budget per account
// Instead of that, we activated budget notification (on budget threshold) to be sent to pubsub topic.
// Lambda task: Fetching messages from topic and updating account/project 'spent amount' value in AWS Dynamodb Table
// Lambda will retrigger new execution if there are more messages to be proceeded
const syncBudgets = async () => {
  try {
    await accountSyncService.syncBudgets();
    return okResponse({ success: true, message: 'Budget sync is done' });
  } catch (error) {
    console.log('Budget sync failed', error);
    return errorResponse({ statusCode: 500, message: 'Budget sync failed'});
  }
};

const syncOwners = async () => {
  try {
    const result = await accountSyncService.syncOwners();
    return okResponse(result);
  } catch (error) {
    console.log('Owners sync failed', error);
    return errorResponse(error);
  }
}

const syncAccounts = async () => {
  try {
    const result = await accountSyncService.syncAccounts();
    return okResponse(result);
  } catch (error) {
    console.log('Owners sync failed', error);
    return errorResponse(error);
  }
}

module.exports = {
  createAccount,
  getAccount,
  getAccounts,
  updateAccount,
  syncBudgets,
  syncOwners,
  syncAccounts
};
