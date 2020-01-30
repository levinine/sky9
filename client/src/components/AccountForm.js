import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormLabel, FormControl, Button, Alert } from 'react-bootstrap';
import lodash from 'lodash';
import './AccountForm.css';


const AccountForm = (props) => {
  const {
    stage,
    selectedAccount,
    validateEmail,
    refreshList,
    apiFunction,
    handleViewChange,
    getAccount
  } = props;

  const [originalAccount, setOriginalAccount] = useState(null);
  const [name, setName] = useState(selectedAccount.name);
  const [email, setEmail] = useState(selectedAccount.email);
  const [status, setStatus] = useState(selectedAccount.status);
  
  const [successMessage, setSuccessMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [nameError, setNameError] = useState(null);
  
  
  useEffect(() => {
    if(stage === "Update account") {
      async function fetch(){ 
        setOriginalAccount(await getAccount(selectedAccount.id));
      };
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount.id])

  useEffect(() => {
    setName(selectedAccount.name);
    setEmail(selectedAccount.email);
    setStatus(selectedAccount.status);
    setUpdateError(null);
    setEmailError(null);
    setNameError(null);
    setSuccessMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount]);


  const onShowAlert = (setFunction, value) =>{
    setFunction(value)
    window.setTimeout(()=>{
      setFunction(null)
    },5000)  
  }

  const validateForm = () => {
    if (!name.length > 0) {
      onShowAlert(setNameError, 'Name is required!');  
      return false;
    } 
    else if (!validateEmail(email)) {
      onShowAlert(setEmailError, 'This needs to be an email!');
      return false;
    } else if (stage === "Update account") {    
      const currentAccount = {
        name: name,
        email: email,
        status: status,
        id: selectedAccount.id
      }
      if (lodash.isEqual(originalAccount, currentAccount)) { 
        onShowAlert(setUpdateError, 'User has no changes to update!');
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    if (await !validateForm()) return;
    try {
      const account = {
        name: name,
        email: email,
        status: status,
        id:selectedAccount.id
      };
      const returnedAccount = await apiFunction(account);
      if (!(Object.entries(returnedAccount).length === 0 && returnedAccount.constructor === Object)) {
        refreshList();
        refreshForm();
        if (stage === "Update account") {
          const message = "You have successfully updated account " + account.name;
          onShowAlert(setSuccessMessage, message);
        } else {
          const message = "You have successfully added account " + account.name
          onShowAlert(setSuccessMessage, message);
        }
      }
    } catch(error) {
      console.log(error);
    }
  }

  const refreshForm = () => {
    if(stage === "Create new account") {
      setName('');
      setEmail('');
      setStatus('');
    }
    setEmailError(null);
    setNameError(null);
    setUpdateError(null);
  }


  return (
    <div>
      <h2>{stage}</h2>
      <Form 
        onSubmit={handleSubmit} 
        onKeyPress={e => {
          if (e.key === 'Enter') 
            e.preventDefault();
        }}>
        <FormGroup controlId="name">
          <FormLabel>Name:</FormLabel>
          <FormControl type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Enter name" />
          <Alert 
            variant="danger" 
            show={nameError !== null} 
            onClose={() => setNameError(null)} 
            dismissible
          > 
            {nameError}  
          </Alert>
        </FormGroup>
        <FormGroup controlId="email">
          <FormLabel>Email:</FormLabel>
          <FormControl type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter email" />
          <Alert 
            variant="danger" 
            show={emailError !== null} 
            onClose={() => setEmailError(null)} 
            dismissible
          > 
            {emailError}  
          </Alert>
        </FormGroup>
        <Form.Group controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Control as="select" onChange={event => setStatus(event.target.value)} value={status}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Submit
        </Button>
        {
          stage === "Update account" &&
          <Button 
              variant="primary" 
              onClick={() => handleViewChange("Create new account", null )}>
                Create new account
          </Button>
        }
        {updateError}
        <Alert 
          variant="success" 
          show={successMessage !== null} 
          onClose={() => setSuccessMessage(null)} 
          dismissible
        > 
          {successMessage}
        </Alert>
      </Form>
    </div>
  );
}

AccountForm.propTypes = {
  stage: PropTypes.string.isRequired,
  selectedAccount: PropTypes.object.isRequired,
  validateEmail: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  apiFunction: PropTypes.func.isRequired,
  handleViewChange: PropTypes.func,
  getAccount: PropTypes.func
}

export default AccountForm;