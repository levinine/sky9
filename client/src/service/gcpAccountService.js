import { API } from 'aws-amplify';

const getAccounts = async () => {
  try {
    const accounts = await API.get('gcp-accounts', '/gcp/accounts');
    return accounts;
    // return utils.gcpMockAccounts;
  } catch (error) {
    console.log(error);
  }
  return [];
}

const getAccount = async id => {
  try {
    const account = await API.get('gcp-accounts', '/gcp/accounts/' + id);
    return account;
  } catch (error) {
    console.log(error);
  }
}

const createAccount = account => {
  try {
    const createdAccount = API.post('gcp-accounts', '/gcp/accounts', {
      body: account
    });
    return createdAccount;
  } catch (error) {
    console.log(error);
  }
}

const updateAccount = async account => {
  try {
    // const updatedAccount = await API.put('gcp-accounts', '/accounts/' + account.id, { body: account });
    // return updatedAccount;
    console.log('GCP UPDATE ACCOUNT');
    return {};
  } catch (error) {
    console.log(error);
  }
}

const syncAccounts = async () => {
  try {
    await API.post('gcp-accounts', '/gcp/sync-accounts');
  } catch (error) {
    console.log(error);
  }
}

const syncBudgets = async () => {
  try {
    await API.post('gcp-accounts', '/gcp/sync-budgets');
  } catch (error) {
    console.log(error);
  }
}

const syncOwners = async () => {
  try {
    await API.post('gcp-accounts', '/gcp/sync-owners');
  } catch (error) {
    console.log(error);
  }
}

export {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  syncAccounts,
  syncBudgets,
  syncOwners
}
