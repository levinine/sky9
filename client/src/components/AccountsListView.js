import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import SearchField from '../components/SearchField';
import DeleteModalDialog from './DeleteModalDialog';
import { Button } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const AccountsListView = (props) => {

  const {
    accounts,
    deleteAccount,
    handleViewChange,
    refreshList
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(accounts);
  const [deleteAccountID, setDeleteAccountID] = useState(null);
  
  useEffect(() => {
    const results = (accounts || []).filter(account => {
      const lowerCaseSearchTerm = (searchTerm).toLowerCase();
      return ( 
        account.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        account.email.toLowerCase().includes(lowerCaseSearchTerm) 
      )
    })
    setFilteredList(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, accounts])

  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  const columns = [{
    Header: 'Name',
    accessor: 'name',
    Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    }, {
      Header: 'Email',
      accessor: 'email',
      Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    }, {
      Header: 'Status',
      accessor: 'status',
      Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    }, 
    {
      Cell: row => (
        <div  style={{ textAlign: "center" }}>
          <Button 
            variant="primary" 
            onClick={ e => handleViewChange("Update account", row.original.id)}>
              Edit
          </Button>
          <Button 
            variant ="danger" 
            onClick={() => setDeleteAccountID(row.original.id) }>
              Delete
          </Button> 
        
        </div>
      )
    }
  ]

  return (
    <div>
      <SearchField onChange={handleChange} searchTerm={searchTerm} />
      <ReactTable 
        data={filteredList}
        columns={columns}
        className="-highlight"
        showPageSizeOptions={false}
        defaultPageSize={15}
      />
      <DeleteModalDialog 
        show={deleteAccountID} 
        handleClose={() => setDeleteAccountID(null)} 
        handleDelete={async () => {
          await deleteAccount(deleteAccountID);
          refreshList();
          setDeleteAccountID(null);
          handleViewChange('Create new account', null);
        }}
        message="Are you sure you want to delete?"
        title="Delete account"
        buttonMessage="Delete"
      />
    </div>
  )
}

AccountsListView.propTypes = {
  accounts: PropTypes.array.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired
}

export default AccountsListView;

