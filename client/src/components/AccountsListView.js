import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types';
import SearchField from '../components/SearchField';
import ModalDialog from '../components/Modal';
import {  Button } from 'react-bootstrap';
import './AccountsListView.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';


const AccountsListView = (props) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(props.accounts);
  const [deleteAccountID, setDeleteAccountID] = useState(null);
  const accounts = props.accounts;
  
  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  useEffect(() => {
    const results = accounts.filter(account =>{
      const lowerCaseAccount = account.name.toLowerCase();
      const lowerCaseSearchTerm = (searchTerm).toLowerCase();
      return lowerCaseAccount.includes(lowerCaseSearchTerm);
    })
    setFilteredList(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, accounts])

  const columns = [{
    Header: 'Name',
    accessor: 'name' // String-based value accessors!
  }, {
    Header: 'Email',
    accessor: 'email',
  }, {
    Header: 'Status',
    accessor: 'status' // Custom value accessors!
  }, {
    Cell: row => (
      <div>
         <Button 
              variant="secondary" 
              onClick={() => props.handleShowChange("update", row.original)}>
                Edit
            </Button>
            <Button 
              variant ="danger" 
              onClick={() => setDeleteAccountID(row.original.id) }>
                Delete
            </Button> 
      </div>
  )
  }]

  return (
    <div>
      <SearchField onChange={handleChange} searchTerm={searchTerm} />
      <ReactTable 
        data={filteredList}
        columns={columns}
      />
      <ModalDialog 
        show={deleteAccountID} 
        handleClose={() => setDeleteAccountID(null)} 
        handleDelete={() => {
          props.deleteAccount(deleteAccountID);
          props.refreshList(deleteAccountID, "delete");
          setDeleteAccountID(null);
        }} 
        message="Are you sure you want to delete?" 
        title="Delete account" 
        buttonMessage="Delete"
      />
    </div>
  )
}

AccountsListView.propTypes = {
  accounts: PropTypes.array.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  handleShowChange: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired
}

export default AccountsListView;

