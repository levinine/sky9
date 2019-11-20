import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import './Form.css';

const AccountForm = (props) => {

  const {
    stage,
    selectedAccount,
    validateEmail,
    refreshList,
    apiFunction,
    handleViewChange
  } = props;

  //needed here for initializing IAMUsers in update form
  const renderIAMUsers = newUser => {    
    let users = null;
    if(newUser != null) {
      users = IAMUsers.concat([newUser]).map((IAMUser,index) => <tr key={IAMUser.email}><td>{index+1}</td><td>{IAMUser.email}</td><td><Button size="sm" variant="danger"  onClick={() => deleteIAMUser(index)}>Delete</Button></td></tr> )
      return(
        <table id="myTable" width="100%">
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
    if(IAMUsers.length > 0) {
      console.log('probo sam');
      users = IAMUsers.map((IAMUser,index) => <tr key={IAMUser.email}><td>{index+1}</td><td>{IAMUser.email}</td><td><Button size="sm" variant="danger" onClick={() => deleteIAMUser(index)} >Delete</Button></td></tr> )
      console.log(users);
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
  }

  const [name, setName] = useState(selectedAccount.name);
  const [email, setEmail] = useState(selectedAccount.email);
  const [status, setStatus] = useState(selectedAccount.status);
  const [IAMUser, setIAMUser] = useState({'email':''});
  const [IAMUsers, setIAMUsers] = useState(selectedAccount.IAMUsers);
  const [IAMUsersRender, setIAMUsersRender] = useState(renderIAMUsers(null));
  
  const [updateError, setUpdateError] = useState(null);
  const [IAMUserError, setIAMUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [nameError, setNameError] = useState(null);

  let initialAccount = null;
  useEffect(() => {
    initialAccount = selectedAccount
  }, [])

  useEffect(() => {
    setName(selectedAccount.name);
    setEmail(selectedAccount.email);
    setStatus(selectedAccount.status);
    setIAMUsers(selectedAccount.IAMUsers);
    setIAMUsersRender(renderIAMUsers(null));
    console.log('ofjjjj');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const deleteIAMUser = index => {
    const newIAMUsersArray = IAMUsers;
    newIAMUsersArray.splice(index,1);
    setIAMUsers(newIAMUsersArray);
    console.log("prvi pt")
    setIAMUsersRender(renderIAMUsers(null));
    console.log("drugi pt")
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
      setIAMUsersRender(renderIAMUsers(newUser));
    } else {
      setIAMUserError('IAM User can\'t be empty');
    }
  }

  const validateForm = () => {
    if(!name.length > 0) {
      setNameError('Name is required!')  
      console.log("pao na prvoj");
      return false;
    } 
    else if(!validateEmail(email)) {
      setEmailError('This needs to be an email!');
      console.log("pao na drugoj");
      return false;
    } else if(stage === "Update account") {  
      const currentAccount = {
        name: name,
        email: email,
        status: status,
        IAMUsers: IAMUsers,
        id: selectedAccount.id
      }
      if(JSON.stringify(currentAccount) === JSON.stringify(initialAccount)){ 
        setUpdateError('User has no changes to update!');
        console.log("pao na trecoj");
        console.log(currentAccount);
        console.log(initialAccount);
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
        id:selectedAccount.id
      }
      if(stage === "Create new account") {
        setIAMUsers([]);
      }
      setName('');
      setEmail('');
      setStatus('');
      setIAMUser({'email':''});
      setEmailError('');
      setNameError('');
      setIAMUserError('');
      setIAMUsersRender(renderIAMUsers(null));
      const returnedAccount = await apiFunction(account);
      if(!(Object.entries(returnedAccount).length === 0 && returnedAccount.constructor === Object)) {
        refreshList(returnedAccount, stage);
      }
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h2>{stage}</h2>
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