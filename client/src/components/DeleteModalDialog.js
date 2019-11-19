import React from 'react'
import {Modal, Button} from 'react-bootstrap'

const DeleteModalDialog = props => {
    const showModal = props.show != null
    const {
        handleClose,
        handleDelete,
        title,
        message,
        buttonMessage
    } = props;
    return (
        <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="danger" onClick={handleDelete}>{buttonMessage}</Button>
                </Modal.Footer>
        </Modal>
    )
}
export default DeleteModalDialog;