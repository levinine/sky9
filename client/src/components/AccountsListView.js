import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import SearchField from '../components/SearchField';
import './AccountsListView.css';

const AccountsListView = (props) => {
  const [filter, setFilter] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const accounts = props.accounts;
  const renderAccountsList = (accounts) => {
    return accounts.map((account) => (
      
        <ListGroupItem key={account.id} header={account.name}>
          <Link  to={`/accounts/` + account.id }>
          <span className="pull-left">
          {account.name} 
          </span>
          </Link>
          <button onClick={event => props.deleteAccount(account.id, event)}>Delete</button> 
        </ListGroupItem>     
      
    ))  
  }
  let renderedAccounts = renderAccountsList(props.accounts);
   
  const filterSearch = (event) => {
    setFilter(event.target.value);
    if(filter !== "") {
      const newList = accounts.filter(account =>{
        const lowerCaseAccount = account.name.toLowerCase();
        const lowerCaseFilter = (filter).toLowerCase();
        return lowerCaseAccount.includes(lowerCaseFilter);
      })
      setFilteredList(renderAccountsList(newList));
      return;
    } 
    renderedAccounts = renderAccountsList(accounts);
    setFilteredList([]);
  }

  return (
    <div>
      <SearchField filterSearch={filterSearch} filter={filter} />
      <ListGroup>{!filteredList.length > 0 && renderedAccounts} {filteredList}</ListGroup>
    </div>
    
  )
}

export default AccountsListView;
