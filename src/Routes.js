import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import some from 'lodash/some';
import { Paths } from './paths';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) nameing chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const Clusters = asyncComponent(() =>
    import(
        /* webpackChunkName: "automation_analytics" */
        './Containers/Clusters/Clusters'
    ),
);
const OrganizationStatistics = asyncComponent(() =>
    import(
        /* webpackChunkName: "automation_analytics" */
        './Containers/OrganizationStatistics/OrganizationStatistics'
    ),
);
const Notifications = asyncComponent(() =>
    import(
        /* webpackChunkName: "automation_analytics" */
        './Containers/Notifications/Notifications'
    ),
);
const AutomationCalculator = asyncComponent(() =>
    import(
        /* webpackChunkName: "automation_analytics" */
        './Containers/AutomationCalculator/AutomationCalculator'
    ),
);

const JobExplorer = asyncComponent(() =>
    import(
        /* webpackChunkName: "automation_analytics" */
        './Containers/JobExplorer/JobExplorer'
    ),
);

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (<Route { ...rest } component={ Component } />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = (props) => {
    const path = props.childProps.location.pathname;
    return (
        <Switch>
            <InsightsRoute path={ Paths.clusters } component={ Clusters } rootClass="clusters"/>
            <InsightsRoute path={ Paths.organizationStatistics } component={ OrganizationStatistics } rootClass="organizationStatistics"/>
            <InsightsRoute path={ Paths.notifications } component={ Notifications } rootClass="notifications"/>
            <InsightsRoute path={ Paths.automationCalculator } component={ AutomationCalculator } rootClass="automationCalculator"/>
            <InsightsRoute path={ Paths.jobExplorer } component={ JobExplorer } rootClass="jobExplorer"/>
            { /* Finally, catch all unmatched routes and redirect to Clusters page */ }
            <InsightsRoute path={ () => some(Paths, p => p === path) ? null : (<Redirect to={ Paths.clusters }/>) }/>
        </Switch>
    );
};

Routes.propTypes = {
    childProps: PropTypes.any
};
