import React from 'react'
import { createAccount } from '../service/accountService';
import AccountForm from './AccountForm';

const AccountCreate = (props) => {
  return <AccountForm 
            apiFunction={createAccount} 
            validateEmail={props.validateEmail} 
          />  
}
export default AccountCreate;