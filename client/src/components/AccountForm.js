import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import lodash from 'lodash';
import './Form.css';


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
  }, [])

  useEffect(() => {
    setIAMUsers(selectedAccount.IAMUsers);
    setName(selectedAccount.name);
    setEmail(selectedAccount.email);
    setStatus(selectedAccount.status);
    setUpdateError(null);
    setIAMUserError(null);
    setEmailError(null);
    setNameError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount]);


  const deleteIAMUser = index => {
    const newIAMUsersArray = IAMUsers;
    newIAMUsersArray.splice(index,1);
    setIAMUsers([...newIAMUsersArray]);
  }

  const handleArrayChange = () => {
    const newUser = IAMUser;
    if(IAMUser.email.length > 0 && !validateEmail(IAMUser.email)) {
      setIAMUserError('IAM User has  to be an email!');
      return;
    } 
    if (IAMUsers.filter(i => i.email === IAMUser.email).length > 0) {
      setIAMUserError('IAM User already exists!');
      return;
    }
    if(newUser.email.length > 0) {
      setIAMUsers(IAMUsers.concat([newUser]));
      setIAMUser({"email": ''});
      setIAMUserError('');
    } else {
      setIAMUserError('IAM User can\'t be empty');
    }
  }

  const validateForm = () => {
    if(!name.length > 0) {
      setNameError('Name is required!')  
      return false;
    } 
    else if(!validateEmail(email)) {
      setEmailError('This needs to be an email!');
      return false;
    } else if(stage === "Update account") {    
      const currentAccount = {
        name: name,
        email: email,
        status: status,
        IAMUsers: IAMUsers,
        id: selectedAccount.id
      }
      console.log(JSON.stringify(originalAccount));
      console.log(JSON.stringify(currentAccount));
      if(lodash.isEqual(originalAccount, currentAccount)){ 
        setUpdateError('User has no changes to update!');
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    if(await !validateForm()){
      console.log("pao sam");
      return;
    }
    try {
      const account = {
        name: name,
        email: email,
        status: status,
        IAMUsers: IAMUsers,
        id:selectedAccount.id
      }
      if(stage === "Create new account") setIAMUsers([]);
      setName('');
      setEmail('');
      setStatus('');
      setIAMUser({'email':''});
      setEmailError('');
      setNameError('');
      setIAMUserError('');
      const returnedAccount = await apiFunction(account);
      if(!(Object.entries(returnedAccount).length === 0 && returnedAccount.constructor === Object)) {
        refreshList(returnedAccount, stage);
      }
    } catch(error) {
      console.log(error);
    }
  }

  const renderIAMUsers = () => {    
    let users = null;
    if(IAMUsers.length > 0) {
      users = IAMUsers.map((IAMUser,index) => (
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
          {nameError}
        </FormGroup>
        <FormGroup controlId="email">
          <FormLabel>Email:</FormLabel>
          <FormControl type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter email" />
          {emailError}
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
          {IAMUserError}
          <Button onClick={handleArrayChange} variant="primary">
            Add user
          </Button>
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
                Cancel
          </Button>
        }
        {updateError}
      </Form>
    </div>
  );
}

AccountForm.propTypes = {
  stage: PropTypes.string.isRequired,
  selectedAccount: PropTypes.object.isRequired,
  validateEmail: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  apiFunction: PropTypes.func.isRequired
}

export default AccountForm;