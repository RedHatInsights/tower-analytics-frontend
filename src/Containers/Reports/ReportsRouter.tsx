import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import Details from './Details';
import List from './List';
import paths from './paths';

const ReportsRouter: FunctionComponent<Record<string, never>> = () => {
  return (
    <Routes>
      <Route path={paths.get} element={<List />} />
      <Route path={paths.details} element={<Details />} />
      <Route path={paths.automationCalculator} element={<Details />} />
    </Routes>
  );
};

export default ReportsRouter;
