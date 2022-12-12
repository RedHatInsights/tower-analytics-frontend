import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import './App.scss';
import packageJson from '../package.json';

import useRequest from './Utilities/useRequest';
import { preflightRequest } from './Api/';
import AuthorizationErrorPage from './Components/ApiStatus/AuthorizationErrorPage';
import { Alert } from '@patternfly/react-core';

const el = document.getElementById('global-filter');
if (el) el.style.display = 'none';

const App = () => {
  const history = useHistory();
  const {
    error,
    request: fetchPreflight,
    isLoading,
  } = useRequest(preflightRequest, {});

  useEffect(() => {
    insights.chrome.init();
    insights.chrome.identifyApp('automation-analytics');
    const appNav = insights.chrome.on('APP_NAVIGATION', (event) => {
      history.push(`/${event.navId}`);
    });

    // Fetch on first load and then on page changes
    fetchPreflight();
    const unlisten = history.listen(() => {
      fetchPreflight();
    });

    return () => {
      appNav();
      unlisten();
    };
  }, []);

  const renderContent = () => {
    if (error) return <AuthorizationErrorPage error={error} />;
    if (!isLoading) return <Routes />;
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
