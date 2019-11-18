import React, { useState, useEffect, useCallback } from 'react'
import {  Button } from 'react-bootstrap';
import SearchField from '../components/SearchField';
import './AccountsListView.css';
import ModalDialog from '../components/Modal';

const AccountsListView = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [deleteAccountID, setDeleteAccountID] = useState(null);
  const accounts = props.accounts;
  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  const renderAccountsList = useCallback(
    (accounts) => {
      return accounts.map((account,index) => (
        <tr data-href={'/accounts/' + account.id} key={account.id}>
          <th scope="row">{index + 1}</th>
          <td>{account.name}</td>
          <td>{account.email}</td>
          <td>{account.status}</td>
          <td>{account.IAMUsers.length}</td>
          <td> 
            <Button 
              variant="secondary" 
              onClick={() => props.handleShowChange("update", account)}>
                Edit
            </Button>
            <Button 
              variant ="danger" 
              onClick={() => setDeleteAccountID(account.id) }>
                Delete
            </Button> 
            
          </td> 
        </tr>
    ))  
    }, [props]);

  const renderedAccounts = renderAccountsList(props.accounts);

  useEffect(() => {
    const results = accounts.filter(account =>{
      const lowerCaseAccount = account.name.toLowerCase();
      const lowerCaseSearchTerm = (searchTerm).toLowerCase();
      return lowerCaseAccount.includes(lowerCaseSearchTerm);
    })
    setFilteredList(renderAccountsList(results)); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, accounts])

  return (
    <div>
      <SearchField onChange={handleChange} searchTerm={searchTerm} />
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Status</th>
            <th scope="col"># IAM Users</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? renderedAccounts : filteredList}
        </tbody>
      </table>
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

export default AccountsListView;

