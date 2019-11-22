import React, { Component } from 'react'
import AccountsListView from '../components/AccountsListView';
import AccountCreateFormView from '../components/AccountCreateFormView';
import AccountUpdateFormView from '../components/AccountUpdateFormView';
import { getAccounts, deleteAccount, getAccount } from '../service/accountService';

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
   this.fetchAccounts();
  }

  refreshList = () => {
    this.fetchAccounts();
  }

  fetchAccounts = async () => {
  const accounts = await getAccounts();
   if(accounts === null) {
    return;
   }
   this.setState({
     accounts
   })
  }

  handleViewChange = async (showStage, accountID) => {  
    if(accountID === null) {
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
    const selectedAccount  = await getAccount(accountID);
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
