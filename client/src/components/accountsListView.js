import React from 'react'
import { Link } from 'react-router-dom';

const accountsListView = (props) => {
  const accounts = props.accounts;
  return accounts.map((account) => (
     <Link key={account.id} to={`/accounts/` + account.id }>
       {account.name}    
     </Link>
  ))  
}

export default accountsListView;
