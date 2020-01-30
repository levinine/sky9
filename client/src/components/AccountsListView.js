import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
// import SearchField from '../components/SearchField';
import { Form, FormGroup, Button } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, accounts]);

  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  const columns = [{
      Header: 'Id',
      accessor: 'id',
      Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
    }, {
      Header: 'Name',
      accessor: 'name',
      Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
    }, {
      Header: 'Email',
      accessor: 'email',
      Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
    }, {
      Header: 'Owner',
      accessor: 'owner',
      Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
    }, {
      Header: 'Budget',
      accessor: 'budget',
      Cell: row => <div style={{ textAlign: "left" }}>{row.value}</div>
    }
  ];

  const sync = async () => {
    await syncAccounts();
    refreshList();
  }

  return (
    <div>
      {/* <SearchField onChange={handleChange} searchTerm={searchTerm} /> */}
      <Form>
        <FormGroup>
          <Button variant="primary" onClick={() => sync()}>Sync</Button>
        </FormGroup>
      </Form>

      <ReactTable 
        data={filteredList}
        columns={columns}
        className="-highlight"
        showPageSizeOptions={false}
        defaultPageSize={15}
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
