const AWS = require('aws-sdk');
const accountService = require('./account-service');

const sts = new AWS.STS();
const organizations = new AWS.Organizations({ region: 'us-east-1' });
const cloudtrail = new AWS.CloudTrail();
const budgets = new AWS.Budgets();

let masterAccountId;
const getMasterAccountId = async () => {
  if (!masterAccountId) {
    const callerIdentity = await sts.getCallerIdentity().promise();
    masterAccountId = callerIdentity.Account;
  }
  return masterAccountId;    
}

const syncAccounts = async () => {

  const provisionedAccounts = await findProvisionedAccounts();
  const organizationAccounts = await getOrganizationAccounts();
  const storedAccounts = (await accountService.getAccounts()).Items;

  for (const provisionedAccount of provisionedAccounts) {
    const organizationAccount = organizationAccounts.find(a => a.Name === provisionedAccount.accountName);
    const storedAccount = storedAccounts.find(a => a.name === provisionedAccount.accountName);
    if (!organizationAccount) {
      console.log(`Account ${provisionedAccount.accountName} is provisioned in Control Tower but not present in Organization`);
    } else if (!storedAccount) {
      console.log(`Account ${provisionedAccount.accountName} -> DynamoDB`);
      await accountService.createAccount({
        id: organizationAccount.Id,
        name: provisionedAccount.accountName,
        email: provisionedAccount.accountEmail,
        owner: provisionedAccount.owner,
        budget: provisionedAccount.budget
      });
      if (provisionedAccount.budget) {
        await createBudget(organizationAccount.Id, provisionedAccount.accountName, provisionedAccount.owner, provisionedAccount.budget);
      }
    } else {
      console.log(`Account ${provisionedAccount.accountName} already processed`);
    }
  }
}

const findProvisionedAccounts = async () => {
  console.log('Finding provisioned accounts in CloudTrail');

  const params = {
    LookupAttributes: [{
      AttributeKey: 'EventName',
      AttributeValue: 'ProvisionProduct'
    }],
    MaxResults: 50, // max 50
    // NextToken: 'STRING_VALUE',
  };
  const eventsResponse = await cloudtrail.lookupEvents(params).promise();
  return eventsResponse.Events.map(event => {
    const eventRequest = JSON.parse(event.CloudTrailEvent);
    const accountName = eventRequest.requestParameters.provisioningParameters.find(p => p.key === 'AccountName').value;
    const accountEmail = eventRequest.requestParameters.provisioningParameters.find(p => p.key === 'AccountEmail').value;
    const owner = eventRequest.requestParameters.tags.find(t => t.key === 'owner');
    const budget = eventRequest.requestParameters.tags.find(t => t.key === 'budget');
    return { accountName, accountEmail, owner: owner && owner.value || undefined, budget: budget && budget.value || undefined };
  });
}

const getOrganizationAccounts = async () => {
  console.log('Finding linked accounts in AWS Organizations');
  const listAccountsResponse = await organizations.listAccounts().promise();
  return listAccountsResponse.Accounts;
}

const createBudget = async (accountId, accountName, owner, budget) => {
  console.log(`Account ${accountName} -> Creating budget with limit USD${budget}`);
  const b = await budgetRequest(accountId, accountName, owner, budget);
  await budgets.createBudget(b).promise();
}

const budgetRequest = async (accountId, accountName, owner, budgetUsd) => {
  return {
    AccountId: await getMasterAccountId(),
    Budget: {
      BudgetName: `${accountName}-budgets`,
      BudgetType: 'COST',
      TimeUnit: 'MONTHLY',
      BudgetLimit: {
        Amount: budgetUsd,
        Unit: 'USD'
      },
      CostFilters: { 
        LinkedAccount: [ accountId ]
      },
      CostTypes: {
        IncludeCredit: false,
        IncludeDiscount: true,
        IncludeOtherSubscription: true,
        IncludeRecurring: true,
        IncludeRefund: false,
        IncludeSubscription: true,
        IncludeSupport: true,
        IncludeTax: true,
        IncludeUpfront: true,
        UseAmortized: false,
        UseBlended: false
      },
      TimePeriod: {
        End: '2087-06-15T00:00:00.000Z',
        Start: '2020-01-01T00:00:00.000Z'
      }
    },
    NotificationsWithSubscribers: notificationsWithSubscribersRequest(alerts(owner))
  };
}

const notificationsWithSubscribersRequest = (alerts) => {
  return alerts.map(alert => {
    return {
      Notification: {
        ComparisonOperator: 'GREATER_THAN',
        NotificationType: alert.type,
        Threshold: alert.threshold,
        ThresholdType: 'PERCENTAGE'
      },
      Subscribers: alert.recipients.map(recipient => {
        return {
          Address: recipient,
          SubscriptionType: 'EMAIL'
        };
      })
    };
  });
}

const alerts = (owner) => {
  return owner ? [
    { type: 'ACTUAL', threshold: '50', recipients: [getOwnerEmail(owner)] },
    { type: 'ACTUAL', threshold: '80', recipients: [getOwnerEmail(owner)] },
    { type: 'ACTUAL', threshold: '100', recipients: [getOwnerEmail(owner)] },
    { type: 'FORECASTED', threshold: '120', recipients: [getOwnerEmail(owner)] }
  ] : [];
}

const getOwnerEmail = (owner) => {
  return owner.indexOf('@levi9.com') === -1 ? `${owner}@levi9.com` : owner;
}

module.exports = {
  syncAccounts,
  createBudget
};
