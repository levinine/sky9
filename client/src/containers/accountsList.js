import React, { Component } from 'react'
import AccountsList from '../components/accountsListView';
import {API} from 'aws-amplify';
import "../App.css"
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
        <div className="App">
          <h1>Accounts</h1>
            <AccountsList accounts={this.state.accounts}/>     
        </div>
    )
  }
}
