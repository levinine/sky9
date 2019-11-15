import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import SearchField from '../components/SearchField';
import './AccountsListView.css';

const AccountsListView = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const accounts = props.accounts;
  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  const renderAccountsList = (accounts) => {
    return accounts.map((account) => (
      <Link key={account.id} to={`/accounts/` + account.id }>
        <ListGroupItem header={account.name}>
          <span className="pull-left">
          {account.name} 
          </span>
        </ListGroupItem>     
      </Link>
    ))  
  }
  const renderedAccounts = renderAccountsList(props.accounts);

  useEffect(() => {
    const results = accounts.filter(account =>{
      const lowerCaseAccount = account.name.toLowerCase();
      const lowerCaseSearchTerm = (searchTerm).toLowerCase();
      return lowerCaseAccount.includes(lowerCaseSearchTerm);
    })
    setFilteredList(renderAccountsList(results)); 
  }, [searchTerm])
  console.log(filteredList);
  return (
    <div>
      <SearchField onChange={handleChange} searchTerm={searchTerm} />
      <ListGroup>{filteredList.length === 0 ? renderedAccounts : filteredList} </ListGroup>
    </div>
    
  )
}

export default AccountsListView;
