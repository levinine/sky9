const { getGcpAuthClient, getGcpAccountKeys } = require('./gcp-auth-client-service');

const acknowledgeMessages = async (ids) => {
  const gcpClient = await getGcpAuthClient();
  const gcpAccountKeys = await getGcpAccountKeys();

  const subscription = `projects/${gcpAccountKeys.project_id}/subscriptions/${process.env.GCP_BUDGET_PUBSUB_SUBSCRIPTION_ID}`;
  const url = `https://pubsub.googleapis.com/v1/${subscription}:acknowledge`
  const body = {
    ackIds: ids
  };
  return await gcpClient.request({ method: 'POST', url, data: body});
}
  
const getMessages = async () => {
  const gcpClient = await getGcpAuthClient();
  const gcpAccountKeys = await getGcpAccountKeys();

  const subscription = `projects/${gcpAccountKeys.project_id}/subscriptions/${process.env.GCP_BUDGET_PUBSUB_SUBSCRIPTION_ID}`;
  const url = `https://pubsub.googleapis.com/v1/${subscription}:pull`;
  const body = {
    maxMessages: 1000
  };
  return await gcpClient.request({ method: 'POST', url, data: body});
}

module.exports = {
  acknowledgeMessages,
  getMessages
};
