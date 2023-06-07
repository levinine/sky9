import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormLabel, FormControl, Button, Alert } from 'react-bootstrap';
import lodash from 'lodash';
import { getUser } from '../../service/authenticationService';


const GcpAccountForm = (props) => {
  const {
    stage,
    account,
    refreshList,
    apiFunction,
    handleViewChange
  } = props;

  const [originalAccount, setOriginalAccount] = useState(null);
  const [name, setName] = useState(account.name);
  const [owner, setOwner] = useState(account.owner);
  const [ownerFirstName, setOwnerFirstName] = useState(account.ownerFirstName);
  const [ownerLastName, setOwnerLastName] = useState(account.ownerLastName);
  const [budget, setBudget] = useState(account.budget);

  const [successMessage, setSuccessMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [ownerError, setOwnerError] = useState(null);
  const [ownerFirstNameError, setOwnerFirstNameError] = useState(null);
  const [ownerLastNameError, setOwnerLastNameError] = useState(null);
  const [budgetError, setBudgetError] = useState(null);


  useEffect(() => {
    if (stage === 'Update account') {
      setOriginalAccount({ ...account });
    }
  }, [account, stage]);

  useEffect(() => {
    setName(account.name);
    setOwner(account.owner);
    setOwnerFirstName(account.ownerFirstName);
    setOwnerLastName(account.ownerLastName);
    setBudget(account.budget);
    setSuccessMessage(null);
    setUpdateError(null);
    setNameError(null);
    setOwnerError(null);
    setOwnerFirstNameError(null);
    setOwnerLastNameError(null);
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
    if (!/^[a-z][a-z0-9-]{5,29}$/g.test(name)) {
      displayMessage(setNameError, 'Name must be 6 to 30 lowercase letters, digits, or hyphens. It must start with a letter.');
      valid = false;
    }
    if (!validateEmail(owner)) {
      displayMessage(setOwnerError, 'This needs to be an email!');
      valid = false;
    }
    if (!ownerFirstName.length > 0) {
      displayMessage(setOwnerFirstNameError, 'Owner first name is required!');
      valid = false;
    }
    if (!ownerLastName.length > 0) {
      displayMessage(setOwnerLastNameError, 'Owner last name is required!');
      valid = false;
    }
    if (budget && !/^\d+(\.\d+)?$/.test(budget)) {
      displayMessage(setBudgetError, 'Must be money value!');
      valid = false;
    }
    if (stage === 'Update account') {
      const currentAccount = Object.assign({ ...originalAccount }, {
        name: name,
        owner: owner,
        budget: budget,
        id: account.id
      });
      if (lodash.isEqual(originalAccount, currentAccount)) {
        displayMessage(setUpdateError, 'User has no changes to update!');
        valid = false;
      } else {
        console.log('original updated', originalAccount, currentAccount);
      }
    }
    return valid;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const a = {
        name: name.toLowerCase(),
        owner: owner,
        ownerFirstName: ownerFirstName,
        ownerLastName: ownerLastName,
        budget: budget,
        id: account.id
      };
      if (stage === 'Create new AWS account' || stage === 'Create new GCP account') {
        const user = await getUser();
        const userEmail = user.signInUserSession.idToken.payload.email || 'CA User';
        a.createdBy = userEmail;
      }
      const executionId = await apiFunction(a);
      console.log('submit account executionId', executionId);
      handleViewChange(stage, null);
      refreshList();
      if (stage === 'Update account') {
        const message = 'You have successfully updated account ' + account.name;
        displayMessage(setSuccessMessage, message);
      } else {
        const message = 'You have successfully added account ' + account.name;
        displayMessage(setSuccessMessage, message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    handleViewChange('Hide', null);
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
        <FormGroup controlId='name'>
          <FormLabel>Name:</FormLabel>
          <FormControl type='text' value={name} onChange={event => setName(event.target.value)} placeholder='Enter name' /> {/* disable input field for edit action */}
          <Alert
            variant='danger'
            show={nameError !== null}
            onClose={() => setNameError(null)}
            dismissible
          >
            {nameError}
          </Alert>
        </FormGroup>
        <FormGroup controlId='owner'>
          <FormLabel>Owner email:</FormLabel>
          <FormControl type='text' value={owner} onChange={event => setOwner(event.target.value)} placeholder='Enter owner email' />
          <Alert
            variant='danger'
            show={ownerError !== null}
            onClose={() => setOwnerError(null)}
            dismissible
          >
            {ownerError}
          </Alert>
        </FormGroup>
        <FormGroup controlId='ownerFirstName'>
          <FormLabel>Owner first name:</FormLabel>
          <FormControl type='text' value={ownerFirstName} onChange={event => setOwnerFirstName(event.target.value)} placeholder='Enter owner first name' />
          <Alert
            variant='danger'
            show={ownerFirstNameError !== null}
            onClose={() => setOwnerFirstNameError(null)}
            dismissible
          >
            {ownerFirstNameError}
          </Alert>
        </FormGroup>
        <FormGroup controlId='ownerLastName'>
          <FormLabel>Owner last name:</FormLabel>
          <FormControl type='text' value={ownerLastName} onChange={event => setOwnerLastName(event.target.value)} placeholder='Enter owner last name' />
          <Alert
            variant='danger'
            show={ownerLastNameError !== null}
            onClose={() => setOwnerLastNameError(null)}
            dismissible
          >
            {ownerLastNameError}
          </Alert>
        </FormGroup>
        <FormGroup controlId='budget'>
          <FormLabel>Budget:</FormLabel>
          <FormControl type='text' value={budget} onChange={event => setBudget(event.target.value)} placeholder='Enter budget' />
          <Alert
            variant='danger'
            show={budgetError !== null}
            onClose={() => setBudgetError(null)}
            dismissible
          >
            {budgetError}
          </Alert>
        </FormGroup>
        <Form.Group controlId='buttons'>
          <Button type='submit' variant='primary'>
            Submit
          </Button>
          <Button className='ml-2' variant='primary' onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Group>

        <Alert
          variant='danger'
          show={updateError !== null}
          onClose={() => setUpdateError(null)}
          dismissible
        >
          {updateError}
        </Alert>
        <Alert
          variant='success'
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

GcpAccountForm.propTypes = {
  stage: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
  apiFunction: PropTypes.func.isRequired,
  handleViewChange: PropTypes.func
}

export default GcpAccountForm;