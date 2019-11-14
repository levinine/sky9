import React from 'react'
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Form } from 'react-bootstrap';
import './accountsListView.css';

const accountsListView = (props) => {
  const accounts = props.accounts;
  const accountsList = accounts.map((account) => (
    <Link key={account.id} to={`/accounts/` + account.id }>
      <ListGroupItem header={account.name}>
        <span className="pull-left">
        {account.name} 
        </span>
        <span className="pull-right">
          ajajajajjja puertoriccoooo
        </span> 
      </ListGroupItem>     
    </Link>
  ))  
  return (
    <div>
      <Form>
        {/* //dodaj search */}
      </Form>
      <ListGroup>{accountsList}</ListGroup>
    </div>
    
  )
}

export default accountsListView;
