const AWS = require('aws-sdk');

const organizations = new AWS.Organizations({ region: 'us-east-1' });

const getAccountByName = async (name) => {
  const accounts = await getOrganizationAccounts();
  return accounts.find(account => account.Name === name);
}

const getOrganizationAccounts = async () => {
  console.log('Finding linked accounts in AWS Organizations');
  let accounts = [];
  let nextToken = null;
  do {
    const listAccountsResponse = await organizations.listAccounts({ MaxResults: 20, NextToken: nextToken }).promise();
    accounts.push(...listAccountsResponse.Accounts);
    nextToken = listAccountsResponse.NextToken;
  } while (nextToken);
  // console.log('Linked accounts', JSON.stringify(listAccountsResponse));
  return accounts;
}

module.exports = {
  getAccountByName,
  getOrganizationAccounts
};
