import React from 'react'
import {Modal, Button} from 'react-bootstrap'

const AccountViewModal = props => {
    const showModal = props.show != null
    let account = props.account;
    if(account === null) {
      account= {
        name:'',
        status:'',
        IAMUsers:[],
        email:''
      }
    } 
  
    return (
        <Modal show={showModal} onHide={props.handleClose}>
                <Modal.Body>
                    <p>Name: {account.name}</p>
                    <p>Email: {account.email}</p>
                    <p>Status: {account.status}</p>
                    <p>IAMUsers: {account.IAMUsers.map(user=> user.email)}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>Close</Button>
                </Modal.Footer>
        </Modal>
    )
}
export default AccountViewModal;