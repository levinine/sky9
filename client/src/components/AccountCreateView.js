import React from 'react'
import { createAccount } from '../service/accountService';
import AccountForm from './AccountForm';

const AccountCreate = (props) => {
  return <AccountForm 
            selectedAccount = {props.selectedAccount}
            stage={"Create new account"}
            apiFunction={createAccount} 
            validateEmail={props.validateEmail} 
            refreshList={props.refreshList}
          />  
}
export default AccountCreate;