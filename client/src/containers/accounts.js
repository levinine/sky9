import React, { Component } from 'react'
import AccountsList from '../components/accountsListView';
import {API} from 'aws-amplify';

export default class accounts extends Component {
  constructor() {
    super();
    this.state = { accounts: [] };
  }

  componentDidMount() {
    API.get("accounts", "/accounts")
    .then(response => {
      this.setState({
        accounts:response.Items
      })
    })
  }
  
  render() {     
    return (
        <div>
          <AccountsList accounts={this.state.accounts}/>    
        </div>
    )
  }
}
