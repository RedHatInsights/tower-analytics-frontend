import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsRoutes } from './Routes';
import './App.scss';
import packageJson from '../package.json';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import useRequest from './Utilities/useRequest';
import { preflightRequest } from './Api/';
import AuthorizationErrorPage from './Components/ApiStatus/AuthorizationErrorPage';

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
    identifyApp('automation-analytics');
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
      {renderContent()}
    </div>
  );
};

export default App;
