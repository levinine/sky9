import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { getUser, login, logout } from '../service/authenticationService';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }
  componentDidMount() {
    getUser().then(user => {
      this.setState({ user: user ? user.signInUserSession.idToken.payload.email : null });
    });
  }

  render() {
    return (
      <Navbar bg='dark' variant='dark' className='justify-content-between'>
        <Navbar.Brand href='/'>Sky9</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        { this.state.user === null && <Button variant='primary' className='pull-right' onClick={login}>Login</Button> }
        { this.state.user !== null && <Button variant='primary' className='pull-right' onClick={logout}>Logout ({this.state.user})</Button> }
      </Navbar>
    );
  }
}
export default Menu;