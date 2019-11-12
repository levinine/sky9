import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import config from './config';
import Amplify from 'aws-amplify';

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

ReactDOM.render(<App />, document.getElementById('root'));
