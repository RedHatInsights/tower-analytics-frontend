const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const {
  rbac,
  defaultServices,
} = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

defaultServices.config.path =
  'https://github.com/redallen/cloud-services-config#tower-analytics-dev';

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  sassPrefix: '.automation-analytics, .automationAnalytics',
  useCloud: true,
  https: false,
  standalone: {
    apiAnalytics: {
      context: ['/api/tower-analytics'],
      target: 'http://localhost:8004',
    },
    rbac,
    ...defaultServices,
  },
  appUrl: ['/beta/ansible/insights/', '/ansible/insights/'],
  ...(process.env.BETA && { deployment: 'beta/apps' }),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      useFileHash: false,
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};
