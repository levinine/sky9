import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Form, FormGroup, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
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
      Header: header('AWS account'),
      accessor: 'awsAccountId',
      width: utils.getColumnWidth(filteredList, 'awsAccountId', 'AWS account'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: header('Name'),
      accessor: 'name',
      width: utils.getColumnWidth(filteredList, 'name', 'Name'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: header('Owner'),
      accessor: 'owner',
      width: utils.getColumnWidth(filteredList, 'owner', 'Owner'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: header('Members'),
      accessor: 'members',
      width: utils.getColumnWidth(filteredList, null, 'Members'),
      Cell: row => <div style={{ textAlign: 'left' }}><OverlayTrigger placement='right' delay={row.value && row.value.length > 0 ? 250 : 100000} overlay={(props) => <Tooltip {...props}>{row.value ? row.value.join(',\n') : ''}</Tooltip>}><span>{row.value ? row.value.length : 0}</span></OverlayTrigger></div>
    }, {
      Header: header('Budget $'),
      accessor: 'budget',
      width: 90,
      Cell: row => <div style={{ textAlign: 'left' }}><span style={{ width: '40px', display: 'inline-block'}}>{row.original.actualSpend === undefined ? '?' : row.original.actualSpend}</span><span> / {row.value}</span></div>
    }, {
      Header: header('Created time'),
      accessor: 'createdTime',
      width: utils.getColumnWidth(filteredList, 'createdTime', 'Created time'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: header('Created by'),
      accessor: 'createdBy',
      width: utils.getColumnWidth(filteredList, 'createdBy', 'Created by'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }
  ];

  const syncAccounts = async () => {
    await accountService.syncAccounts();
    refreshList();
  }
  const syncBudgets = async () => {
    await accountService.syncBudgets();
    refreshList();
  }
  const syncOwners = async () => {
    await accountService.syncOwners();
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
          <Button className='mr-2' variant='primary' onClick={() => syncAccounts()}>Sync Accounts</Button>
          <Button className='mr-2' variant='primary' onClick={() => syncBudgets()}>Sync Budgets</Button>
          <Button className='mr-2' variant='primary' onClick={() => syncOwners()}>Sync Owners</Button>
          <Button className='mr-2' variant='primary' onClick={() => newAccount()}>New Account</Button>
        </FormGroup>
      </Form>

      <ReactTable 
        data={filteredList}
        columns={columns}
        showPagination={false}
        minRows={0}
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