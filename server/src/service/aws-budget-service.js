const AWS = require('aws-sdk');

const sts = new AWS.STS();
const budgets = new AWS.Budgets();

let masterAccountId;
const getMasterAccountId = async () => {
  if (!masterAccountId) {
    const callerIdentity = await sts.getCallerIdentity().promise();
    masterAccountId = callerIdentity.Account;
  }
  return masterAccountId;
}

const createBudget = async (accountId, accountName, owner, budget) => {
  console.log(`Account ${accountName} -> Creating budget with limit USD${budget}`);
  const b = await budgetRequest(accountId, accountName, owner, budget);
  const createBudgetRequest = await budgets.createBudget(b).promise();
  return createBudgetRequest;
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
  return owner.indexOf(`@${process.env.ORGANIZATION_DOMAIN}`) === -1 ? `${owner}@${process.env.ORGANIZATION_DOMAIN}` : owner;
}

module.exports = {
  createBudget
};
