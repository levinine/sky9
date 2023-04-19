import { API } from 'aws-amplify';

const getAccounts = async () => {
  try {
    return await API.get('gcp-accounts', '/gcp/accounts');
  } catch (error) {
    console.log(error);
  }
  return [];
}

const getAccount = async id => {
  try {
    return await API.get('gcp-accounts', '/gcp/accounts/' + id);
  } catch (error) {
    console.log(error);
  }
}

const createAccount = account => {
  try {
    return API.post('gcp-accounts', '/gcp/accounts', {
      body: account
    });
  } catch (error) {
    console.log(error);
  }
}

const updateAccount = async account => {
  try {
    return await API.put('gcp-accounts', '/gcp/accounts/' + account.id, { body: account });
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
