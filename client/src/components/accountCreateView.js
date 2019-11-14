import React, { Component } from 'react'
import { createAccount } from '../service/apiCalls';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';

export default class AccountCreate extends Component {
  constructor() {
    super();
    this.state = { 
      IAMUser: "",
      name:'',
      email:'',
      status:'Active',
      IAMUsers: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleArrayChange = this.handleArrayChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleArrayChange() {
    const newUser = this.state.IAMUser;
    if(newUser.length > 0) {
      this.setState({
        IAMUsers: this.state.IAMUsers.concat([newUser]),
        IAMUser: ''
      })
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const account = {
        name: this.state.name,
        email: this.state.email,
        status: this.state.status,
        IAMUsers: this.state.IAMUsers
      }
      const createdAccount = await createAccount(account);
      this.setState({
        name:'',
        email:'',
        status:'Active',
        IAMUsers:[]
      })
      return createdAccount;
    } catch(error) {
      alert(error.message);
    }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId="name">
          <FormLabel>Name:</FormLabel>
          <FormControl type="text" value={this.state.name} onChange={this.handleChange} placeholder="Enter name" />
        </FormGroup>
        <FormGroup controlId="email">
          <FormLabel>Email:</FormLabel>
          <FormControl type="text" value={this.state.email} onChange={this.handleChange} placeholder="Enter email" />
        </FormGroup>
        <Form.Group controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Control as="select" onChange={this.handleChange} value={this.state.status}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="IAMUser">
          <Form.Label>IAM Users</Form.Label>
          <Form.Control type="text" value={this.state.IAMUser} onChange={this.handleChange} placeholder="Add IAM User"/>
          <Button onClick={this.handleArrayChange} variant="primary" size="md">
            Add user
          </Button>
          {this.state.IAMUsers}
        </Form.Group>
        <Button onClick={this.handleArrayChange} type="submit" variant="primary" size="lg">
          Submit
        </Button>
      </Form>
      
    );
  }
}
