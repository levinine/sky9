import React, { Component } from 'react'
import AccountsListView from '../components/AccountsListView';
import AccountCreateView from '../components/AccountCreateView';
import AccountUpdateView from '../components/AccountUpdateView';
import { getAccounts, deleteAccount } from '../service/accountService';

export default class AccountsView extends Component {
  constructor() {
    super();
    this.state = { 
      accounts: [],
      account:{
        email: "",
        name: "",
        status: "Active",
        IAMUsers:[],
        id: ""
      },
      show:'create'
    };
  }

  async componentDidMount() {
   const accounts = await getAccounts();
   this.setState({
     accounts
   })
  }

  handleShowChange = (showStage, selectedAccount) => {
    this.setState({
      show: showStage,
      account: {
        name: selectedAccount.name,
        email: selectedAccount.email,
        status: selectedAccount.status,
        IAMUsers: selectedAccount.IAMUsers,
        id: selectedAccount.id
      }
    })
  }

  deleteAccountHandler = id => {
    return deleteAccount(id);
  }

  validateEmail = (email) => {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  refreshList = (account, action) => {
    if(action === "create"){
      this.setState({
        accounts: this.state.accounts.concat(account)
      })
    } else if (action === "delete") {
      //in the case of delete account we receive only ID 
      this.setState({
        accounts: this.state.accounts.filter(a => a.id !== account)
      })
    } else if (action === "update") {
      
      this.setState({
        
      })
    }
  }

  render() {     
    return (
        <div className='container-fluid'>
           <div className="row">
            <div className="col">
              <AccountsListView
               accounts={this.state.accounts} 
               deleteAccount={this.deleteAccountHandler} 
               handleShowChange={this.handleShowChange}
               refreshList={this.refreshList}
               />
            </div>
            <div className="col">
              { this.state.show === 'create' && 
                <AccountCreateView 
                refreshList={this.refreshList} 
                selectedAccount={this.state.account} 
                validateEmail={this.validateEmail} /> }

              { this.state.show === 'update' && 
                <AccountUpdateView 
                selectedAccount={this.state.account} 
                validateEmail={this.validateEmail} /> }
            </div>
          </div>
        </div>
    )
  }
}
