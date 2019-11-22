import React from "react";
import { Route } from "react-router-dom";
// import config from '../../config';

const cognitoUrl = 'https://sky9.auth.eu-west-2.amazoncognito.com';
const clientId = '7g6mk1iukh6cl2h1mosgo0ucie';
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