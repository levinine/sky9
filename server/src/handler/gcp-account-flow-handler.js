'use strict';
const accountService = require('../service/account-service');
const activeDirectoryService = require('../service/active-directory-service');
const { getGcpAuthClient, getGcpAccountKeys } = require('../service/gcp-auth-client-service');
const { setBudgetForEmailNotification, setBudgetForPubSubNotification } = require('../service/gcp-budget-service');

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

const tableName = process.env.ACCOUNT_GCP_TABLE;

// Create account for gcp in dynamo
const createAccount = async (account) => {
    try {
      account = await accountService.createAccount(account, clouds.GCP);
      account.tableName = tableName;
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
    const result = await activeDirectoryService.execAdRunbook(account.adGroupName, account.owner, clouds.GCP);
    account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation requested', {}, account.tableName || tableName);
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
    account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation verified', {}, account.tableName || tableName);
    return account;
  }
}

const createGcpAccount = async (account) => {
  console.log(`Creating GCP account ${JSON.stringify(account)}`);
  try {
    const gcpClient = await getGcpAuthClient();
    const url = 'https://cloudresourcemanager.googleapis.com/v3/projects';
    const body = {
      "projectId": account.name,
      "displayName": account.name,
      "parent": `folders/${process.env.GCP_PARENT_FOLDER_VALUE}`
    }
    const createdAccount = await gcpClient.request({ method: 'POST', url: url, data: body });
    account.gcpProjectId = account.name;
    await accountService.updateAccount({ id: account.id, gcpProjectId: account.name }, tableName);
    account = await accountService.addAccountHistoryRecord(account.id, 'GCP account creation requested', { account }, account.tableName || tableName);
    console.log(`Finished creating GCP account`, createdAccount);
    return account;
  } catch (error) {
    console.log('GCP account creation step failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const assignAdGroupAsProjectOwner = async (account) => {
  console.log(`Assign ad group as project owner ${JSON.stringify(account)}`);
  try {
    const gcpClient = await getGcpAuthClient();
    const getPolicyUrl = `https://cloudresourcemanager.googleapis.com/v3/projects/${account.name}:getIamPolicy`;
    const previousPolicyResponse = await gcpClient.request({ method: 'POST', url: getPolicyUrl });
    let previousPolicy = previousPolicyResponse.data;
    const editorPolicy = [{
      'role': 'roles/editor',
      'members': [
        `group:${account.adGroupName}-Administrators@levi9.com` // ad group email (ad group name + @levi9.com)
      ]
    },
    {
      "role": "roles/resourcemanager.projectIamAdmin",
      "members": [
        `group:${account.adGroupName}-Administrators@levi9.com`
      ]
    }];
    previousPolicy.bindings = previousPolicy.bindings.concat(editorPolicy);

    const setPolicyUrl = `https://cloudresourcemanager.googleapis.com/v3/projects/${account.name}:setIamPolicy`;
    const updatedPolicy = {
      policy: previousPolicy,
      updateMask: "bindings"
    }
    await gcpClient.request({ method: 'POST', url: setPolicyUrl, data: updatedPolicy });
    account = await accountService.addAccountHistoryRecord(account.id, 'AD Group assigned as a project owner', { account }, account.tableName || tableName);
    console.log(`Finished assigning ad group as a project owner`);
    return account;
  } catch (error) {
    console.log('Assigning ad group as a project owner failed', error);
    if (error.code === 400) {
      // ad group is still not propagate to gcp
      throw new NotReady();
    }
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const wait = async (seconds) => {
  return new Promise(resolve => {
     setTimeout(resolve, seconds * 1000);
  });
} 

const setBillingAccount = async (account) => {
  console.log(`Setting GCP billing account ${JSON.stringify(account)}`);
  try {
    const gcpClient = await getGcpAuthClient();
    // the previous step was to create GCP project, wait 10 seconds to be sure that GCP propagate all resorces otherwise 403 error is thrown by GCP API
    await wait(10);
    const url = `https://cloudbilling.googleapis.com/v1/projects/${account.name}/billingInfo`; // name = PROJECT_ID
    const body = {
      "billingAccountName": `billingAccounts/${process.env.GCP_BILLING_ACCOUNT_ID}`
    }
    await gcpClient.request({ method: 'PUT', url: url, data: body });
    account = await accountService.addAccountHistoryRecord(account.id, 'GCP set billing account', { account }, account.tableName || tableName);
    console.log(`Finished setting GCP billing account`);
    return account;
  } catch (error) {
    console.log('Setting GCP billing account failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const createNotificationChannel = async (account) => {
  console.log(`Creating GCP Notification channel ${JSON.stringify(account)}`);
  try {
    const gcpClient = await getGcpAuthClient();
    const gcpAccountKeys = await getGcpAccountKeys();
  
    const url = `https://monitoring.googleapis.com/v3/projects/${gcpAccountKeys.project_id}/notificationChannels`;
    const body = {
      "type": "email",
      "displayName": `${account.ownerFirstName} ${account.ownerLastName}`,
      "labels": {
        "email_address": account.owner
      }
    };
  
    const createdNotification = await gcpClient.request({ method: 'POST', url, data: body });
    // add for history
    account.notificationChannelId = createdNotification.data.name;
    account = await accountService.addAccountHistoryRecord(account.id, 'GCP create notification channel', { account }, account.tableName || tableName);
    // add for next step on higher object level
    account.notificationChannelId = createdNotification.data.name;
    console.log(`Finished creation of notification channel`);
    return account;
  } catch (error) {
    console.log('Creation of notification channel failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const setBudget = async (account) => {
  try {
    await setBudgetForEmailNotification(account);
    account = await accountService.addAccountHistoryRecord(account.id, 'GCP set project budget for email notification', { account }, account.tableName || tableName);
    await setBudgetForPubSubNotification(account);
    account = await accountService.addAccountHistoryRecord(account.id, 'GCP set project budget for pubsub notiffication', { account }, account.tableName || tableName);
    return account;
  } catch (error) {
    console.log('Setting of project budgets failed', error);
    throw new CreationFailed(error.message ? error.message : `${error}`, account.id);
  }
}

const setCreationAsDone = async (account) => {
  account.status = creationStatuses.DONE;
  account = await accountService.updateAccount({ id: account.id, status: account.status }, account.tableName || tableName);
  account = await accountService.addAccountHistoryRecord(account.id, 'Mark GCP creation as done', {}, account.tableName || tableName);
  return account;
}

const setCreationAsFailed = async (errorInput) => {
  let accountId = null;
  if (errorInput.Cause) {
    try {
      const errorCause = errorInput.Cause;
      const parsedCause = JSON.parse(errorCause);
      const parsedTrace = JSON.parse(parsedCause.trace[0]);
      accountId = parsedTrace.account.id;
    } catch (e) {
      const latestAccount = await accountService.getTheLatestAccount(tableName);
      accountId = latestAccount ? latestAccount.id : null;
    }
  } else {
    // if error does not contain account id, get the last one account that is tried to be created
    // this one would not be applicable if we are creating multiple aws accounts at once
    // for now, aws has limits and our devops do not trigger multiple creation at once
    const latestAccount = await accountService.getTheLatestAccount(tableName);
    accountId = latestAccount ? latestAccount.id : null;
  }
  let account = await accountService.updateAccount({ id: accountId, status: creationStatuses.FAILED }, tableName);
  account = await accountService.addAccountHistoryRecord(accountId, 'Mark AWS creation as failed', {}, tableName);
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
  setBudget,
  setCreationAsDone,
  setCreationAsFailed
};
