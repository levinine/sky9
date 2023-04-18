import React, { Component } from 'react';
import AwsAccountsListView from '../components/aws/AccountsListView';
import AwsAccountForm from '../components/aws/AccountForm';
import GcpAccountsListView from '../components/gcp/AccountsListView';
import GcpAccountForm from '../components/gcp/AccountForm';
import * as awsServices from '../service/awsAccountService';
import * as gcpServices from '../service/gcpAccountService';
import { getUser, login } from '../service/authenticationService';

import { Form, FormGroup, Button } from 'react-bootstrap';

const clouds = {
  AWS: 'aws',
  GCP: 'gcp',
}
export default class AccountsView extends Component {
  constructor() {
    super();
    this.state = {
      accounts: [],
      account: this.emptyAccount(),
      show: 'Hide',
      activeCloud: clouds.AWS,
      serviceHandler: awsServices,
      user: null,
      loading: false
    };
  }

  componentDidMount() {
    this.fetchAccounts();
    getUser().then(user => {
      let email = null;
      if (user) {
        if (user.signInUserSession.idToken.payload.email) {
          email = user.signInUserSession.idToken.payload.email;
        } else {
          email = 'CA User';
        }
      }
      this.setState({ user: email });
    });
  }

  setCloud = async (cloud) => {
    this.setState({
      activeCloud: cloud,
      serviceHandler: cloud === clouds.AWS ? awsServices : gcpServices,
      show: 'Hide'
    });
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

  refreshList = () => {
    this.fetchAccounts();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.activeCloud !== this.state.activeCloud) {
      this.fetchAccounts();
    }
  }

  fetchAccounts = async () => {
    this.setState({
      loading: true
    });
    const accounts = await this.state.serviceHandler.getAccounts();
    this.setState({
      accounts: accounts || [], // this.state.accounts
      loading: false
    });
  }

  handleViewChange = async (showStage, accountId) => {
    if (accountId === null) {
      this.setState({
        show: showStage,
        account: this.emptyAccount()
      });
    } else {
      const account = await this.state.serviceHandler.getAccount(accountId);
      this.setState({
        show: showStage,
        account: Object.assign(this.emptyAccount(), account)
      });
    }
  }


  render() {
    return (
      <>
      { this.state.user ? (
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-2'>
              <Form>
                <FormGroup>
                  <Button className='mr-2 active' variant={this.state.activeCloud === clouds.AWS ? 'warning' : 'secondary'} onClick={() => this.setCloud(clouds.AWS)}>AWS</Button>
                  <Button className='mr-2' variant={this.state.activeCloud === clouds.GCP ? 'warning' : 'secondary'} onClick={() => this.setCloud(clouds.GCP)}>GCP</Button>
                </FormGroup>
              </Form>
            </div>
            <div className='col-8 text-center'>
              <h4>{this.state.activeCloud === clouds.AWS ? 'AWS Accounts' : 'GCP Accounts'}</h4>
            </div>
            <div className='col-2 text-right'>
              <img src={`${this.state.activeCloud === clouds.AWS ? "aws-logo.png" : "gcp-logo.png"}`} max-width="100%" max-height="100%" className="rounded float-right" alt="logo" />
            </div>
          </div>

          { (this.state.activeCloud === clouds.AWS) &&
            <div className='row'>
              { this.state.loading ?
                (
                  <div className={`${this.state.show !== 'Hide' ? 'col-10' : 'col-12'} text-center`}>
                    <div className="spinner-grow" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                <div className='col-10'>
                  <AwsAccountsListView
                    accounts={this.state.accounts || []}
                    handleViewChange={this.handleViewChange}
                    refreshList={this.refreshList} />
                </div>
                )
              }
              <div className='col-2' hidden={this.state.show === 'Hide'}>
                <AwsAccountForm
                  stage={this.state.show}
                  account={this.state.account}
                  refreshList={this.refreshList}
                  apiFunction={
                    this.state.show === 'Create new AWS account' || 'Create new GCP account' ?
                    this.state.serviceHandler.createAccount : this.state.serviceHandler.updateAccount
                  }
                  handleViewChange={this.handleViewChange} />
              </div>
            </div>
          }

          { (this.state.activeCloud === clouds.GCP) &&
            <div className='row'>
              { this.state.loading ?
                (
                  <div className={`${this.state.show !== 'Hide' ? 'col-10' : 'col-12'} text-center`}>
                    <div className="spinner-grow" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className='col-10'>
                    <GcpAccountsListView
                      accounts={this.state.accounts || []}
                      handleViewChange={this.handleViewChange}
                      refreshList={this.refreshList} />
                  </div>
                )
              }
              <div className='col-2' hidden={this.state.show === 'Hide'}>
                <GcpAccountForm
                  stage={this.state.show}
                  account={this.state.account}
                  refreshList={this.refreshList}
                  apiFunction={
                    this.state.show === 'Create new AWS account' || 'Create new GCP account' ?
                    this.state.serviceHandler.createAccount : this.state.serviceHandler.updateAccount
                  }
                  handleViewChange={this.handleViewChange} />
              </div>
            </div>
          }
        </div>
        ) : (
          <div className='container-fluid'>
            <div className="jumbotron">
                <h1 className="display-4">Welcome to Sky9 app!</h1>
                <p className="lead">You could create new or manage existing AWS and GCP accounts.</p>
                <p>if you want to start experiencing, please log in.</p>
                <p className="lead">
                <button className="btn btn-primary btn-lg" onClick={login}>Login</button>
                </p>
            </div>
          </div>
        )
      }
    </>
  )}
}
