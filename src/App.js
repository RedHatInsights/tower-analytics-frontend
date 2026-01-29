// Rebuild to pick up latest insights-frontend-builder-common (9026daa+)
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import packageJson from '../package.json';
import { preflightRequest } from './Api/';
import './App.scss';
import AuthorizationErrorPage from './Components/ApiStatus/AuthorizationErrorPage';
import { AnalyticsRoutes } from './Routes';
import useRequest from './Utilities/useRequest';

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
    <div id='automation-analytics-application' version={packageJson.version}>
      {renderContent()}
    </div>
  );
};

export default App;
