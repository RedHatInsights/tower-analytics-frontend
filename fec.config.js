module.exports = {
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  appUrl: ['/ansible/automation-analytics/', '/ansible/automation-analytics'],
  plugins: [],
  // sassPrefix: '.automation-analytics, .automationAnalytics',

  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      { 'react-router-dom': { singleton: true, version: '*', import: false } },
    ],
  },
};
