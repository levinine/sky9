import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import SearchField from '../components/SearchField';
import './AccountsListView.css';

const AccountsListView = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const accounts = props.accounts;
  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  const renderAccountsList = useCallback(
    (accounts) => {
      return accounts.map((account) => (
        <ListGroupItem key={account.id} header={account.name}>
          <Link  to={`/accounts/` + account.id }>
          <span className="pull-left">
          {account.name} 
          </span>
          </Link>
          <Button variant="secondary" onClick={() => props.handleShowChange("update", account)}>Edit</Button>
          <Button variant ="danger" onClick={event => props.deleteAccount(account.id, event)}>Delete</Button> 
        </ListGroupItem>     
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
      <ListGroup>{filteredList.length === 0 ? renderedAccounts : filteredList} </ListGroup>
    </div>
    
  )
}

export default AccountsListView;
