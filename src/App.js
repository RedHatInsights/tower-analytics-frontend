import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnalyticsRoutes } from './Routes';
import './App.scss';
import packageJson from '../package.json';

import useRequest from './Utilities/useRequest';
import { preflightRequest } from './Api/';
import AuthorizationErrorPage from './Components/ApiStatus/AuthorizationErrorPage';

const el = document.getElementById('global-filter');
if (el) el.style.display = 'none';

const App = () => {
  const navigate = useNavigate();
  const {
    error,
    request: fetchPreflight,
    isLoading,
  } = useRequest(preflightRequest, {});
  const location = useLocation();

  useEffect(() => {
    insights.chrome.init();
    insights.chrome.identifyApp('automation-analytics');
    const appNav = insights.chrome.on('APP_NAVIGATION', (event) => {
      navigate(`/${event.navId}`);
    });

    // Fetch on first load and then on page changes
    fetchPreflight();
    return () => {
      appNav();
    };
  }, []);

  useEffect(() => {
    fetchPreflight();
  }, [location]);

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
