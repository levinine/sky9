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
  const [IAMUser, setIAMUser] = useState({'email':''});
  const [IAMUsers, setIAMUsers] = useState(selectedAccount.IAMUsers);
  
  const [successMessage, setSuccessMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [IAMUserError, setIAMUserError] = useState(null);
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
    setIAMUsers(selectedAccount.IAMUsers);
    setName(selectedAccount.name);
    setEmail(selectedAccount.email);
    setStatus(selectedAccount.status);
    setUpdateError(null);
    setIAMUserError(null);
    setEmailError(null);
    setNameError(null);
    setSuccessMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount]);


  const deleteIAMUser = index => {
    const newIAMUsersArray = IAMUsers;
    newIAMUsersArray.splice(index,1);
    setIAMUsers([...newIAMUsersArray]);
  }
  
  const onShowAlert = (setFunction, value) =>{
    setFunction(value)
    window.setTimeout(()=>{
      setFunction(null)
    },5000)  
  }

  const handleArrayChange = () => {
    const newUser = IAMUser;
    if(!validateEmail(IAMUser.email)) {
      onShowAlert(setIAMUserError, 'IAM User has  to be an email!');
      return;
    } 
    if (IAMUsers.filter(i => i.email === IAMUser.email).length > 0) {
      onShowAlert(setIAMUserError, 'IAM User already exists!');
      return;
    }
    if(newUser.email.length > 0) {
      setIAMUsers(IAMUsers.concat([newUser]));
      setIAMUser({"email": ''});
      setIAMUserError(null);
    }
  }
  
  const validateForm = () => {
    if(!name.length > 0) {
      onShowAlert(setNameError, 'Name is required!')  
      return false;
    } 
    else if(!validateEmail(email)) {
      onShowAlert(setEmailError, 'This needs to be an email!');
      return false;
    } else if(stage === "Update account") {    
      const currentAccount = {
        name: name,
        email: email,
        status: status,
        IAMUsers: IAMUsers,
        id: selectedAccount.id
      }
      if(lodash.isEqual(originalAccount, currentAccount)){ 
        onShowAlert(setUpdateError, 'User has no changes to update!');
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    if(await !validateForm()) return;
    try {
      const account = {
        name: name,
        email: email,
        status: status,
        IAMUsers: IAMUsers,
        id:selectedAccount.id
      }
      const returnedAccount = await apiFunction(account);
      if(!(Object.entries(returnedAccount).length === 0 && returnedAccount.constructor === Object)) {
        refreshList();
        refreshForm();
        if(stage === "Update account") {
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
      setIAMUsers([]);
      setName('');
      setEmail('');
      setStatus('');
      setIAMUser({'email':''});
    }
    setEmailError(null);
    setNameError(null);
    setIAMUserError(null);
    setUpdateError(null);
  }


  const renderIAMUsers = () => {    
    if(IAMUsers.length > 0) {
      const users = IAMUsers.map((IAMUser,index) => (
        <tr key={IAMUser.email}>
          <td>{index+1}</td>
          <td>{IAMUser.email}</td>
          <td>
            <Button 
              size="sm" 
              variant="danger" 
              onClick={() => deleteIAMUser(index)}
            >Delete</Button>
          </td>
        </tr> )
      )
      return(
        <table id= "myTable" width="100%">
          <tbody>
            <tr>                    
              <th>#</th>
              <th>IAM Users</th>
              <th></th>  
            </tr>
            {users}
          </tbody>
        </table>
      )
    }
    return null;
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
          <FormControl type="text" value={email} onChange={event => (event.target.value)} placeholder="Enter email" />
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
        <Form.Group controlId="IAMUser">
          <Form.Label>IAM Users</Form.Label>
          <Form.Control type="text" value={IAMUser.email} onChange={event => setIAMUser({"email": event.target.value})} placeholder="Add IAM User"/>
          <Button onClick={handleArrayChange} variant="primary">
            Add user
          </Button>
          <Alert 
            variant="danger" 
            show={IAMUserError !== null}
            onClose={() => setIAMUserError(null)} 
            dismissible
          > 
            {IAMUserError}  
          </Alert>
          {renderIAMUsers()}
        </Form.Group>
        <Button  type="submit" variant="primary" >
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