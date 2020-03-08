import React from 'react'
import { Route, Switch } from 'react-router-dom';

import AccountsView from './containers/AccountsView';
import Login from './components/Login';
import ErrorNotFound from './components/ErrorNotFound';
import ErrorForbidden from './components/ErrorForbidden';

export default function Routes() {

    return (
      <Switch>
        <Route path='/' exact component={AccountsView} />
        <Route path='/login' component={Login} />
        <Route path='/forbidden' component={ErrorForbidden} />
        <Route path='*' component={ErrorNotFound} />
      </Switch>
    )
}
