import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsRoutes } from './Routes';
import './App.scss';
import packageJson from '../package.json';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import useRequest from './Utilities/useRequest';
import { preflightRequest } from './Api/';
import AuthorizationErrorPage from './Components/ApiStatus/AuthorizationErrorPage';
import { Alert } from '@patternfly/react-core';

const el = document.getElementById('global-filter');
if (el) el.style.display = 'none';

let APPLICATION_NAME = 'automation-analytics';

const App = () => {
  const {
    error,
    request: fetchPreflight,
    isLoading,
  } = useRequest(preflightRequest, {});
  const location = useLocation();
  const { identifyApp, updateDocumentTitle } = useChrome();

  useEffect(() => {
    identifyApp(APPLICATION_NAME);
    updateDocumentTitle(APPLICATION_NAME);
    fetchPreflight();
  }, []);

  useEffect(() => {
    fetchPreflight();
  }, [location.pathname]);

  const renderContent = () => {
    if (error) return <AuthorizationErrorPage error={error} />;
    if (!isLoading) return <AnalyticsRoutes />;
    return <></>;
  };

  return (
    <div id="automation-analytics-application" version={packageJson.version}>
      <Alert
        isInline
        variant="info"
        title="Automation Analytics is experiencing performance issues. Displayed data will be delayed. We apologize for the inconvenience."
      />
      {renderContent()}
    </div>
  );
};

export default App;
