import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import packageJson from '../package.json';

const App = (props) => {

    useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp('automation-analytics');
        const appNav = insights.chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent) {
                props.history.push(`/${event.navId}`);
            }
        });

        return () => {
            appNav();
        };
    }, []);

    return (
        <div id="automation-analytics-application" version={ packageJson.version }>
            <Routes childProps={ props } />
        </div>
    );
};

App.propTypes = {
    history: PropTypes.object
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter (connect()(App));
