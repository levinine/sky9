import React from 'react';
import PropTypes from 'prop-types';
import AccountForm from './AccountForm';
import { updateAccount, getAccount } from '../service/accountService';

const UpdateAccountView = props => {
  return <AccountForm
    stage={"Update account"} 
    selectedAccount={props.selectedAccount} 
    validateEmail={props.validateEmail}
    refreshList={props.refreshList}
    apiFunction={updateAccount}
    getAccount={getAccount}
    handleViewChange={props.handleViewChange}
  />  
}

UpdateAccountView.propTypes = {
  selectedAccount: PropTypes.object.isRequired,
  validateEmail: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  handleViewChange: PropTypes.func.isRequired 
}

export default UpdateAccountView;