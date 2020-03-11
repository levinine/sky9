const { merge, omit } = require('lodash');
const accountService = require('./account-service');
const awsCloudtrailService = require('./aws-cloudtrail-service');
const awsOrganizationService = require('./aws-organization-service');
const awsServiceCatalogService = require('./aws-service-catalog-service');
const activeDirectoryService = require('./active-directory-service');

const syncAccountsInitial = async () => {

  const cloudtrailAccounts = await awsCloudtrailService.findProvisionedAccounts();
  const serviceCatalogAccounts = await awsServiceCatalogService.listProvisionedAccounts();
  const organizationAccounts = await awsOrganizationService.getOrganizationAccounts();
  const dynamoDbAccounts = await accountService.getAccounts();

  // console.log(`sync accounts ${JSON.stringify({ cloudtrailAccounts, serviceCatalogAccounts, organizationAccounts, dynamoDbAccounts }, null, 2)}`);

  let syncedAccounts = [];
  for (const scAccount of serviceCatalogAccounts) {
    let account = {
      productName: scAccount.Name,
      createdTime: scAccount.CreatedTime,
      history: [{ timestamp: new Date().getTime(), type: 'Sync ServiceCatalog', record: scAccount }]
    }

    const ctAccount = cloudtrailAccounts.find(cta => cta.provisionToken === scAccount.IdempotencyToken);
    if (!ctAccount) {
      console.log(`Account ${JSON.stringify(omit(account,'history'))} not found in CloudTrail logs\n`);
      account.name = scAccount.Name;
    } else {
      // this happens when the account is provisioned by Sky9
      // shouldn't be an issue because the name should be in Dynamo and product name should be the same as account name
      if (ctAccount.name !== 'UNAVAILABLE') {
        account.name = ctAccount.name;
        account.owner = ctAccount.owner;
        account.ownerFirstName = ctAccount.ownerFirstName;
        account.ownerLastName = ctAccount.ownerLastName;
        account.email = ctAccount.email;
        account.budget = ctAccount.budget;
      } else {
        account.name = account.productName;
      }
      account.createdBy = ctAccount.createdBy;
      account.history.push({ timestamp: new Date().getTime(), type: 'Sync CloudTrail', record: ctAccount });
    }

    const orgAccount = organizationAccounts.find(oa => oa.Name === account.name);
    if (!orgAccount) {
      console.log(`Account ${JSON.stringify(omit(account,'history'))} not found in Organization\n`);
    } else {
      account.awsAccountId = orgAccount.Id;
      account.history.push({ timestamp: new Date().getTime(), type: 'Sync Organization', record: orgAccount });
    }

    const dbAccount = dynamoDbAccounts.find(dba => dba.name === account.name);
    if (!dbAccount) {
      console.log(`Account ${JSON.stringify(omit(account,'history'))} not found in DynamoDB\n`);
      account.id = `${new Date().getTime()}`;
    } else {
      account.id = dbAccount.id;
      if (dbAccount.history) {
        dbAccount.history.push(...account.history);
        account.history = dbAccount.history;
      }
    }
    account = merge(dbAccount, account);
    console.log(`Updating account ${JSON.stringify(omit(account,'history'))}`);
    await accountService.updateAccount(account);
    syncedAccounts.push(account);
  }
  console.log(`Accounts to be put in DynamoDB`, JSON.stringify(syncedAccounts, null, 2), `\n\n`);

  for (orgAccount of organizationAccounts) {
    // console.log(`Checking Organization account ${orgAccount.Name} [${orgAccount.Id}]`);
    if (!syncedAccounts.find(a => orgAccount.Id === a.awsAccountId)) {
      console.log(`Organization account ${orgAccount.Name} [${orgAccount.Id}] not matched with any account`);
    }
  }
  for (dbAccount of dynamoDbAccounts) {
    // console.log(`Checking DynamoDB account ${dbAccount.name} [${dbAccount.awsAccountId}]`);
    if (!syncedAccounts.find(a => dbAccount.awsAccountId === a.awsAccountId)) {
      console.log(`DynamoDB account ${dbAccount.name} [${dbAccount.awsAccountId}] not matched with any account -> deleting`);
      await accountService.deleteAccount(dbAccount.id);
    }
  }
}

const syncAccountsCreatedTime = async () => {
  const accounts = await accountService.getAccounts();
  const serviceCatalogAccounts = await awsServiceCatalogService.listProvisionedAccounts();
  accounts.forEach(async account => {
    console.log(`\nAccount: ${account.awsAccountId}, createdTime: ${JSON.stringify(account.createdTime)}`);
    if (account.history) {
      const oldSync = account.history.find(item => item.type === 'Sync ServiceCatalog');
      if (oldSync) {
        const newSync = serviceCatalogAccounts.find(scAccount => scAccount.Id === oldSync.record.Id);
        console.log(`Found this in ServiceCatalog: ${JSON.stringify(newSync.CreatedTime)}, updating`);
        await accountService.updateAccount({ id: account.id, createdTime: JSON.stringify(newSync.CreatedTime).replace(/"/g, '') });
      } else {
        console.log('Couldn\'t find old sync record');
      }
    } else {
      console.log(`Empty account history.`)
    }
  });
}

const syncAccountsMembers = async () => {
  const accounts = await accountService.getAccounts();
  for (account of accounts) {
    const members = await activeDirectoryService.findGroupMemberEmails(account.name);
    console.log('syncAccountsMembers: ', account.name, members);
    await accountService.updateAccount({ id: account.id, members });
  }
}

const syncAccounts = async () => {
  await syncAccountsMembers();
}

module.exports = {
  syncAccounts,
  syncAccountsInitial,
  syncAccountsCreatedTime,
  syncAccountsMembers
};
