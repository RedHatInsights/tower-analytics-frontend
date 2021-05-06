import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import './App.scss';
import packageJson from '../package.json';

const App = () => {
  const history = useHistory;
  useEffect(() => {
    insights.chrome.init();
    insights.chrome.identifyApp('automation-analytics');
    const appNav = insights.chrome.on('APP_NAVIGATION', (event) => {
      if (event.domEvent) {
        history.push(`/${event.navId}`);
      }
    });

    return () => {
      appNav();
    };
  }, []);
  /**
   * Remove automation-analytics class once main.yml has module config
   */

  return (
    <div
      className="automation-analytics"
      id="automation-analytics-application"
      version={packageJson.version}
    >
      <Routes />
    </div>
  );
};

export default App;
