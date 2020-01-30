import {API} from 'aws-amplify';

const getAccounts = async () => {
  try {
    const accounts = await API.get("accounts", "/accounts");
    return accounts.Items;
  } catch(error) {
    console.log(error);
  }
  return [];
}

const getAccount = async id => {
  try {
    const get = await API.get("accounts",  "/accounts/" + id);
    return get.Item;
  } catch(error) {
    console.log(error);
  }
}

const createAccount = account => {
  try {
    const createdAccount = API.post('accounts', '/accounts', {
      body: account
    });
    return createdAccount;
  } catch(error) {
    console.log(error);
  }
}

const updateAccount = async account => {
  try {
    const updatedAccount = await API.put('accounts', '/accounts/' + account.id, {body:account});
    return updatedAccount.Attributes;
  } catch(error){
    console.log(error);
  }
}

const syncAccounts = async () => {
  try {
    await API.post('accounts', '/sync');
  } catch(error) {
    console.log(error);
  }
}

export {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  syncAccounts
}