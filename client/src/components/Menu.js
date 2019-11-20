import React from 'react';
import {Navbar} from 'react-bootstrap';

class Menu extends React.Component{
    render(){
        return(
            <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Sky9</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            </Navbar>
        );
    }
}
export default Menu;