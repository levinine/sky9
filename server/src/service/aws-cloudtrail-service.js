const AWS = require('aws-sdk');

const cloudtrail = new AWS.CloudTrail();

const findProvisionedAccounts = async () => {
  console.log('Finding provisioned accounts in CloudTrail');
  let events = [];
  let nextToken = null;
  do {
    const params = {
      LookupAttributes: [{
        AttributeKey: 'EventName',
        AttributeValue: 'ProvisionProduct'
      }],
      MaxResults: 20, // max 50
      NextToken: nextToken,
    };
    const eventsResponse = await cloudtrail.lookupEvents(params).promise();
    nextToken = eventsResponse.NextToken;
    events.push(...eventsResponse.Events);
  } while (nextToken);

  // console.log('Events for Provisioning Accounts found in CloudTrail:', JSON.stringify(events.map(e => JSON.parse(e.CloudTrailEvent)), null, 2));

  return events.map(event => {
    const cloudtrailEvent = JSON.parse(event.CloudTrailEvent);
    const name = getParameterValue(cloudtrailEvent, 'AccountName');
    const productName = cloudtrailEvent.requestParameters.provisionedProductName;
    const email = getParameterValue(cloudtrailEvent, 'AccountEmail')
    const owner = getTagValue(cloudtrailEvent, 'owner');
    const ownerFirstName = getParameterValue(cloudtrailEvent, 'SSOUserFirstName')
    const ownerLastName = getParameterValue(cloudtrailEvent, 'SSOUserLastName')
    const budget = getTagValue(cloudtrailEvent, 'budget');
    const provisionToken = cloudtrailEvent.requestParameters.provisionToken;
    const principal = cloudtrailEvent.userIdentity.principalId
    const createdBy = principal.split(':').length === 2 ? principal.split(':')[1] : principal;
    return { name, productName, email, owner, ownerFirstName, ownerLastName, budget, provisionToken, createdBy };
  });
}

const getParameterValue = (cloudtrailEvent, key) => {
  return cloudtrailEvent.requestParameters.provisioningParameters.find(p => p.key === key).value;
}
const getTagValue = (cloudtrailEvent, key) => {
  if (cloudtrailEvent.requestParameters.tags) {
    const tag = cloudtrailEvent.requestParameters.tags.find(t => t.key === key);
    return tag ? tag.value : undefined;
  } else {
    return undefined;
  }
}

module.exports = {
  findProvisionedAccounts
};
