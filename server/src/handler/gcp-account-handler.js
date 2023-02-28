const { okResponse, errorResponse } = require('./responses');
const { getGcpAuthClient, getGcpAccountKeys } = require('../service/gcp-auth-client-service');
const { groupBy, mapValues, orderBy } = require('lodash');
const accountService = require('../service/account-service');

// TODO: remove before release (GCP AUTH example)
const gcpAuth = async (event) => {
  try {
    const gcpClient = await getGcpAuthClient();
    const gcpAccountKeys = await getGcpAccountKeys();
    if (gcpClient && gcpAccountKeys) {
      const url = `https://cloudresourcemanager.googleapis.com/v3/projects/${gcpAccountKeys.project_id}`;
      const res = await gcpClient.request({url});
      console.log('res', res);
      return okResponse({gcp: true, success: true, result: res.data});
    } else {
      throw new Error('Cannot fetch gcp account keys or client');
    }
  } catch (error) {
    console.log('auth error', error);
    return errorResponse({ statusCode: 500, message: 'Cannot fetch gcp account keys or client'});
  }
};

// TODO - maybe move it to gcp pubsub service
const acknowledgeMessages = async (ids) => {
  const gcpClient = await getGcpAuthClient();
  const gcpAccountKeys = await getGcpAccountKeys();

  const subscription = `projects/${gcpAccountKeys.project_id}/subscriptions/${process.env.GCP_BUDGET_SUBSCRIPTION_ID}`;
  const url = `https://pubsub.googleapis.com/v1/${subscription}:acknowledge`
  const body = {
    ackIds: ids
  };
  return await gcpClient.request({ method: 'POST', url, data: body});
}

// TODO - maybe move it to gcp pubsub service
const getMessages = async () => {
  const gcpClient = await getGcpAuthClient();
  const gcpAccountKeys = await getGcpAccountKeys();

  const subscription = `projects/${gcpAccountKeys.project_id}/subscriptions/${process.env.GCP_BUDGET_SUBSCRIPTION_ID}`;
  const url = `https://pubsub.googleapis.com/v1/${subscription}:pull`;
  const body = {
    maxMessages: 1000
  };
  const response = await gcpClient.request({ method: 'POST', url, data: body});
  // TODO - remove (used for testing purpose)
  // const response = {
  //   data: {
  //     receivedMessages: mockedRawMessages
  //   }
  // }
  return response;
}

// Description
// GCP does not have an API for getting spent budget per account
// Instead of that, we activated budget notification (on budget threshold) to be sent to pubsub topic.
// Lambda task: Fetching messages from topic and updating account/project 'spent amount' value in AWS Dynamodb Table
// Lambda will retrigger new execution if there are more messages to be proceeded
const syncBudgets = async (event) => {

  try {
  // get message from gcp pub/sub
  let messagesResponse = await getMessages();
  const rawMessages = messagesResponse.data.receivedMessages || [];

  // encode message content
  const messages = rawMessages.map((message, index) => {
    const data = Buffer.from(message.message.data, 'base64');
    return JSON.parse(data.toString());
  });

  // sort budget per name and costAmount (possible duplicates)
  const sortedBudgets = mapValues(groupBy(messages, message => message.budgetDisplayName), object => orderBy(object, 'costAmount', 'desc'));

  // get existing accounts from dynamodb
  const tableName = process.env.ACCOUNT_GCP_TABLE;
  const accounts = await accountService.getAccounts(tableName);

  // const dynamoAccounts = accounts.map(account => { return { name: account.name, id: account.id, forecastedSpend: account.forecastedSpend } });

  // budget name === ${account/project name} + ${suffix '-budget'}
  const budgetNames = Object.keys(sortedBudgets);

  const events = [];
  // iterate through budget messages from pubsub and pick accounts for update
  budgetNames.forEach(budgetName => {
    const accountName = budgetName.replace('-budget', '');
    const accountForUpdate = accounts.find(account => account.name === accountName);
    // if condition is true, call dynamodb and update account forecastedSpend value
    if (accountForUpdate && Number(accountForUpdate.forecastedSpend) < Number(sortedBudgets[budgetName][0].costAmount)) {
      console.log(`Update budget for: ${accountForUpdate.id} - ${accountForUpdate.name}, old cost ${accountForUpdate.forecastedSpend}, new cost ${sortedBudgets[budgetName][0].costAmount}`)
      // TODO call dynamo for item update, uncomment real call to dynamoDB
      // get the biggest sorted value for forecastedSpend (because of message duplicate)
      // events.push(accountService.updateAccount({ id: accountForUpdate.id, forecastedSpend: `${sortedBudgets[name][0].costAmount}` }, tableName));
      events.push(Promise.resolve(accountForUpdate.name));
    }
  })
  await Promise.all(events);

  // purge processed messages
  const ackIds = rawMessages.map(message => message.ackId);
  await acknowledgeMessages(ackIds);
  console.log('acknowledge messages finished');

  // call for a new batch of messages
  if (messages.length) {
    syncBudgets();
  }
 
  return okResponse({ success: true, message: 'Budget sync is in progress' });
  } catch (error) {
    console.log('Budget sync failed', error);
    return errorResponse({ statusCode: 500, message: 'Budget sync failed'});
  }
};

module.exports = {
  gcpAuth,
  syncBudgets
};
