import React from 'react';
import PropTypes from 'prop-types';
import AccountForm from './AccountForm';
import { updateAccount } from '../service/accountService';

const UpdateAccountView = props => {
  return <AccountForm
    stage={"Update account"} 
    selectedAccount={props.selectedAccount} 
    validateEmail={props.validateEmail}
    refreshList={props.refreshList}
    apiFunction={updateAccount}
  />  
}

UpdateAccountView.propTypes = {
  selectedAccount: PropTypes.object.isRequired,
  validateEmail: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired
}

export default UpdateAccountView;