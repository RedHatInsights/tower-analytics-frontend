import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';

import './polyfills';
import store from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';
import { QueryParamsProvider } from './QueryParams';

const AutomationAnalytics = () => (
  <Provider store={store}>
    <Router basename={getBaseName()}>
      <QueryParamsProvider>
        <NotificationPortal />
        <App />
      </QueryParamsProvider>
    </Router>
  </Provider>
);

export default AutomationAnalytics;
