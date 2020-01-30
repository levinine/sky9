import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';


import App from './App';
import config from './config';

import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

Amplify.configure({
  API: {
    endpoints: [{
      name: 'accounts',
      endpoint: config.apiUrl,
      custom_header: () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization : token } : {};
      }
    }]
  }
});
localStorage.setItem('baseUrl', config.baseUrl);

const history = createBrowserHistory();
const checkTokenInURL = function () {
  const hashParameters = window.location.hash.replace('#', '').split('&');
  let error = false;
  for (const hashParameter of hashParameters) {
    if (hashParameter.split('=')[0] === 'id_token') {
      const token = hashParameter.split('=')[1];
      localStorage.setItem('token', token);
      console.log('token', token);
    }
    if (hashParameter.split('=')[0] === 'error') {
      error = true;
    }
  }
  // window.history.pushState('', document.title, window.location.pathname + window.location.search);
  history.push(error ? 'forbidden' : '/');
}
checkTokenInURL();

ReactDOM.render(
  <Router>
    <App/>
  </Router>,
  document.getElementById('root')
);
