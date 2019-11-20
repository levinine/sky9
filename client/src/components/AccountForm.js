import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import './Form.css';

const AccountForm = (props) => {

  //needed here for initializing IAMUsers in update form
  const renderIAMUsers = newUser => {
    
    let users = null;
    if(newUser != null) {
      users = IAMUsers.concat([newUser]).map((IAMUser,index) => <tr key={IAMUser.email}><td>{index+1}</td><td>{IAMUser.email}</td></tr> )
      return(
        <table width="100%">
          <tbody>
            <tr>                    
              <th>#</th>
              <th>IAM Users</th>  
            </tr>
            {users}
          </tbody>
      </table>
      )
    }
    if(IAMUsers.length > 0) {
      users = IAMUsers.map((IAMUser,index) => <tr key={IAMUser.email}><td>{index+1}</td><td>{IAMUser.email}</td></tr> )
      return(
        <table width="100%">
          <tbody>
            <tr>                    
              <th>#</th>
              <th>IAM Users</th>  
            </tr>
            {users}
          </tbody>
        </table>
      )
    }
  }

  
  const [name, setName] = useState(props.selectedAccount.name);
  const [email, setEmail] = useState(props.selectedAccount.email);
  const [status, setStatus] = useState(props.selectedAccount.status);
  const [IAMUser, setIAMUser] = useState({'email':''});
  const [IAMUsers, setIAMUsers] = useState(props.selectedAccount.IAMUsers);
  const [IAMUsersRender, setIAMUsersRender] = useState(renderIAMUsers(null));

  const [updateError, setUpdateError] = useState(null);
  const [IAMUserError, setIAMUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [nameError, setNameError] = useState(null);

  useEffect(() => {
    setName(props.selectedAccount.name);
    setEmail(props.selectedAccount.email);
    setStatus(props.selectedAccount.status);
    setIAMUsers(props.selectedAccount.IAMUsers);
    setIAMUsersRender(renderIAMUsers(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const handleArrayChange = () => {
    const newUser = IAMUser;
    if(IAMUser.email.length > 0 && !props.validateEmail(IAMUser.email)) {
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
      setIAMUsersRender(renderIAMUsers(newUser));
    } else {
      setIAMUserError('IAM User can\'t be empty');
    }
  }

  const validateForm = () => {
    if(!name.length > 0) {
      setNameError('Name is required!')  
      return false;
    } 
    else if(!props.validateEmail(email)) {
      setEmailError('This needs to be an email!');
      return false;
    } else if(props.stage === "Update account") {
      const currentAccount = {
        name: name,
        email: email,
        status: status,
        IAMUsers:IAMUsers,
        id: props.selectedAccount.id
      }
      if(JSON.stringify(currentAccount) === JSON.stringify(props.selectedAccount)){ 
        setUpdateError('User has no changes to update!');
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    if(!validateForm()){
      console.log("pao sa");
      return;
    }
    try {
      const account = {
        name: name,
        email: email,
        status: status,
        IAMUsers: IAMUsers,
        id:props.selectedAccount.id
      }
      setName('');
      setEmail('');
      setStatus('');
      setIAMUser({'email':''});
      setIAMUsers([]);
      setEmailError('');
      setNameError('');
      setIAMUserError('');
      setIAMUsersRender(renderIAMUsers(null));
      const returnedAccount = await props.apiFunction(account);
      if(!(Object.entries(returnedAccount).length === 0 && returnedAccount.constructor === Object)) {
        props.refreshList(returnedAccount, props.stage);
      }
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h2>{props.stage}</h2>
      <Form onSubmit={handleSubmit}>
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
          {IAMUsersRender}
        </Form.Group>
        <Button  type="submit" variant="primary">
          Submit
        </Button>
        {
          props.stage === "Update account" &&
          <Button 
              variant="primary" 
              onClick={() => props.handleViewChange("Create new account", null )}>
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