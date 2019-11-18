import React, { useState, useEffect } from 'react'
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';

const AccountForm = (props) => {
  const renderIAMUsers = (newUser) => {
    if(newUser != null) {
      return IAMUsers.concat([newUser]).map(IAMUser => (
        <div key={IAMUser.email}>
          {IAMUser.email}
        </div>
      ))
    }
    if(IAMUsers.length > 0) {
      return IAMUsers.map(IAMUser => (
        <div key={IAMUser.email}>
          {IAMUser.email}
        </div>
      ))
    }
    return;
  }
  const [IAMUser, setIAMUser] = useState({'email':''});
  const [name, setName] = useState(props.selectedAccount.name);
  const [email, setEmail] = useState(props.selectedAccount.email);
  const [status, setStatus] = useState(props.selectedAccount.status);
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
      setIAMUserError('IAM User needs to be an email!');
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
      setIAMUsers([]);
      setEmailError('');
      setNameError('');
      setIAMUserError('');
      setIAMUsersRender(renderIAMUsers(null));
      const addedAccount = await props.apiFunction(account);
      if(!(Object.entries(addedAccount).length === 0 && addedAccount.constructor === Object)) {
        props.refreshList(addedAccount, "create");
      }
    } catch(error) {
      alert(error.message);
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
          <Button onClick={handleArrayChange} variant="primary" size="md">
            Add user
          </Button>
          {IAMUsersRender}
        </Form.Group>
        <Button  type="submit" variant="primary" size="lg">
          Submit
        </Button>
        {updateError}
      </Form>
    </div>
  );
}

export default AccountForm;