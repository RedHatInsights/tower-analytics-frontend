import { Route, Switch, Redirect } from 'react-router-dom';
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

const SavingsPlanner = asyncComponent(() =>
    import(
        /* webpackChunkName: "automation_analytics" */
        './Containers/SavingsPlanner/SavingsPlanner'
    )
);

const SavingsPlan = asyncComponent(() =>
    import(
        /* webpackChunkName: "automation_analytics" */
        './Containers/SavingsPlanner/SavingsPlan'
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
    return (
        <Switch>
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
                path={Paths.savingsPlan}
                component={SavingsPlan}
                rootClass="SavingsPlan"
            />
            <InsightsRoute
                path={Paths.savingsPlanner}
                component={SavingsPlanner}
                rootClass="SavingsPlanner"
            />
            {/* Finally, catch all unmatched routes and redirect to Clusters page */}
            <Route>
                <Redirect to={Paths.clusters} />
            </Route>
        </Switch>
    );
};
