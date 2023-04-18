import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { getUser, login, logout } from '../../service/authenticationService';
import config from '../../config';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }
  componentDidMount() {
    getUser().then(user => {
      let email = null;
      if (user) {
        if (user.signInUserSession.idToken.payload.email) {
          email = user.signInUserSession.idToken.payload.email;
        } else {
          email = 'CA User';
        }
      }
      this.setState({ user: email });
    });
  }

  render() {
    return (
      <Navbar bg='dark' variant='dark' className='justify-content-between'>
        <Navbar.Brand href='/'>Sky9 {config.appName}</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        { this.state.user === null && <Button variant='primary' className='pull-right' onClick={login}>Login</Button> }
        { this.state.user !== null && <Button variant='primary' className='pull-right' onClick={logout}>Logout ({this.state.user})</Button> }
      </Navbar>
    );
  }
}
export default Menu;