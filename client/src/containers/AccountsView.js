import React, { useState, useEffect } from 'react';
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
const AccountsView = () => {

  const emptyAccount = () => {
    return {
      id: '',
      name: '',
      email: '',
      owner: '',
      ownerFirstName: '',
      ownerLastName: '',
      budget: '',
      createdBy: '',
    }
  }

  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState(emptyAccount());
  const [show, setShow] = useState('Hide');
  const [activeCloud, setActiveCloud] = useState(clouds.AWS);
  const [serviceHandler, setServiceHandler] = useState(awsServices);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect( () => {
    fetchAccounts();
    getUser().then(user => {
      let email = null;
      if (user) {
        if (user.signInUserSession.idToken.payload.email) {
          email = user.signInUserSession.idToken.payload.email;
        } else {
          email = 'CA User';
        }
      }
      setUser(email);
    });
  },[])

  const setCloud = async (cloud) => {
    setActiveCloud(cloud);
    setServiceHandler(cloud === clouds.AWS ? awsServices : gcpServices);
    setShow('Hide');
  }

  const refreshList = () => {
    fetchAccounts();
  }

  useEffect(() =>  {
    fetchAccounts();
  }, [activeCloud])

  const fetchAccounts = async () => {
    setLoading(true);
    const accounts = await serviceHandler.getAccounts();
    setAccounts(accounts || []);
    setLoading(false);
  }

  const handleViewChange = async (showStage, accountId) => {
    if (accountId === null) {
      setShow(showStage);
      setAccount(emptyAccount());
    } else {
      const account = await serviceHandler.getAccount(accountId);
      setShow(showStage);
      setAccount(Object.assign(emptyAccount(), account));
    }
  }

    return (
      <>
      { user ? (
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-2'>
              <Form>
                <FormGroup>
                  <Button className='mr-2 active' variant={activeCloud === clouds.AWS ? 'warning' : 'secondary'} onClick={() => setCloud(clouds.AWS)}>AWS</Button>
                  <Button className='mr-2' variant={activeCloud === clouds.GCP ? 'warning' : 'secondary'} onClick={() => setCloud(clouds.GCP)}>GCP</Button>
                </FormGroup>
              </Form>
            </div>
            <div className='col-8 text-center'>
              <h4>{activeCloud === clouds.AWS ? 'AWS Accounts' : 'GCP Accounts'}</h4>
            </div>
            <div className='col-2 text-right'>
              <img src={`${activeCloud === clouds.AWS ? "aws-logo.png" : "gcp-logo.png"}`} max-width="100%" max-height="100%" className="rounded float-right" alt="logo" />
            </div>
          </div>

          { (activeCloud === clouds.AWS) &&
            <div className='row'>
              { loading ?
                (
                  <div className={`${show !== 'Hide' ? 'col-10' : 'col-12'} text-center`}>
                    <div className="spinner-grow" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                <div className='col-10'>
                  <AwsAccountsListView
                    accounts={accounts || []}
                    handleViewChange={handleViewChange}
                    refreshList={refreshList} />
                </div>
                )
              }
              <div className='col-2' hidden={show === 'Hide'}>
                <AwsAccountForm
                  stage={show}
                  account={account}
                  refreshList={refreshList}
                  apiFunction={
                    show === 'Create new AWS account' ?
                    serviceHandler.createAccount : serviceHandler.updateAccount
                  }
                  handleViewChange={handleViewChange} />
              </div>
            </div>
          }

          { (activeCloud === clouds.GCP) &&
            <div className='row'>
              { loading ?
                (
                  <div className={`${show !== 'Hide' ? 'col-10' : 'col-12'} text-center`}>
                    <div className="spinner-grow" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className='col-10'>
                    <GcpAccountsListView
                      accounts={accounts || []}
                      handleViewChange={handleViewChange}
                      refreshList={refreshList} />
                  </div>
                )
              }
              <div className='col-2' hidden={show === 'Hide'}>
                <GcpAccountForm
                  stage={show}
                  account={account}
                  refreshList={refreshList}
                  apiFunction={
                    show === 'Create new GCP account' ?
                    serviceHandler.createAccount : serviceHandler.updateAccount
                  }
                  handleViewChange={handleViewChange} />
              </div>
            </div>
          }
        </div>
        ) : (
          <div className='container-fluid'>
            <div className="jumbotron">
                <h1 className="display-4">Welcome to Sky9 app!</h1>
                <p className="lead">You could create new or manage existing AWS and GCP accounts.</p>
                <p>If you want to start experiencing, please log in.</p>
                <p className="lead">
                <button className="btn btn-primary btn-lg" onClick={login}>Login</button>
                </p>
            </div>
          </div>
        )
      }
    </>
  )
}

export default AccountsView;
