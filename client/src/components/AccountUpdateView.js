import React from 'react';
import AccountForm from './AccountForm';
import { updateAccount } from '../service/accountService';

const UpdateAccountView = props => {
  return <AccountForm
    selectedAccount={props.selectedAccount}
    stage={"Update account"} 
    apiFunction={updateAccount} 
    validateEmail={props.validateEmail} 
  />  
}

export default UpdateAccountView;