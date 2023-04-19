import React, { useState, useEffect } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { getUser, login, logout } from '../../service/authenticationService';
import config from '../../config';

const Menu = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    getUser().then(user => {
      let email = null;
      if (user) {
        if (user.signInUserSession.idToken.payload.email) {
          email = user.signInUserSession.idToken.payload.email;
        } else {
          email = 'CA User';
        }
      }
      setUser(email);
    });
  }, []);

  return (
    <Navbar bg='dark' variant='dark' className='justify-content-between'>
      <Navbar.Brand href='/'>Sky9 {config.appName}</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      {user === null && <Button variant='primary' className='pull-right' onClick={login}>Login</Button>}
      {user !== null && <Button variant='primary' className='pull-right' onClick={logout}>Logout ({user})</Button>}
    </Navbar>
  );
}
export default Menu;
