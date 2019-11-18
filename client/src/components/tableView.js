import React from 'react';
import { MDBDataTable,MDBBtn } from 'mdbreact';

const DatatablePage = (props) => {
  const data = {
    columns: [
      
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Status',
          field: 'status',
          sort: 'asc',
          width: 50
        },
        {
            label: '',
            field: '',
            width: 100
        }],
        rows: props.accounts

    //   rows: [
    //     //   props.accounts.map(account => {
    //     //       return {
    //     //             'name': account.name,
    //     //             'email': account.email,
    //     //             'status': account.status,
    //     //             'iamusers': account.IAMUsers.length
    //     //       }
    //     //   })  
    //   ]
  };

  return (
    <MDBDataTable
      striped
      bordered
      hover 
      data={data}
    />
  );
}

export default DatatablePage;