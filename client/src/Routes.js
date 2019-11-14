import React from 'react'
import { Route, Switch } from 'react-router-dom';
import AccountsView from './containers/AccountsView';

export default function Routes() {
    return (
      <Switch>
        <Route path="/accounts" exact component={AccountsView} />
      </Switch>
    )
}
