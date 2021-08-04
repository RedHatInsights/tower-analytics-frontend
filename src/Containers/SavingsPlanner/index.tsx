import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Paths } from '../../paths';

import Add from './Add';
import Details from './Details';
import List from './List';

export const paths = {
  get: `${Paths.savingsPlanner}`,
  add: `${Paths.savingsPlanner}/add`,
  edit: `${Paths.savingsPlanner}/:id/edit`,
  details: `${Paths.savingsPlanner}/:id`,
};

const SavingsPlanner: FunctionComponent<Record<string, never>> = () => {
  return (
    <Switch>
      <Route exact path={paths.get}>
        <List />
      </Route>
      <Route exact path={paths.add}>
        <Add />
      </Route>
      <Route path={[paths.edit, paths.details]}>
        <Details />
      </Route>
    </Switch>
  );
};

export default SavingsPlanner;
