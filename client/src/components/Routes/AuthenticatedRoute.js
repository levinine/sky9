import React from 'react';
import { Route } from 'react-router-dom';

import config from '../../config';

const cognitoUrl = config.cognitoUrl;
const clientId = config.cognitoClientId;
const appUrl = localStorage.getItem('baseUrl');

const redirect = () => {
  window.location.href = `${cognitoUrl}/oauth2/authorize?redirect_uri=${appUrl}&response_type=TOKEN&client_id=${clientId}&scope=openid`;
  return null; 
};

const AuthenticatedRoute = ({ component: C, token, ...rest }) => {
  return (
    <Route
      {...rest}
      component={props => 
        token ?  
        <C {...props} /> : 
        redirect()
      }
    />
  );
}

export default AuthenticatedRoute;