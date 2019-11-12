import React from 'react'
import {API} from 'aws-amplify';
import { ListGroupItem } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';


const getAccounts = () =>{
  return API.get("accounts", "/accounts");
}

const renderAccountList = (accounts) => {
  console.log(accounts.Items);
  accounts.Items.map((account) => (
      <Link key={account.id} to={`/accounts/` + account.id }>
        <ListGroupItem header={account.name}>
        </ListGroupItem>
      </Link>
  ))  
}

const accountsListView = async () => {
  const accounts = await getAccounts();
  const  a = renderAccountList(accounts);
  console.log(a);
  return (
    <div>
    </div>
  )
}

export default accountsListView;
