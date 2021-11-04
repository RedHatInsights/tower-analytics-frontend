import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import React, { FunctionComponent } from 'react';
import asyncComponent from './Utilities/asyncComponent';
import { Paths } from './paths';
import Error404 from './Components/Error404';
import { useFeatureFlag, ValidFeatureFlags } from './FeatureFlags';

const components = (newAutomaticCalculator: boolean) => ({
  [Paths.clusters]: asyncComponent(
    () => import('./Containers/Clusters/Clusters')
  ),
  [Paths.organizationStatistics]: asyncComponent(
    () => import('./Containers/OrganizationStatistics/OrganizationStatistics')
  ),
  [Paths.notifications]: asyncComponent(
    () => import('./Containers/Notifications/Notifications')
  ),
  [Paths.automationCalculator]: asyncComponent(() =>
    newAutomaticCalculator
      ? import('./Containers/AutomationCalculatorNew/AutomationCalculator')
      : import('./Containers/AutomationCalculator/AutomationCalculator')
  ),
  [Paths.jobExplorer]: asyncComponent(
    () => import('./Containers/JobExplorer/JobExplorer')
  ),
  [Paths.savingsPlanner]: asyncComponent(
    () => import('./Containers/SavingsPlanner')
  ),
  [Paths.reports]: asyncComponent(() => import('./Containers/Reports')),
});

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

export const Routes: FunctionComponent<Record<string, never>> = () => {
  const { pathname } = useLocation();
  const newAutomationCalculatorFlag = useFeatureFlag(
    ValidFeatureFlags.newAutomationCalculator
  );

  return (
    <Switch>
      {/* Catch urls with the trailing slash and remove it */}
      <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
      {/* Render the valid routes */}
      {Object.keys(components(newAutomationCalculatorFlag)).map((key) => (
        <InsightsRoute
          key={key}
          path={key}
          component={components(newAutomationCalculatorFlag)[key]}
        />
      ))}
      {/* Finally, catch all unmatched routes and render 404 */}
      <Route>
        <Error404 body="Sorry, we could not find what you were looking for. The page you requested may have been changed or moved." />
      </Route>
    </Switch>
  );
};