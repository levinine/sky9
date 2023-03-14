const { groupBy, mapValues, orderBy } = require('lodash');
const accountService = require('./account-service');
const activeDirectoryService = require('./active-directory-service');
const awsSnsService = require('./aws-sns-service');
const pubSubService = require('./gcp-pubsub-service');
const { budgetNameSuffix } = require('../utils');

const tableName = process.env.ACCOUNT_GCP_TABLE;

const syncAccountsMembers = async () => {
  const accounts = await accountService.getAccounts(tableName);
  for (const account of accounts) {
    const members = await activeDirectoryService.findGroupMemberEmails(account.adGroupName);
    console.log('syncAccountsMembers: ', account.adGroupName, members);
    await accountService.updateAccount({ id: account.id, members }, tableName);
  }
}

const syncAccounts = async () => {
  await syncAccountsMembers();
}

// Checks:
// - is owner active in AD?
// - is owner in DynamoDB also the owner of AD group
const syncOwners = async () => {
  console.log(`Checking account owners`);
  const accounts = await accountService.getAccounts(tableName);
  for (const account of accounts) {
    const user = await activeDirectoryService.findUserByEmail(account.owner);
    if (!user) {
      console.log(`Account ${account.adGroupName} [${account.gcpProjectId}] - owner not found in AD`);
      await awsSnsService.publishAlert(`Account ${account.adGroupName} owner issue`, `Account owner check - ${account.adGroupName} [${account.gcpProjectId}] - owner not found in AD`);
    } else {
      const group = await activeDirectoryService.findGroupByName(account.adGroupName);
      if (!group) {
        console.log(`Account ${account.adGroupName} [${account.gcpProjectId}] - group not found in AD`);
      } else {
        const owners = await activeDirectoryService.findGroupOwners(group.id);
        if (owners.includes(account.owner)) {
          console.log(`Account ${account.adGroupName} [${account.gcpProjectId}] - AWS account owner and AD group owner is the same - All Good!`);
        } else {
          console.log(`Account ${account.adGroupName} [${account.gcpProjectId}] - AWS account owner is not configured as AD group owner - Updating AD`);
          // await activeDirectoryService.execAdRunbook(account.adGroupName, account.owner);
          // account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation requested', {}, process.env.ACCOUNT_TABLE);
          await awsSnsService.publishAlert(`Account ${account.adGroupName} owner issue`, `Account owner check - ${account.adGroupName} [${account.gcpProjectId}] - AWS account owner is not configured as AD group owner`);
        }
      }
    }
  }
}

// Description
// GCP does not have an API for getting spent budget per account
// Instead of that, we activated budget notification (on budget threshold) to be sent to pubsub topic.
// Lambda task: Fetching messages from topic and updating account/project 'spent amount' value in AWS Dynamodb Table
// Lambda will retrigger new execution if there are more messages to be proceeded
const syncBudgets = async () => {

  // get message from gcp pub/sub
  let messagesResponse = await pubSubService.getMessages();
  const rawMessages = messagesResponse.data.receivedMessages || [];

  // encode message content
  const messages = rawMessages.map((message) => {
    const data = Buffer.from(message.message.data, 'base64');
    return JSON.parse(data.toString());
  });

  // sort budget per name and costAmount (possible duplicates)
  const sortedBudgets = mapValues(groupBy(messages, message => message.budgetDisplayName), object => orderBy(object, 'costAmount', 'desc'));

  // get existing accounts from dynamodb
  const accounts = await accountService.getAccounts(tableName);

  // budget name === ${account/project name} + ${suffix '-budget-pubsub'}
  const budgetNames = Object.keys(sortedBudgets);

  const events = [];
  // iterate through budget messages from pubsub and pick accounts for update
  budgetNames.forEach(budgetName => {
    const accountName = budgetName.replace(budgetNameSuffix.PUBSUB, '');
    const accountForUpdate = accounts.find(account => account.name === accountName);
    // if condition is true, call dynamodb and update account actualSpend value
    if (accountForUpdate && Number(accountForUpdate.actualSpend) < Number(sortedBudgets[budgetName][0].costAmount)) {
      console.log(`Update budget for: ${accountForUpdate.id} - ${accountForUpdate.name}, old cost ${accountForUpdate.actualSpend}, new cost ${sortedBudgets[budgetName][0].costAmount}`)
      // call dynamo for item update
      // get the biggest sorted value for actualSpend (because of message duplicates)
      events.push(accountService.updateAccount({ id: accountForUpdate.id, actualSpend: `${sortedBudgets[budgetName][0].costAmount}` }, tableName));
    }
  })
  await Promise.all(events);

  // purge processed messages
  const ackIds = rawMessages.map(message => message.ackId);
  await pubSubService.acknowledgeMessages(ackIds);
  console.log('acknowledge messages finished');

  // call for a new batch of messages
  if (messages.length) {
    await syncBudgets();
  }
  
  return { success: true, message: 'Budget sync is done' };
}

module.exports = {
  syncAccounts,
  syncAccountsMembers,
  syncOwners,
  syncBudgets
};
