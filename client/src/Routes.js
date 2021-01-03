import React from 'react'
import { Route, Switch } from 'react-router-dom';
import AccountsView from './containers/AccountsView';
import ErrorNotFound from './components/ErrorNotFound'
import AuthenticatedRoute from './components/Routes/AuthenticatedRoute';
export default function Routes() {

    return (
      <Switch>
        <AuthenticatedRoute path="/" exact component={AccountsView}/>
        <Route path="*" component={ErrorNotFound} />
      </Switch>

    )
}
