import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { init as initAuthentication } from './service/authenticationService';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

initAuthentication();

ReactDOM.render(
  <Router>
    <App/>
  </Router>,
  document.getElementById('root')
);
