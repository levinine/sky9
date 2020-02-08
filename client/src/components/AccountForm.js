import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormLabel, FormControl, Button, Alert } from 'react-bootstrap';
import lodash from 'lodash';
import './AccountForm.css';


const AccountForm = (props) => {
  const {
    stage,
    account,
    refreshList,
    apiFunction,
    handleViewChange
  } = props;

  const [originalAccount, setOriginalAccount] = useState(null);
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [owner, setOwner] = useState(account.owner);
  const [budget, setBudget] = useState(account.budget);

  const [successMessage, setSuccessMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [ownerError, setOwnerError] = useState(null);
  const [budgetError, setBudgetError] = useState(null);


  useEffect(() => {
    if (stage === "Update account") {
      setOriginalAccount({ ...account });
    }
  }, [account, stage]);

  useEffect(() => {
    setName(account.name);
    setEmail(account.email);
    setOwner(account.owner);
    setBudget(account.budget);
    setSuccessMessage(null);
    setUpdateError(null);
    setNameError(null);
    setEmailError(null);
    setOwnerError(null);
    setBudgetError(null);
  }, [account]);


  const displayMessage = (setFunction, value) => {
    setFunction(value);
    window.setTimeout(() => {
      setFunction(null);
    }, 5000);
  }

  const validateForm = () => {
    let valid = true;
    if (!name.length > 0) {
      displayMessage(setNameError, 'Name is required!');
      valid = false;
    }
    if (!validateEmail(email)) {
      displayMessage(setEmailError, 'This needs to be an email!');
      valid = false;
    }
    if (!validateEmail(owner)) {
      displayMessage(setOwnerError, 'This needs to be an email!');
      valid = false;
    }
    if (budget && !/^\d+(\.\d+)?$/.test(budget)) {
      displayMessage(setBudgetError, 'Must be money value!');
      valid = false;
    }
    if (stage === "Update account") {
      const currentAccount = Object.assign({ ...originalAccount }, {
        name: name,
        email: email,
        owner: owner,
        budget: budget,
        id: account.id
      });
      console.log('original updated', originalAccount, currentAccount);
      if (lodash.isEqual(originalAccount, currentAccount)) {
        displayMessage(setUpdateError, 'User has no changes to update!');
        valid = false;
      }
    }
    return valid;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const a = {
        name: name,
        email: email,
        owner: owner,
        budget: budget,
        id: account.id
      };
      const returnedAccount = await apiFunction(a);
      if (!(Object.entries(returnedAccount).length === 0 && returnedAccount.constructor === Object)) {
        refreshList();
        refreshForm();
        if (stage === "Update account") {
          const message = "You have successfully updated account " + account.name;
          displayMessage(setSuccessMessage, message);
        } else {
          const message = "You have successfully added account " + account.name;
          displayMessage(setSuccessMessage, message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    handleViewChange('Hide', null);
  }

  const refreshForm = () => {
    if (stage === "Create new account") {
      setName('');
      setEmail('');
    }
    setEmailError(null);
    setNameError(null);
    setUpdateError(null);
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
        <FormGroup controlId="owner">
          <FormLabel>Owner:</FormLabel>
          <FormControl type="text" value={owner} onChange={event => setOwner(event.target.value)} placeholder="Enter owner email" />
          <Alert
            variant="danger"
            show={ownerError !== null}
            onClose={() => setOwnerError(null)}
            dismissible
          >
            {ownerError}
          </Alert>
        </FormGroup>
        <FormGroup controlId="budget">
          <FormLabel>Budget:</FormLabel>
          <FormControl type="text" value={budget} onChange={event => setBudget(event.target.value)} placeholder="Enter budget" />
          <Alert
            variant="danger"
            show={budgetError !== null}
            onClose={() => setBudgetError(null)}
            dismissible
          >
            {budgetError}
          </Alert>
        </FormGroup>
        <Form.Group controlId="buttons">
          <Button type="submit" variant="primary">
            Submit
          </Button>
          <Button className="ml-2" variant="primary" onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Group>

        <Alert
          variant="danger"
          show={updateError !== null}
          onClose={() => setUpdateError(null)}
          dismissible
        >
          {updateError}
        </Alert>
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
  account: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
  apiFunction: PropTypes.func.isRequired,
  handleViewChange: PropTypes.func
}

export default AccountForm;