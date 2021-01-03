import React from "react";
import { Route } from "react-router-dom";
// import config from '../../config';

const AuthenticatedRoute = ({ component: C, ...rest }) => {
  return (
    <Route
      {...rest}
      component={ props => <C {...props} /> }
    />
  );
}

export default AuthenticatedRoute;