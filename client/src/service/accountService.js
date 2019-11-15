import {API} from 'aws-amplify';

const getAccounts = async () => {
   const accounts = await API.get("accounts", "/accounts");
   return accounts.Items;
}

const getAccount =  id => {
  try{
      const get =  API.get("accounts",  "/accounts/c8e455a0-053e-11ea-a6fc-9d92540b60af")
      return get;
  }catch(error){
      console.log(error);
  }
}

const createAccount = (account) => {
  const createdAccount = API.post('accounts', '/accounts', {
    body: account
  });
  return createdAccount;
}

const updateAccount = async(account) => {
  try{
     const up =  await API.put('accounts', '/accounts/c8e455a0-053e-11ea-a6fc-9d92540b60af', account)
     console.log(up);
    } catch(error){
        console.log(error);
    } 
}

export {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount
}