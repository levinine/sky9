import React, { Component } from 'react'
import AccountsListView from '../components/AccountsListView';
import AccountCreateFormView from '../components/AccountCreateFormView';
import AccountUpdateFormView from '../components/AccountUpdateFormView';
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
      show:'Create new account'
    };
  }

  async componentDidMount() {
   const accounts = await getAccounts();
   if(accounts === null) {
    return;
   }
   this.setState({
     accounts
   })
  }

  handleViewChange = (showStage, selectedAccount) => {
    if(selectedAccount === null) {
      this.setState({
        show:showStage,
        account:{
          email: "",
          name: "",
          status: "Active",
          IAMUsers:[],
          id: ""
        }
      })
      return;
    }
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
    if(action === "Create new account"){
      this.setState({
        accounts: this.state.accounts.concat(account)
      })
    } else if (action === "delete") {
      this.setState({
        accounts: this.state.accounts.filter(a => a.id !== account)
      })
    } else if (action === "Update account") {
      const accountIndex = this.state.accounts.findIndex(acc => acc.id === account.id);
      this.setState((oldState) => {
          const newAccountList = [...oldState.accounts];
          newAccountList[accountIndex] = account;
          return { 
            accounts: newAccountList,
            account: newAccountList[accountIndex]
          };
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
               handleViewChange={this.handleViewChange}
               refreshList={this.refreshList}
               />
            </div>
            <div className="col">
              { this.state.show === 'Create new account' && 
                <AccountCreateFormView 
                refreshList={this.refreshList} 
                selectedAccount={this.state.account} 
                validateEmail={this.validateEmail} /> }

              { this.state.show === 'Update account' && 
                <AccountUpdateFormView 
                selectedAccount={this.state.account} 
                validateEmail={this.validateEmail}
                refreshList={this.refreshList}
                handleViewChange={this.handleViewChange} /> }
            </div>
          </div>
        </div>
    )
  }
}
