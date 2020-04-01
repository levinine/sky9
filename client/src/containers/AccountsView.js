import React, { Component } from 'react';
import AccountsListView from '../components/AccountsListView';
import AccountForm from '../components/AccountForm';
import { createAccount, getAccounts, getAccount, updateAccount } from '../service/accountService';

export default class AccountsView extends Component {
  constructor() {
    super();
    this.state = {
      accounts: [],
      account: this.emptyAccount(),
      show: 'Hide'
    };
  }

  emptyAccount = () => {
    return {
      id: '',
      name: '',
      email: '',
      owner: '',
      ownerFirstName: '',
      ownerLastName: '',
      budget: ''
    }
  }

  componentDidMount() {
    this.fetchAccounts();
  }

  refreshList = () => {
    this.fetchAccounts();
  }

  fetchAccounts = async () => {
    const accounts = await getAccounts();
    if (accounts !== null) {
      this.setState({
        accounts
      });
    }
  }

  handleViewChange = async (showStage, accountId) => {
    if (accountId === null) {
      this.setState({
        show: showStage,
        account: this.emptyAccount()
      });
    } else {
      const account = await getAccount(accountId);
      this.setState({
        show: showStage,
        account: Object.assign(this.emptyAccount(), account)
      });
    }
  }

  render() {
    return (
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-10'>
              <AccountsListView
                accounts={this.state.accounts}
                handleViewChange={this.handleViewChange}
                refreshList={this.refreshList} />
            </div>
            <div className='col-2' hidden={this.state.show === 'Hide'}>
              <AccountForm
                stage={this.state.show}
                account={this.state.account}
                refreshList={this.refreshList}
                apiFunction={this.state.show === 'Create new account' ? createAccount : updateAccount}
                handleViewChange={this.handleViewChange} />
            </div>
          </div>
        </div>
    )
  }
}
