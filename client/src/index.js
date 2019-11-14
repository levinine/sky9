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
})

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
