import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import AccountsListView from '../components/AccountsListView';
import AccountCreateFormView from '../components/AccountCreateFormView';
import AccountUpdateFormView from '../components/AccountUpdateFormView';
import { getAccounts, deleteAccount } from '../service/accountService';

const cognitoUrl = 'https://sky9.auth.eu-west-2.amazoncognito.com';
const clientId = '7g6mk1iukh6cl2h1mosgo0ucie';
const appUrl = 'http://localhost:3000';

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

  login = () => {
    window.location.href = `${cognitoUrl}/oauth2/authorize?identity_provider=levi9&redirect_uri=${appUrl}&response_type=TOKEN&client_id=${clientId}&scope=openid`;
  }

  logout = () => {
    localStorage.removeItem('token');
    window.location.href = `${cognitoUrl}/logout?logout_uri=${appUrl}&client_id=${clientId}`;
  }

  getUser = () => {
    const token = localStorage.getItem('token');
    return token ? jwt_decode(token).email : null;
  }

  render() {     
    return (
        <div className='container-fluid'>
           <div className="row">
              { this.getUser() === null && <Button variant="primary" onClick={this.login}>Login</Button> }
              { this.getUser() !== null && <Button variant="primary" onClick={this.logout}>Logout ({this.getUser()})</Button> }
           </div>
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
                <AccountCreateFormView 
                refreshList={this.refreshList} 
                selectedAccount={this.state.account} 
                validateEmail={this.validateEmail} /> }

              { this.state.show === 'update' && 
                <AccountUpdateFormView 
                selectedAccount={this.state.account} 
                validateEmail={this.validateEmail}
                refreshList={this.refreshList} /> }
            </div>
          </div>
        </div>
    )
  }
}
