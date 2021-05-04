import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';

const AutomationAnalytics = () => (
  <Provider store={init().getStore()}>
    <Router basename={getBaseName()}>
      <App />
    </Router>
  </Provider>
);

export default AutomationAnalytics;
