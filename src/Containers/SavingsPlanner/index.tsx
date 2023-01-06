import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Paths } from '../../paths';

import Add from './Add';
import Details from './Details';
import List from './List';

export const paths = {
  get: `${Paths.savingsPlanner}`,
  add: `${Paths.savingsPlanner}/add`,
  edit: `${Paths.savingsPlanner}/:id/edit`,
  getEdit: (id: number): string => `${Paths.savingsPlanner}/${id}/edit`,
  details: `${Paths.savingsPlanner}/:id`,
  getDetails: (id: number): string => `${Paths.savingsPlanner}/${id}`,
};

const SavingsPlannerRouter: FunctionComponent<Record<string, never>> = () => {
  return (
    <Routes>
      <Route path={paths.get} element={<List />} />
      <Route path={paths.add} element={<Add />} />
      <Route path={paths.edit} element={<Details />} />
      <Route path={paths.details} element={<Details />} />
    </Routes>
  );
};

export default SavingsPlannerRouter;
