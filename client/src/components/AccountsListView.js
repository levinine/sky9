import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Form, FormGroup, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SearchField from '../components/SearchField';
import * as accountService from '../service/accountService';

const AccountsListView = (props) => {

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
  const getColumnWidth = (rows, accessor, headerText) => {
    const maxWidth = 400
    const magicSpacing = 10
    const cellLength = Math.max(
      ...rows.map(row => (`${row[accessor]}` || '').length),
      headerText.length,
    )
    return Math.min(maxWidth, cellLength * magicSpacing)
  }

  const header = (header) => {
    return <div style={{ textAlign: 'left' }}>{header}</div>
  }
  const columns = [{
      Header: header('AWS account'),
      accessor: 'awsAccountId',
      width: getColumnWidth(filteredList, 'awsAccountId', 'AWS account'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: header('Name'),
      accessor: 'name',
      width: getColumnWidth(filteredList, 'name', 'Name'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: header('Owner'),
      accessor: 'owner',
      width: getColumnWidth(filteredList, 'owner', 'Owner'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: header('Members'),
      accessor: 'members',
      width: getColumnWidth(filteredList, null, 'Members'),
      Cell: row => <div style={{ textAlign: 'left' }}><OverlayTrigger placement='right' delay={row.value && row.value.length > 0 ? 250 : 100000} overlay={(props) => <Tooltip {...props}>{row.value ? row.value.join(',\n') : ''}</Tooltip>}><span>{row.value ? row.value.length : 0}</span></OverlayTrigger></div>
    }, {
      Header: header('Budget $'),
      accessor: 'budget',
      width: 90,
      Cell: row => <div style={{ textAlign: 'left' }}><span style={{ width: '40px', display: 'inline-block'}}>{row.original.actualSpend === undefined ? '?' : row.original.actualSpend}</span><span> / {row.value}</span></div>
    }, {
      Header: header('Created time'),
      accessor: 'createdTime',
      width: getColumnWidth(filteredList, 'createdTime', 'Created time'),
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: header('Created by'),
      accessor: 'createdBy',
      width: getColumnWidth(filteredList, 'createdBy', 'Created by'),
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
    handleViewChange('Create new account', null);
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

AccountsListView.propTypes = {
  accounts: PropTypes.array.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired
}

export default AccountsListView;
