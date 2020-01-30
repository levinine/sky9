import React from 'react'
import { Route, Switch } from 'react-router-dom';
import AccountsView from './containers/AccountsView';
import ErrorNotFound from './components/ErrorNotFound';
import ErrorForbidden from './components/ErrorForbidden';
import AuthenticatedRoute from './components/Routes/AuthenticatedRoute';
export default function Routes() {

    const token = localStorage.getItem('token');
    return (
      <Switch>
        <AuthenticatedRoute path="/" exact component={AccountsView} token={token} />
        <Route path="/forbidden" component={ErrorForbidden} />
        <Route path="*" component={ErrorNotFound} />
      </Switch>

    )
}
