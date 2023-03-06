const { okResponse, errorResponse } = require('./responses');
const { getGcpAuthClient, getGcpAccountKeys } = require('../service/gcp-auth-client-service');
const accountSyncService = require('../service/gcp-account-sync-service');

const tableName = process.env.ACCOUNT_GCP_TABLE;

// TODO: remove before release (GCP AUTH example)
const gcpAuth = async (event) => {
  try {
    const gcpClient = await getGcpAuthClient();
    const gcpAccountKeys = await getGcpAccountKeys();
    if (gcpClient && gcpAccountKeys) {
      const url = `https://cloudresourcemanager.googleapis.com/v3/projects/${gcpAccountKeys.project_id}`;
      const res = await gcpClient.request({url});
      return okResponse({gcp: true, success: true, result: res.data});
    } else {
      throw new Error('Cannot fetch gcp account keys or client');
    }
  } catch (error) {
    console.log('auth error', error);
    return errorResponse({ statusCode: 500, message: 'Cannot fetch gcp account keys or client'});
  }
};

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
const syncBudgets = async (event) => {
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
    const result = await accountSyncService.syncOwners();
    return okResponse(result);
  } catch (error) {
    console.log('Owners sync failed', error);
    return errorResponse(error);
  }
}

module.exports = {
  gcpAuth,
  createAccount,
  getAccount,
  getAccounts,
  syncBudgets,
  syncOwners,
  syncAccounts
};
