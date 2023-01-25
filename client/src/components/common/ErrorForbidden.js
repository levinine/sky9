import React, { Component } from 'react';

export default class ErrorForbidden extends Component {

  render() {
    return (
      <div id='error'>
        <h1 align='center'>403</h1>
        <h2 align='center'>you don't have permission to use this app</h2>
      </div>
    );
  }
}