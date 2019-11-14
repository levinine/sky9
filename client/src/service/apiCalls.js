import {API} from 'aws-amplify'

const updateAccount = async(account) => {
    try{
       const up =  await API.put('accounts', '/accounts/c8e455a0-053e-11ea-a6fc-9d92540b60af', account)
       console.log(up);
      } catch(error){
          console.log(error);
      } 
}

const getAccount =  id => {
    try{
        const get =  API.get("accounts",  "/accounts/c8e455a0-053e-11ea-a6fc-9d92540b60af")
        return get;
    }catch(error){
        console.log(error);
    }
}
export {
    updateAccount,
    getAccount
}