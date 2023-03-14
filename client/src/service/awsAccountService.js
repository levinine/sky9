import { API } from 'aws-amplify';
import * as utils from '../components/utils';

const getAccounts = async () => {
  try {
    console.log('AWS GET ACCOUNTS');
    // TODO: uncomment before deployment
    // return await API.get('accounts', '/accounts');
    return utils.awsMocksAccounts; 
  } catch (error) {
    console.log(error);
  }
}

const getAccount = async id => {
  try {
    // TODO: uncomment before deployment
    // return = await API.get('accounts', '/accounts/' + id);
    return utils.awsMocksAccounts[0]; 
  } catch (error) {
    console.log(error);
  }
}

const createAccount = account => {
  try {
    return API.post('accounts', '/accounts', {
      body: account
    });
  } catch (error) {
    console.log(error);
  }
}

const updateAccount = async account => {
  try {
    return await API.put('accounts', '/accounts/' + account.id, { body: account });
  } catch (error) {
    console.log(error);
  }
}

const syncAccounts = async () => {
  try {
    await API.post('accounts', '/sync-accounts');
  } catch (error) {
    console.log(error);
  }
}

const syncBudgets = async () => {
  try {
    await API.post('accounts', '/sync-budgets');
  } catch (error) {
    console.log(error);
  }
}

const syncOwners = async () => {
  try {
    await API.post('accounts', '/sync-owners');
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
