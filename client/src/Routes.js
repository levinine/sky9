import React from 'react'
import { Route, Switch } from 'react-router-dom';
import AccountsView from './containers/AccountsView';
import ErrorNotFound from './components/ErrorNotFound'
export default function Routes() {
    return (
      <Switch>
        <Route path="/" exact component={AccountsView}/>
        <Route path="*" component={ErrorNotFound} />
      </Switch>

    )
}
