import React, { useState } from 'react'
import { createAccount } from '../service/apiCalls';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';

const AccountCreate = () => {
  const [IAMUser, setIAMUser] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active');
  const [IAMUsers, setIAMUsers] = useState([]);

  const [IAMUserError, setIAMUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const handleArrayChange = () => {
    console.log(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test('sddsfdgsg'))
    console.log(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test('arulgetsolute@gmail.com'))
    console.log(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test('arulgetsolute@gmail.'))
    if(!IAMUser.includes('@')) {
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
    try {
      const account = {
        name: name,
        email: email,
        status: status,
        IAMUsers: IAMUsers
      }
      const createdAccount = await createAccount(account);
      setName('');
      setEmail('');
      setStatus('');
      setIAMUsers('');
      return createdAccount;
    } catch(error) {
      alert(error.message);
    }
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup controlId="name">
        <FormLabel>Name:</FormLabel>
        <FormControl type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Enter name" />
      </FormGroup>
      <FormGroup controlId="email">
        <FormLabel>Email:</FormLabel>
        <FormControl type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter email" />
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

export default AccountCreate;