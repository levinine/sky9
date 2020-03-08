import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Form, FormGroup, Button } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SearchField from '../components/SearchField';
import { syncAccounts } from '../service/accountService';
import './AccountsListView.css';

const AccountsListView = (props) => {

  const {
    accounts,
    handleViewChange,
    refreshList
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(accounts);
  
  useEffect(() => {
    const results = (accounts || []).filter(account => {
      const lowerCaseSearchTerm = (searchTerm).toLowerCase();
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

  const columns = [{
      Header: 'Id',
      accessor: 'awsAccountId',
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: 'Name',
      accessor: 'name',
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: 'Email',
      accessor: 'email',
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: 'Owner',
      accessor: 'owner',
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: 'Budget',
      accessor: 'budget',
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: 'Created time',
      accessor: 'createdTime',
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }, {
      Header: 'Created by',
      accessor: 'createdBy',
      Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
    }
  ];

  const sync = async () => {
    await syncAccounts();
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
          <Button variant='primary' onClick={() => sync()}>Sync</Button>
          <Button className='ml-2' variant='primary' onClick={() => newAccount()}>New Account</Button>
        </FormGroup>
      </Form>

      <ReactTable 
        data={filteredList}
        columns={columns}
        className='-highlight'
        showPageSizeOptions={false}
        defaultPageSize={15}
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
