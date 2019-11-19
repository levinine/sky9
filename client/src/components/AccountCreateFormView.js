import React from 'react'
import PropTypes from 'prop-types';
import { createAccount } from '../service/accountService';
import AccountForm from './AccountForm';

const AccountCreate = (props) => {
  return <AccountForm 
            stage={"Create new account"}
            selectedAccount={props.selectedAccount} 
            validateEmail={props.validateEmail}
            refreshList={props.refreshList}
            apiFunction={createAccount}
          />  
}

AccountCreate.propTypes = {
  selectedAccount: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
  validateEmail: PropTypes.func.isRequired
}

export default AccountCreate;