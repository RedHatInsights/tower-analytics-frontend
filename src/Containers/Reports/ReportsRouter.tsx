import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import Details from './Details';
import List from './List';
import paths from './paths';

const ReportsRouter: FunctionComponent<Record<string, never>> = () => {
  return (
    <Switch>
      <Route exact path={paths.get}>
        <List />
      </Route>
      <Route path={paths.details}>
        <Details />
      </Route>
    </Switch>
  );
};

export default ReportsRouter;
