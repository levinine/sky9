import React, { Component } from 'react'
import AccountsListView from '../components/AccountsListView';
import AccountCreateView from '../components/AccountCreateView';
import { getAccounts, deleteAccount } from '../service/accountService';

export default class AccountsView extends Component {
  constructor() {
    super();
    this.state = { 
      accounts: [],
      show: 'create' 
    };
  }

  async componentDidMount() {
   const accounts = await getAccounts();
   this.setState({
     accounts
   })
  }

  validateEmail = (email) => {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  deleteAccountHandler = (id, event) => {
      console.log(event);
      const del = deleteAccount(id);
      console.log(del);
  }

  render() {     
    return (
        <div className='container-fluid'>
           <div className="row">
            <div className="col">
              { this.state.show === 'create' && <AccountCreateView validateEmail={this.validateEmail} /> }
              { this.state.show === 'update' && <AccountCreateView validateEmail={this.validateEmail} /> }
            </div>
            <div className="col">
              <AccountsListView accounts={this.state.accounts} deleteAccount={this.deleteAccountHandler}/>
            </div>
          </div>
              
         
        </div>
    )
  }
}
