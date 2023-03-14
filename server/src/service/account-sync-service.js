const { merge, omit } = require('lodash');
const accountService = require('./account-service');
const awsCloudtrailService = require('./aws-cloudtrail-service');
const awsOrganizationService = require('./aws-organization-service');
const awsServiceCatalogService = require('./aws-service-catalog-service');
const activeDirectoryService = require('./active-directory-service');
const awsBudgetService = require('./aws-budget-service');
const awsSnsService = require('./aws-sns-service');

const tableName = process.env.ACCOUNT_TABLE;

const syncAccountsInitial = async () => {
  const cloudtrailAccounts = await awsCloudtrailService.findProvisionedAccounts();
  const serviceCatalogAccounts = await awsServiceCatalogService.listProvisionedAccounts();
  const organizationAccounts = await awsOrganizationService.getOrganizationAccounts();
  const dynamoDbAccounts = await accountService.getAccounts(tableName);

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
    await accountService.updateAccount(account, tableName);
    syncedAccounts.push(account);
  }
  console.log(`Accounts to be put in DynamoDB`, JSON.stringify(syncedAccounts, null, 2), `\n\n`);

  for (const orgAccount of organizationAccounts) {
    // console.log(`Checking Organization account ${orgAccount.Name} [${orgAccount.Id}]`);
    if (!syncedAccounts.find(a => orgAccount.Id === a.awsAccountId)) {
      console.log(`Organization account ${orgAccount.Name} [${orgAccount.Id}] not matched with any account`);
    }
  }
  for (const dbAccount of dynamoDbAccounts) {
    // console.log(`Checking DynamoDB account ${dbAccount.name} [${dbAccount.awsAccountId}]`);
    if (!syncedAccounts.find(a => dbAccount.awsAccountId === a.awsAccountId)) {
      console.log(`DynamoDB account ${dbAccount.name} [${dbAccount.awsAccountId}] not matched with any account -> deleting`);
      await accountService.deleteAccount(dbAccount.id, tableName);
    }
  }
}

const syncAccountsCreatedTime = async () => {
  const accounts = await accountService.getAccounts(tableName);
  const serviceCatalogAccounts = await awsServiceCatalogService.listProvisionedAccounts();
  accounts.forEach(async account => {
    console.log(`\nAccount: ${account.awsAccountId}, createdTime: ${JSON.stringify(account.createdTime)}`);
    if (account.history) {
      const oldSync = account.history.find(item => item.type === 'Sync ServiceCatalog');
      if (oldSync) {
        const newSync = serviceCatalogAccounts.find(scAccount => scAccount.Id === oldSync.record.Id);
        console.log(`Found this in ServiceCatalog: ${JSON.stringify(newSync.CreatedTime)}, updating`);
        await accountService.updateAccount({ id: account.id, createdTime: JSON.stringify(newSync.CreatedTime).replace(/"/g, '') }, tableName);
      } else {
        console.log('Couldn\'t find old sync record');
      }
    } else {
      console.log(`Empty account history.`)
    }
  });
}

const syncAccountsMembers = async () => {
  const accounts = await accountService.getAccounts(tableName);
  for (const account of accounts) {
    const members = await activeDirectoryService.findGroupMemberEmails(account.name);
    console.log('syncAccountsMembers: ', account.name, members);
    await accountService.updateAccount({ id: account.id, members }, tableName);
  }
}

const syncAccounts = async () => {
  await syncAccountsMembers();
}

const syncBudgets = async () => {
  const budgets = await awsBudgetService.getAllBudgets();
  // console.log('all budgets', JSON.stringify(budgets, null, 2));
  const accounts = await accountService.getAccounts(tableName);
  for (const account of accounts) {
    const budget = budgets.find(budget => budget.CostFilters && budget.CostFilters.LinkedAccount && budget.CostFilters.LinkedAccount.includes(account.awsAccountId));
    if (budget) {
      if (+account.budget == +budget.BudgetLimit.Amount) {
        console.log(`Budget in sync for account ${account.name} [${account.awsAccountId}]`);
      } else {
        console.log(`Budget not in sync for account ${account.name} [${account.awsAccountId}] $${account.budget}`, JSON.stringify(budget, null, 2));
        await awsBudgetService.deleteBudgetsByAccountId(account.awsAccountId);
        if (account.budget) {
          console.log(`Creating budget for account ${account.name} [${account.awsAccountId}] $${account.budget}`);
          await awsBudgetService.createBudget(account.awsAccountId, account.name, account.owner, account.budget);
          console.log(`Created`);
        }
      }
      const budgetUpdate = { id: account.id };
      budgetUpdate.actualSpend = budget.CalculatedSpend && budget.CalculatedSpend.ActualSpend && budget.CalculatedSpend.ActualSpend.Amount || "0";
      budgetUpdate.forecastedSpend = budget.CalculatedSpend && budget.CalculatedSpend.ForecastedSpend && budget.CalculatedSpend.ForecastedSpend.Amount || "0";
      await accountService.updateAccount(budgetUpdate, tableName);
    } else {
      if (account.budget) {
        console.log(`No budget created for account ${account.name} [${account.awsAccountId}] $${account.budget}. Creating...`);
        await awsBudgetService.createBudget(account.awsAccountId, account.name, account.owner, account.budget);
        console.log(`Created`);
      } else {
        console.log(`No budget defined for account ${account.name} [${account.awsAccountId}] and none created`);
      }
    }
  }
}

// Checks:
// - is owner active in AD?
// - is owner in DynamoDB also the owner of AD group
const syncOwners = async () => {
  console.log(`Checking account owners`);
  const accounts = await accountService.getAccounts(tableName);
  // const user = await activeDirectoryService.findUserByEmail('d.predarski@levi9.com');
  for (const account of accounts) {
    const user = await activeDirectoryService.findUserByEmail(account.owner);
    if (!user) {
      console.log(`Account ${account.name} [${account.awsAccountId}] - owner not found in AD`);
      await awsSnsService.publishAlert(`Account ${account.name} owner issue`, `Account owner check - ${account.name} [${account.awsAccountId}] - owner not found in AD`);
    } else {
      const group = await activeDirectoryService.findGroupByName(account.name);
      if (!group) {
        console.log(`Account ${account.name} [${account.awsAccountId}] - group not found in AD`);
      } else {
        const owners = await activeDirectoryService.findGroupOwners(group.id);
        if (owners.includes(account.owner)) {
          console.log(`Account ${account.name} [${account.awsAccountId}] - AWS account owner and AD group owner is the same - All Good!`);
        } else {
          console.log(`Account ${account.name} [${account.awsAccountId}] - AWS account owner is not configured as AD group owner - Updating AD`);
          // await activeDirectoryService.execAdRunbook(account.name, account.owner);
          // account = await accountService.addAccountHistoryRecord(account.id, 'AD Group creation requested', {}, process.env.ACCOUNT_TABLE);
          await awsSnsService.publishAlert(`Account ${account.name} owner issue`, `Account owner check - ${account.name} [${account.awsAccountId}] - AWS account owner is not configured as AD group owner`);
        }
      }
    }
  }
}

module.exports = {
  syncAccounts,
  syncAccountsInitial,
  syncAccountsCreatedTime,
  syncAccountsMembers,
  syncBudgets,
  syncOwners
};
