import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Form, FormGroup, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';
import SearchField from '../common/SearchField';
import * as accountService from '../../service/gcpAccountService';
import * as utils from '../utils';

const GcpAccountsListView = (props) => {

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
      Header: header('GCP project'),
      accessor: 'gcpProjectId',
      width: utils.getColumnWidth(filteredList, 'gcpProjectId', 'GCP Project'),
      Cell: row => <div style={{ textAlign: 'left', cursor: 'pointer' }}>{row.value}</div>
    }, {
      Header: header('Name'),
      accessor: 'name',
      width: utils.getColumnWidth(filteredList, 'name', 'Name'),
      Cell: row => <div style={{ textAlign: 'left', cursor: 'pointer' }}>{row.value}</div>
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
      Cell: row => <div style={{ textAlign: 'left' }}>{moment(row.value).format('DD-MM-YYYY h:mm:ss')}</div>
    }, {
      Header: header('Created by'),
      accessor: 'createdBy',
      width: '100%',
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value ? row.value : 'Anonymous'}</div>
    }
  ];

  const syncAccounts = async () => {
    setSyncAccountsLoader(true);
    await accountService.syncAccounts();
    setSyncAccountsLoader(false);
    refreshList();
  }
  const syncOwners = async () => {
    setSyncOwnersLoader(true);
    await accountService.syncOwners();
    setSyncOwnersLoader(false);
    refreshList();
  }

  const newAccount = () => {
    handleViewChange('Create new GCP account', null);
  }
  const syncBudgets = async () => {
    setSyncBudgetsLoader(true);
    await accountService.syncBudgets();
    setSyncBudgetsLoader(false);
    refreshList();
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

GcpAccountsListView.propTypes = {
  accounts: PropTypes.array.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired
}

export default GcpAccountsListView;
