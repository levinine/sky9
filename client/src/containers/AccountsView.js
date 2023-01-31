import React, { Component } from 'react';
import AwsAccountsListView from '../components/aws/AccountsListView';
import AwsAccountForm from '../components/aws/AccountForm';
import GcpAccountsListView from '../components/gcp/AccountsListView';
import GcpAccountForm from '../components/gcp/AccountForm';
import * as awsServices from '../service/awsAccountService';
import * as gcpServices from '../service/gcpAccountService';

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
      serviceHandler: awsServices
    };
  }

  setCloud = async (cloud) => {
    this.setState({
      activeCloud: cloud,
      serviceHandler: cloud === clouds.AWS ? awsServices : gcpServices
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

  componentDidMount() {
    this.fetchAccounts();
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
    const accounts = await this.state.serviceHandler.getAccounts();
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
      const account = await this.state.serviceHandler.getAccount(accountId);
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
            <div className='col-5'>
            <Form>
              <FormGroup>
                <Button className='mr-2 active' variant='warning' onClick={() => this.setCloud(clouds.AWS)}>AWS</Button>
                <Button className='mr-2' variant='secondary' onClick={() => this.setCloud(clouds.GCP)}>GCP</Button>
              </FormGroup>
            </Form>
            </div>
            <div className='col-7'>
              <h4>{this.state.activeCloud === clouds.AWS ? 'AWS Accounts' : 'GCP Accounts'}</h4>
            </div>
          </div>

          { this.state.activeCloud === clouds.AWS &&
            <div className='row'>
              <div className='col-10'>
                <AwsAccountsListView
                  accounts={this.state.accounts}
                  handleViewChange={this.handleViewChange}
                  refreshList={this.refreshList} />
              </div>
              <div className='col-2' hidden={this.state.show === 'Hide'}>
                <AwsAccountForm
                  stage={this.state.show}
                  account={this.state.account}
                  refreshList={this.refreshList}
                  apiFunction={
                    this.state.show === 'Create new account' ?
                    this.state.serviceHandler.createAccount : this.state.serviceHandler.updateAccount
                  }
                  handleViewChange={this.handleViewChange} />
              </div>            
            </div>
          }

          { this.state.activeCloud === clouds.GCP &&
            <div className='row'>
              <div className='col-10'>
                <GcpAccountsListView
                  accounts={this.state.accounts}
                  handleViewChange={this.handleViewChange}
                  refreshList={this.refreshList} />
              </div>
              <div className='col-2' hidden={this.state.show === 'Hide'}>
                <GcpAccountForm
                  stage={this.state.show}
                  account={this.state.account}
                  refreshList={this.refreshList}
                  apiFunction={
                    this.state.show === 'Create new account' ?
                    this.state.serviceHandler.createAccount : this.state.serviceHandler.updateAccount
                  }
                  handleViewChange={this.handleViewChange} />
              </div>
            </div>
          }


          {/* { this.state.activeCloud === clouds.AWS &&
            <DashboardAWS/>
          }

          { this.state.activeCloud === clouds.GCP &&
            <DashboardGCP/>
          } */}

        </div>
    )
  }
}
