import React from 'react';
import {Route, Switch} from 'react-router-dom';
import AccountsList from './containers/accountsList';
import AccountView from './components/accountView'

export default function Routes() {
    return (
        <Switch> 
            <Route path="/accounts" exact component={AccountsList} />
            <Route path="/accounts/{id}" component={(AccountView)} />
        </Switch>
    )
}
