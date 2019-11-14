import React, { Component } from 'react'
import AccountsListView from '../components/accountsListView';
import AccountCreateView from '../components/accountCreateView';
import { getAccounts } from '../service/apiCalls';

export default class AccountsView extends Component {
  constructor() {
    super();
    this.state = { accounts: [] };
  }

  async componentDidMount() {
   const accounts = await getAccounts();
   this.setState({
     accounts
   })
  }
  render() {     
    return (
        <div class='container-fluid'>
           <div class="row">
            <div class="col">
              <AccountCreateView />
            </div>
            <div class="col">
              <AccountsListView accounts={this.state.accounts}/>
            </div>
          </div>
              
         
        </div>
    )
  }
}
