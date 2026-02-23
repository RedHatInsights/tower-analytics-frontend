/**
 * Frontend Components Config
 *
 * LOCAL DEVELOPMENT SETUP:
 * ========================
 * This app runs standalone for local development.
 *
 * Start the app: npm start (runs on port 8003)
 * Access: https://localhost:8003/ansible/automation-analytics/
 */
module.exports = {
  appUrl: '/ansible/automation-analytics',
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  /**
   * Sass prefix for the automation-analytics app
   */
  sassPrefix: '.automation-analytics, .automationAnalytics',
  /**
   * Set to false since app should be registered in configuration files
   */
  interceptChromeConfig: false,
  /**
   * Disable chrome dependency for standalone development
   */
  localChrome: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  hotReload: process.env.HOT === 'true',
  moduleFederation: {
    exposes: {
      './RootApp': './src/AppEntry',
    },
    exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: '^6.3.0',
        },
      },
    ],
  },
};
