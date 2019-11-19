import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import config from './config';
import Amplify from 'aws-amplify';
import { BrowserRouter as Router } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

Amplify.configure({
  API: {
      endpoints: [
        {
          name: "accounts",
          endpoint: config.stage.apiGateway.URL
        },
      ]
    }
});

const checkTokenInURL = function () {
  const hashParameters = window.location.hash.replace('#', '').split('&');
  for (const hashParameter of hashParameters) {
    if (hashParameter.split('=')[0] === 'id_token') {
      const token = hashParameter.split('=')[1];
      localStorage.setItem('token', token);
      console.log('token', token);
    }
  }
  window.history.pushState("", document.title, window.location.pathname + window.location.search);
}
checkTokenInURL();


ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
