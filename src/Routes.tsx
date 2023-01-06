import { Route, Routes, Redirect, useLocation } from 'react-router-dom';
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

const InsightsRoute = ({
  component: Component,
  path,
}: {
  component: ReturnType<typeof asyncComponent>;
  path: string;
}) => {
  /*
   * We are not using page based scss/css rules as we prefer styled components
   * therefore we don't need to add the classto the root element.
   *
   * Leving here for possible future usage.
   */

  // const root = document.getElementById('root');
  // root.removeAttribute('class');
  // root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
  // root.setAttribute('role', 'main');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Route path={path} component={Component} />;
};

export const AnalyticsRoutes: FunctionComponent<Record<string, never>> = () => {
  const { pathname } = useLocation();

  return (
    <Routes>
      {/* Catch urls with the trailing slash and remove it */}
      <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
      {/* Render the valid routes */}
      {Object.keys(components).map((key) => (
        <InsightsRoute key={key} path={key} component={components[key]} />
      ))}
      {/* Redirect the root path to the clusters so it does not give 404. */}
      <Redirect from="/" to={Paths.clusters} exact />
      {/* Finally, catch all unmatched routes and render 404 */}
      <Route>
        <Error404
          data-cy={'error_page_404'}
          body="Sorry, we could not find what you were looking for. The page you requested may have been changed or moved."
        />
      </Route>
    </Routes>
  );
};
