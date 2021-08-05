import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import { Paths } from './paths';

const Clusters = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/Clusters/Clusters'
  )
);
const OrganizationStatistics = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/OrganizationStatistics/OrganizationStatistics'
  )
);
const Notifications = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/Notifications/Notifications'
  )
);
const AutomationCalculator = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/AutomationCalculator/AutomationCalculator'
  )
);

const JobExplorer = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/JobExplorer/JobExplorer'
  )
);

const SavingsPlanAdd = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/SavingsPlanner/Add'
  )
);

const SavingsPlanner = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/SavingsPlanner/List'
  )
);

const SavingsPlan = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/SavingsPlanner/Details'
  )
);

const Reports = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/Reports/List'
  )
);

const Report = asyncComponent(() =>
  import(
    /* webpackChunkName: "automation_analytics" */
    './Containers/Reports/Details'
  )
);

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
  const root = document.getElementById('root');
  root.removeAttribute('class');
  root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
  root.setAttribute('role', 'main');

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
      <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
      <InsightsRoute
        path={Paths.clusters}
        component={Clusters}
        rootClass="clusters"
      />
      <InsightsRoute
        path={Paths.organizationStatistics}
        component={OrganizationStatistics}
        rootClass="organizationStatistics"
      />
      <InsightsRoute
        path={Paths.notifications}
        component={Notifications}
        rootClass="notifications"
      />
      <InsightsRoute
        path={Paths.automationCalculator}
        component={AutomationCalculator}
        rootClass="automationCalculator"
      />
      <InsightsRoute
        path={Paths.jobExplorer}
        component={JobExplorer}
        rootClass="jobExplorer"
      />
      <InsightsRoute
        path={Paths.savingsPlanAdd}
        component={SavingsPlanAdd}
        rootClass="SavingsPlanAdd"
      />
      <InsightsRoute
        path={Paths.savingsPlan}
        component={SavingsPlan}
        rootClass="SavingsPlan"
      />
      <InsightsRoute
        path={Paths.savingsPlanner}
        component={SavingsPlanner}
        rootClass="SavingsPlanner"
      />
      <InsightsRoute
        path={Paths.report}
        component={Report}
        rootClass="Report"
      />
      <InsightsRoute
        path={Paths.reports}
        component={Reports}
        rootClass="Reports"
      />
      {/* Finally, catch all unmatched routes and redirect to Clusters page */}
      <Route>
        <Redirect to={Paths.clusters} />
      </Route>
    </Switch>
  );
};
