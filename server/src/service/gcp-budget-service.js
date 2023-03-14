const { getGcpAuthClient, getGcpAccountKeys } = require('./gcp-auth-client-service');
const { budgetNameSuffix } = require('../utils');


const setBudgetForEmailNotification = async (account) => {
  console.log(`Setting GCP project budget for email notification ${JSON.stringify(account)}`);
  try {
    const gcpClient = await getGcpAuthClient();
    const url = `https://billingbudgets.googleapis.com/v1/billingAccounts/${process.env.GCP_BILLING_ACCOUNT_ID}/budgets`;
    const body = {
      "displayName": `${account.name}${budgetNameSuffix.EMAIL}`,
      "budgetFilter": {
        "projects": [
          `projects/${account.name}`
        ],
        "creditTypesTreatment": "EXCLUDE_ALL_CREDITS",
        "calendarPeriod": "MONTH"
      },
      "amount": {
        "specifiedAmount": {
          "currencyCode": "USD",
          "units": `${account.budget}`
        }
      },
      "thresholdRules": [
        { "thresholdPercent": 0.5, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.9, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.2, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.9, "spendBasis": "FORECASTED_SPEND" }
      ],
      "notificationsRule": {
        "monitoringNotificationChannels": [
          `${account.notificationChannelId}`
        ]
      }
    };
  
    await gcpClient.request({ method: 'POST', url, data: body });
    return account;
  } catch (error) {
    console.log('Setting of project budget for email notification failed', error);
    throw error;
  }
}

const setBudgetForPubSubNotification = async (account) => {
  console.log(`Setting GCP project budget for pubsub notification ${JSON.stringify(account)}`);
  try {
    const gcpClient = await getGcpAuthClient();
    const gcpAccountKeys = await getGcpAccountKeys();
    const url = `https://billingbudgets.googleapis.com/v1/billingAccounts/${process.env.GCP_BILLING_ACCOUNT_ID}/budgets`;
    const body = {
      "displayName": `${account.name}${budgetNameSuffix.PUBSUB}`,
      "budgetFilter": {
        "projects": [
          `projects/${account.name}`
        ],
        "creditTypesTreatment": "EXCLUDE_ALL_CREDITS",
        "calendarPeriod": "MONTH"
      },
      "amount": {
        "specifiedAmount": {
          "currencyCode": "USD",
          "units": `${account.budget}`
        }
      },
      "thresholdRules": [
        { "thresholdPercent": 0.1, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.2, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.3, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.4, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.5, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.6, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.7, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.8, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 0.9, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.0, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.1, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.2, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.3, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.4, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.5, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.6, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.7, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 1.8, "spendBasis": "CURRENT_SPEND" },
        { "thresholdPercent": 2.0, "spendBasis": "CURRENT_SPEND" },
      ],
      "notificationsRule": {
        "pubsubTopic": `projects/${gcpAccountKeys.project_id}/topics/${process.env.GCP_PUBSUB_TOPIC_ID}`,
        "schemaVersion": "1.0",
      }
    };
  
    await gcpClient.request({ method: 'POST', url, data: body });
    return account;
  } catch (error) {
    console.log('Setting of project budget for pubsub notification failed', error);
    throw error;
  }
}


const getBudgetList = async () => {
  console.log('Getting GCP budget list');
  try {
    const gcpClient = await getGcpAuthClient();
    const url = `https://billingbudgets.googleapis.com/v1/billingAccounts/${process.env.GCP_BILLING_ACCOUNT_ID}/budgets`;
    let response = {};
    let budgets = [];
    let nextToken = null;

    // use next token to get all pages/budgets
    do {
      response = await gcpClient.request({ method: 'GET', url: !nextToken ? url : `${url}?pageToken=${nextToken}` });
      budgets.push(response.budgets);
      nextToken = response.nextPageToken ? response.nextPageToken : null;
    } while (nextToken);

    return budgets;
  } catch (error) {
    console.log('Getting budget list failed', error);
    throw error;
  }
}

const updateBudget = async (budget, newAmount) => {
  console.log(`Updating GCP project budget amount, new amount: ${newAmount}, budget: ${JSON.stringify(budget)}`);
  try {
    const gcpClient = await getGcpAuthClient();
    const url = `https://billingbudgets.googleapis.com/v1/billingAccounts/${process.env.GCP_BILLING_ACCOUNT_ID}/budgets/${budget.name}`;
    const body = {
      amount: budget.amount
    };
    body.amount.specifiedAmount.units = `${newAmount}`;
    return await gcpClient.request({ method: 'PATCH', url, data: body });
  } catch (error) {
    console.log('Updating budget failed', error);
    throw error;
  }
}

module.exports = {
  setBudgetForEmailNotification,
  setBudgetForPubSubNotification,
  getBudgetList,
  updateBudget
};
