import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import './App.scss';
import packageJson from '../package.json';

import { useRequest } from './Utilities/useRequest';
import { preflightRequest } from './Api/';
import AuthorizationErrorPage from './Components/ApiStatus/AuthorizationErrorPage';

const App = () => {
  const history = useHistory();
  const { error, request: fetchPreflight } = useRequest(preflightRequest, {});

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
    return <Routes />;
  };

  return (
    <div id="automation-analytics-application" version={packageJson.version}>
      {renderContent()}
    </div>
  );
};

export default App;
