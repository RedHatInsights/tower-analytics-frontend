import React from 'react';
import { Provider } from 'react-redux';

import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';

import './polyfills';
import store from './store';
import App from './App';
import { QueryParamsProvider } from './QueryParams';

const AutomationAnalytics = () => (
  <Provider store={store}>
    <QueryParamsProvider>
      <NotificationPortal />
      <App />
    </QueryParamsProvider>
  </Provider>
);

export default AutomationAnalytics;
