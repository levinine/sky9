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
const deleteAccount = async id => {
  const deletedAccount = await API.del('accounts', '/accounts/' + id);
  console.log(id);
  console.log(deletedAccount);
  return deletedAccount;
}

export {
  getAccounts,
  createAccount,
  deleteAccount
}