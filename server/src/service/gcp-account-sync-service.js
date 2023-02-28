const accountService = require('./account-service');
const activeDirectoryService = require('./active-directory-service');
const awsSnsService = require('./aws-sns-service');

const tableName = process.env.ACCOUNT_GCP_TABLE;

const syncAccountsMembers = async () => {
  const accounts = await accountService.getAccounts(tableName);
  for (account of accounts) {
    const members = await activeDirectoryService.findGroupMemberEmails(account.name);
    console.log('syncAccountsMembers: ', account.name, members);
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
      console.log(`Account ${account.name} [${account.gcpProjectId}] - owner not found in AD`);
      await awsSnsService.publishAlert(`Account ${account.name} owner issue`, `Account owner check - ${account.name} [${account.gcpProjectId}] - owner not found in AD`);
    } else {
      const group = await activeDirectoryService.findGroupByName(account.name);
      if (!group) {
        console.log(`Account ${account.name} [${account.gcpProjectId}] - group not found in AD`);
      } else {
        const owners = await activeDirectoryService.findGroupOwners(group.id);
        if (owners.includes(account.owner)) {
          console.log(`Account ${account.name} [${account.gcpProjectId}] - AWS account owner and AD group owner is the same - All Good!`);
        } else {
          console.log(`Account ${account.name} [${account.gcpProjectId}] - AWS account owner is not configured as AD group owner - Updating AD`);
          // await activeDirectoryService.execAdRunbook(account.name, account.owner);
          // account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation requested', {}, process.env.ACCOUNT_TABLE);
          await awsSnsService.publishAlert(`Account ${account.name} owner issue`, `Account owner check - ${account.name} [${account.gcpProjectId}] - AWS account owner is not configured as AD group owner`);
        }
      }
    }
  }
}

module.exports = {
  syncAccounts,
  syncAccountsMembers,
  syncOwners
};
