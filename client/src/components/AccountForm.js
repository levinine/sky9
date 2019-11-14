import React, { useState } from 'react'
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';

const AccountForm = (props) => {
  const [IAMUser, setIAMUser] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active');
  const [IAMUsers, setIAMUsers] = useState([]);

  const [IAMUserError, setIAMUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [nameError, setNameError] = useState(null);
  

  const handleArrayChange = () => {
    if(IAMUser.length > 0 && !props.validateEmail(IAMUser)) {
      setIAMUserError('IAM User needs to be an email!');
      return;
    } 
    const newUser = IAMUser;
    if(newUser.length > 0) {
      setIAMUsers(IAMUsers.concat([newUser]));
      setIAMUser('');
      setIAMUserError('');
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!name.length > 0) {
      setNameError('Name is required!')  
      return;
    } 
    else if(!props.validateEmail(email)) {
      setEmailError('This needs to be an email!');
      return;
    } 
    try {
      const account = {
        name: name,
        email: email,
        status: status,
        IAMUsers: IAMUsers
      }
      setName('');
      setEmail('');
      setStatus('');
      setIAMUsers('');
      setEmailError('');
      setNameError('');
      setIAMUserError('');
      return await props.apiFunction(account);
    } catch(error) {
      alert(error.message);
    }
  }

  return (
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
        <Form.Control type="text" value={IAMUser} onChange={event => setIAMUser(event.target.value)} placeholder="Add IAM User"/>
        {IAMUserError}
        <Button onClick={handleArrayChange} disabled={false} variant="primary" size="md">
          Add user
        </Button>
        {IAMUsers}
      </Form.Group>
      <Button onClick={handleArrayChange} type="submit" variant="primary" size="lg">
        Submit
      </Button>
    </Form>
  );
}

export default AccountForm;