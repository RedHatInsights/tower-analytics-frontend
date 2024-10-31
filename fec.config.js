module.exports = {
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  appUrl: ['/ansible/automation-analytics/', '/ansible/automation-analytics'],
  plugins: [],
  // sassPrefix: '.automation-analytics, .automationAnalytics',
  routes: {
    '/api/chrome-service/v1/static': { host: 'http://127.0.0.1:8000' },
  },
  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      { 'react-router-dom': { singleton: true, version: '*', import: false } },
    ],
  },
};
