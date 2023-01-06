import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import Details from './Details';
import List from './List';
import paths from './paths';

const ReportsRouter: FunctionComponent<Record<string, never>> = () => {
  return (
    <Routes>
      <Route exact path={paths.get}>
        <List />
      </Route>
      <Route path={paths.details}>
        <Details />
      </Route>
    </Routes>
  );
};

export default ReportsRouter;
