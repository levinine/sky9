import React from 'react'
import {Modal, Button} from 'react-bootstrap'

const ModalDialog = props => {
    const showModal = props.show != null
    return (
        <Modal show={showModal} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{props.message}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>Close</Button>
                    <Button variant="danger" onClick={props.handleDelete}>{props.buttonMessage}</Button>
                </Modal.Footer>
        </Modal>
    )
}
export default ModalDialog;