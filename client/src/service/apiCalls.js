import {API} from 'aws-amplify';

const getAccounts = async () => {
   const accounts = await API.get("accounts", "/accounts");
   return accounts.Items;
}

const createAccount = (account) => {
  const createdAccount = API.post('accounts', '/accounts', {
    body: account
  });
  return createdAccount;
}

export {
  getAccounts,
  createAccount
}