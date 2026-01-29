/**
 * Frontend Components Config
 *
 * LOCAL DEVELOPMENT SETUP:
 * ========================
 * This app runs alongside insights-chrome for local development.
 *
 * 1. Clone insights-chrome: git clone https://github.com/RedHatInsights/insights-chrome
 * 2. Add route to insights-chrome/config/webpack.config.js:
 *    routes: {
 *      '/apps/automation-analytics': { host: 'https://localhost:8003' },
 *    }
 * 3. Start this app: npm start (runs on port 8003)
 * 4. Start insights-chrome: cd insights-chrome && npm run dev (runs on port 1337)
 * 5. Access: https://prod.foo.redhat.com:1337/ansible/automation-analytics/
 *
 * Note: Requires VPN and hosts file entry for prod.foo.redhat.com
 */
module.exports = {
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  appUrl: ['/ansible/automation-analytics/', '/ansible/automation-analytics'],
  plugins: [],
  port: 8003,
  localChrome: true, // Chrome comes from insights-chrome, skip Podman
  // sassPrefix: '.automation-analytics, .automationAnalytics',

  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      { 'react-router-dom': { singleton: true, version: '*', import: false } },
    ],
  },
};
