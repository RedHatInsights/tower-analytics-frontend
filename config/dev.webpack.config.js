const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const {
  rbac,
  defaultServices,
} = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

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
  registry: [
    ({ app }) =>
      app.get('(/beta)?/config/chrome/ansible-navigation.json', (_req, res) =>
        res.sendFile(resolve(__dirname, './ansible-navigation.json'))
      ),
  ],
  appUrl: ['/beta/ansible/insights/', '/ansible/insights/'],
  proxyVerbose: true,
  ...(process.env.BETA && { deployment: 'beta/apps' }),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      useFileHash: false,
      exclude: [
        '@patternfly/react-core',
        '@patternfly/react-table',
        '@patternfly/react-tokens',
        '@patternfly/react-icons',
        '@redhat-cloud-services/frontend-components',
        '@redhat-cloud-services/frontend-components-utilities',
        '@redhat-cloud-services/frontend-components-notifications',
      ],
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};
