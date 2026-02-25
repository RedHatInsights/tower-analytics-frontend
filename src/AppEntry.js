import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { QueryParamsProvider } from './QueryParams';
import notificationStore from './notificationStore';
import './polyfills';
import store from './store';

const AutomationAnalytics = () => (
  <Provider store={store}>
    <NotificationsProvider store={notificationStore}>
      <QueryParamsProvider>
        <NotificationPortal />
        <App />
      </QueryParamsProvider>
    </NotificationsProvider>
  </Provider>
);

// imported directly by fec
export default AutomationAnalytics;
