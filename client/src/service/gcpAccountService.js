import { API } from 'aws-amplify';
import * as utils from '../components/utils';

const getAccounts = async () => {
  try {
    // const accounts = await API.get('accounts', '/accounts');
    // return accounts;
    console.log('GCP GET ACCOUNTS');
    return utils.gcpMockAccounts;
  } catch (error) {
    console.log(error);
  }
  return [];
}

const getAccount = async id => {
  try {
    // const account = await API.get('accounts', '/accounts/' + id);
    // return account;
    console.log('GCP GET ACCOUN');
    return {};
  } catch (error) {
    console.log(error);
  }
}

const createAccount = account => {
  try {
    // const createdAccount = API.post('accounts', '/accounts', {
    //   body: account
    // });
    // return createdAccount;
    console.log('GCP CREATE ACCOUNT');
    return {};
  } catch (error) {
    console.log(error);
  }
}

const updateAccount = async account => {
  try {
    // const updatedAccount = await API.put('accounts', '/accounts/' + account.id, { body: account });
    // return updatedAccount;
    console.log('GCP UPDATE ACCOUNT');
    return {};
  } catch (error) {
    console.log(error);
  }
}

const syncAccounts = async () => {
  try {
    // await API.post('accounts', '/sync-accounts');
    console.log('GCP SYNC ACCOUNTS');
  } catch (error) {
    console.log(error);
  }
}

const syncBudgets = async () => {
  try {
    // await API.post('accounts', '/sync-budgets');
    console.log('GCP SYNC BUDGETS');
  } catch (error) {
    console.log(error);
  }
}

const syncOwners = async () => {
  try {
    // await API.post('accounts', '/sync-owners');
    console.log('GCP SYNC OWNERS');
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
