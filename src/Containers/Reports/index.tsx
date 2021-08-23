import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Paths } from '../../paths';

import Details from './Details';
import List from './List';

export const paths = {
  get: `${Paths.reports}`,
  details: `${Paths.reports}/:slug`,
  getDetails: (slug: string): string => `${Paths.reports}/${slug}`,
};

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
