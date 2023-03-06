const { getGcpAuthClient, getGcpAccountKeys } = require('./gcp-auth-client-service');

const setBudgetForEmailNotification = async (account) => {
  console.log(`Setting GCP project budget for email notification ${JSON.stringify(account)}`);
  try {
    const gcpClient = await getGcpAuthClient();
    const url = `https://billingbudgets.googleapis.com/v1/billingAccounts/${process.env.GCP_BILLING_ACCOUNT_ID}/budgets`;
    const body = {
      "displayName": `${account.name}-budget-email`,
      "budgetFilter": {
        "projects": [
          `projects/${account.name}`
        ],
        "creditTypesTreatment": "INCLUDE_ALL_CREDITS",
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
      "displayName": `${account.name}-budget-pubsub`,
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

module.exports = {
  setBudgetForEmailNotification,
  setBudgetForPubSubNotification
};
