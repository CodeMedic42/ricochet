import React, { memo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Example1Page from './pages/example-1-page';

function Routes() {
    return (
        <Switch>
            <Route exact path="/examples/1">
                <Example1Page />
            </Route>
            <Route>
                <Redirect to="/examples/1" />
            </Route>
        </Switch>
    );
}

export default memo(Routes);
