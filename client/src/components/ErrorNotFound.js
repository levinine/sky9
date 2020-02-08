import React, { Component } from 'react';

export default class ErrorNotFound extends Component {

    render() {
        return (
            <div id='error'>
                <h1 className='notFoundTitle' align='center'>404</h1>
                <h2 className='notFoundTitle' align='center'> page not found</h2>     
            </div>
        );  
    }
}