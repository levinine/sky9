import React, { useState, useEffect, useCallback } from 'react'
import './AccountsListView.css';
import ModalDialog from '../components/Modal';
import Table from '../components/tableView'


const AccountsListView = (props) => {

  const [deleteAccountID, setDeleteAccountID] = useState(null);
 

  const accounts = props.accounts;
    

  return (
    <div>
      <Table accounts={props.accounts} />
      
      <ModalDialog 
        show={deleteAccountID} 
        handleClose={() => setDeleteAccountID(null)} 
        handleDelete={() => {
          props.deleteAccount(deleteAccountID);
          setDeleteAccountID(null);
        }} 
        message="Are you sure you want to delete?" 
        title="Delete account" 
        buttonMessage="Delete"
      />
    </div>
  )
}

export default AccountsListView;

