import { API } from 'aws-amplify';
import * as utils from '../components/utils';

const getAccounts = async () => {
  try {
    // TODO: uncomment before deployment
    // return await API.get('gcp-accounts', '/gcp/accounts');
    return utils.gcpMockAccounts;
  } catch (error) {
    console.log(error);
  }
  return [];
}

const getAccount = async id => {
  try {
    // TODO: uncomment before deployment
    // return await API.get('gcp-accounts', '/gcp/accounts/' + id);
    return utils.gcpMockAccounts[0];
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
