import React from 'react'
import { Link } from 'react-router-dom';
import AccountCardView from './accountCardView';

const accountsListView = (props) => {
  const accounts = props.accounts;
  return accounts.map((account) => (
     <Link key={account.id} to={`/accounts/` + account.id }>
        <AccountCardView account={account}/>
     </Link>
  ))  
}

export default accountsListView;
