import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { QueryParamsProvider } from './QueryParams';
import './polyfills';
import store from './store';

const AutomationAnalytics = () => (
  <Provider store={store}>
    <QueryParamsProvider>
      <NotificationPortal />
      <App />
    </QueryParamsProvider>
  </Provider>
);

export default AutomationAnalytics;
