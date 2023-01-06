import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import React, { FunctionComponent } from 'react';
import asyncComponent from './Utilities/asyncComponent';
import { Paths } from './paths';
import Error404 from './Components/Error404';

const components = {
  [Paths.clusters]: asyncComponent(
    () => import('./Containers/Clusters/Clusters')
  ),
  [Paths.organizationStatistics]: asyncComponent(
    () => import('./Containers/OrganizationStatistics/OrganizationStatistics')
  ),
  [Paths.notifications]: asyncComponent(
    () => import('./Containers/Notifications/Notifications')
  ),
  [Paths.automationCalculator]: asyncComponent(
    () => import('./Containers/Reports')
  ),
  [Paths.jobExplorer]: asyncComponent(
    () => import('./Containers/JobExplorer/JobExplorer')
  ),
  [Paths.savingsPlanner]: asyncComponent(
    () => import('./Containers/SavingsPlanner')
  ),
  [Paths.reports]: asyncComponent(() => import('./Containers/Reports')),
};

export const AnalyticsRoutes: FunctionComponent<Record<string, never>> = () => {
  const { pathname } = useLocation();

  return (
    <Routes>
      {/* Catch urls with the trailing slash and remove it */}
      <Route
        path="/:url*(/+)"
        element={<Navigate to={pathname.slice(0, -1)} replace />}
      />
      {/* Finally, catch all unmatched routes and render 404 */}
      <Route path='*' element={<Error404
          data-cy={'error_page_404'}
          body="Sorry, we could not find what you were looking for. The page you requested may have been changed or moved."
      />} />

      {/* Render the valid routes */}
      {Object.keys(components).map((key) => {
        const Component: any = components[key];
        return (
          <Route key={key} path={key} element={<Component />} />
      )})}
      {/* Redirect the root path to the clusters so it does not give 404. */}
      <Route path="/" element={<Navigate to={Paths.clusters} replace />} />
    </Routes>
  );
};
