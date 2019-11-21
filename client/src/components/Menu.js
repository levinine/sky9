import React from 'react';
import { Button, Navbar } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';

const cognitoUrl = 'https://sky9.auth.eu-west-2.amazoncognito.com';
const clientId = '7g6mk1iukh6cl2h1mosgo0ucie';


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