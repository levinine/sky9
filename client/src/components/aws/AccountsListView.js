import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Form, FormGroup, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';
import SearchField from '../common/SearchField';
import * as accountService from '../../service/awsAccountService';
import * as utils from '../utils';

const AwsAccountsListView = (props) => {

  const {
    accounts,
    handleViewChange,
    refreshList
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(accounts);
  const [syncAccountsLoader, setSyncAccountsLoader] = useState(false);
  const [syncBudgetsLoader, setSyncBudgetsLoader] = useState(false);
  const [syncOwnersLoader, setSyncOwnersLoader] = useState(false);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = (accounts || []).filter(account => {
      return ( 
        account.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        account.email.toLowerCase().includes(lowerCaseSearchTerm) 
      );
    });
    setFilteredList(results);
  }, [searchTerm, accounts]);

  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  const header = (header) => {
    return <div style={{ textAlign: 'left' }}>{header}</div>
  }

  const columns = [{
      Header: header('#'),
      width: 30,
      Cell: row => <div style={{ textAlign: 'left', cursor: 'pointer' }}>{row.index+1}</div>
    },
    {
      Header: header('Account ID'),
      accessor: 'awsAccountId',
      width: utils.getColumnWidth(filteredList, 'awsAccountId', 'Account ID'),
      Cell: row => <div style={{ textAlign: 'left', cursor: 'pointer' }}>{row.value}</div>
    }, {
      Header: header('Name'),
      accessor: 'name',
      width: utils.getColumnWidth(filteredList, 'name', 'Name'),
      Cell: row => <div style={{ textAlign: 'left', cursor: 'pointer' }}>{row.value}</div>
    }, {
      Header: header('Status'),
      accessor: 'status',
      width: utils.getColumnWidth([], 'status', 'Status'),
      Cell: row => {
        let icon = null;
        let tooltipText = null;
        switch (row.value) {
          case utils.creationStatuses.DONE:
            icon = <i className="fa fa-check-circle fa-lg" style={{'color':'#198754'}}></i>;
            tooltipText = `Creation is "${row.value}"`;
            break;
          case utils.creationStatuses.INPROGRESS:
            icon = <i className="fa fa-spinner fa-lg" style={{'color':'#007bff'}}></i>;
            tooltipText = `Creation is "${row.value}"`;
            break;
          case utils.creationStatuses.FAILED:
            icon = <i className="fa fa-times-circle fa-lg" style={{'color':'#dc3545'}}></i>;
            tooltipText = `Creation is "${row.value}"`;
            break;
          default:
            icon = <i className="fa fa-question-circle fa-lg" style={{'color':'#ffc107'}}></i>;
            tooltipText = `Creation is in "Unknown" status`;
        }
        return (
          <OverlayTrigger
            placement='right'
            overlay={
              (props) => <Tooltip {...props}>{tooltipText}</Tooltip>
          }>
            <div style={{ textAlign: 'center', cursor: 'pointer' }}>{icon}</div>
          </OverlayTrigger>
        )
      }
    }, {
      Header: header('Owner'),
      accessor: 'owner',
      width: utils.getColumnWidth(filteredList, 'owner', 'Owner'),
      Cell: row => <div style={{ textAlign: 'left', cursor: 'pointer' }}>{row.value}</div>
    }, {
      Header: header('Members'),
      accessor: 'members',
      width: utils.getColumnWidth(filteredList, null, 'Members'),
      Cell: row => <div style={{ textAlign: 'left', cursor: 'pointer' }}><OverlayTrigger placement='right' delay={row.value && row.value.length > 0 ? 250 : 100000} overlay={(props) => <Tooltip {...props}>{row.value ? row.value.join(',\n') : ''}</Tooltip>}><span>{row.value ? row.value.length : 0}</span></OverlayTrigger></div>
    }, {
      Header: header('Budget $'),
      accessor: 'budget',
      width: 105,
      Cell: row => <div style={{ textAlign: 'left' }}><span style={{ width: '48px', display: 'inline-block', color: row.original.actualSpend && row.original.actualSpend/row.value >= 0.8 ? 'red' : 'inherit' }}>{row.original.actualSpend === undefined ? '?' : row.original.actualSpend}</span><span> / {row.value}</span></div>
    }, {
      Header: header('Created time'),
      accessor: 'createdTime',
      width: 180,
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value ? moment(row.value).format('DD-MM-YYYY h:mm:ss') : ''}</div>
    }, {
      Header: header('Created by'),
      accessor: 'createdBy',
      width: utils.getColumnWidth(filteredList, 'createdBy', 'Created by'),
      Cell: row => {
        return (
          <div style={{ textAlign: 'left' }}>
            <OverlayTrigger
              placement='right'
              overlay={
                (props) => <Tooltip {...props}>{row.value ? row.value : 'Anonymous'}</Tooltip>
            }>
              <span>{row.value ? row.value : 'Anonymous'}</span>
            </OverlayTrigger>
          </div>
        )
      }
    }
  ];

  const syncAccounts = async () => {
    setSyncAccountsLoader(true);
    await accountService.syncAccounts();
    setSyncAccountsLoader(false);
    refreshList();
  }
  const syncBudgets = async () => {
    setSyncBudgetsLoader(true);
    await accountService.syncBudgets();
    setSyncBudgetsLoader(false);
    refreshList();
  }
  const syncOwners = async () => {
    setSyncOwnersLoader(true);
    await accountService.syncOwners();
    setSyncOwnersLoader(false);
    refreshList();
  }

  const newAccount = () => {
    handleViewChange('Create new AWS account', null);
  }

  return (
    <div>
      <SearchField onChange={handleChange} searchTerm={searchTerm} />
      <Form>
        <FormGroup>
          <Button className='mr-2' variant='primary' onClick={() => syncAccounts()}>
            {'Sync Accounts '}
            { syncAccountsLoader && (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            )}
          </Button>
          <Button className='mr-2' variant='primary' onClick={() => syncBudgets()}>
            {'Sync Budgets '}
            { syncBudgetsLoader && (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            )}
          </Button>
          <Button className='mr-2' variant='primary' onClick={() => syncOwners()}>
            {'Sync Owners '}
            { syncOwnersLoader && (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            )}
          </Button>
          <Button className='mr-2' variant='primary' onClick={() => newAccount()}><i className="fa fa-plus"></i> New Account</Button>
          <Button className='mr-2' variant="outline-primary" onClick={() => refreshList()}><i className="fa fa-refresh"></i> Reload</Button>
        </FormGroup>
      </Form>

      <ReactTable 
        data={filteredList}
        columns={columns}
        showPagination={true}
        defaultPageSize={100}
        minRows={10}
        getTrProps={(state, rowInfo, column) => {
          return {
            onClick: (e) => {
              console.log(e, state, rowInfo, column);
              handleViewChange('Update account', rowInfo.original.id);
            }
          }
        }}
      />
    </div>
  )
}

AwsAccountsListView.propTypes = {
  accounts: PropTypes.array.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired
}

export default AwsAccountsListView;
