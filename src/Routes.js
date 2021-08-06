import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import { Paths } from './paths';

const components = {
  clusters: asyncComponent(() => import('./Containers/Clusters/Clusters')),
  organizationStatistics: asyncComponent(() =>
    import('./Containers/OrganizationStatistics/OrganizationStatistics')
  ),
  notifications: asyncComponent(() =>
    import('./Containers/Notifications/Notifications')
  ),
  automationCalculator: asyncComponent(() =>
    import('./Containers/AutomationCalculator/AutomationCalculator')
  ),
  jobExplorer: asyncComponent(() =>
    import('./Containers/JobExplorer/JobExplorer')
  ),
  savingsPlanner: asyncComponent(() => import('./Containers/SavingsPlanner/')),
  reports: asyncComponent(() => import('./Containers/Reports/')),
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
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

  return <Route {...rest} component={Component} />;
};

InsightsRoute.propTypes = {
  component: PropTypes.func,
  rootClass: PropTypes.string,
};

export const Routes = () => {
  const { pathname } = useLocation();

  return (
    <Switch>
      {/* Catch urls with the trailing slash and remove it */}
      <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
      {/* Render the valid routes */}
      {Object.keys(components).map((key) => (
        <InsightsRoute
          key={key}
          path={Paths[key]}
          component={components[key]}
          rootClass={key}
        />
      ))}
      {/* Finally, catch all unmatched routes and redirect to Clusters page */}
      <Route>
        <Redirect to={Paths.clusters} />
      </Route>
    </Switch>
  );
};
