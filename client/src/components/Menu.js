import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';

import config from '../config';

const cognitoUrl = config.cognitoUrl;
const clientId = config.cognitoClientId;


const appUrl = localStorage.getItem('baseUrl')

class Menu extends React.Component {
  logout = () => {
    localStorage.removeItem('token');
    window.location.href = `${cognitoUrl}/logout?logout_uri=${appUrl}&client_id=${clientId}`;
  }

  getUser = () => {
    const token = localStorage.getItem('token');
    return token ? jwt_decode(token).email : null;
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark" className="justify-content-between">
        <Navbar.Brand href="/">Sky9</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        { this.getUser() === null && <Button variant="primary" className="pull-right" onClick={this.login}>Login</Button> }
        { this.getUser() !== null && <Button variant="primary" className="pull-right" onClick={this.logout}>Logout ({this.getUser()})</Button> }
      </Navbar>
    );
  }
}
export default Menu;