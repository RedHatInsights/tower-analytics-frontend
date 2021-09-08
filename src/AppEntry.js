import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';
import { Provider as FeatureFlagProvider } from './FeatureFlags/';

const AutomationAnalytics = () => (
  <Provider store={init().getStore()}>
    <FeatureFlagProvider>
      <Router basename={getBaseName()}>
        <App />
      </Router>
    </FeatureFlagProvider>
  </Provider>
);

export default AutomationAnalytics;
