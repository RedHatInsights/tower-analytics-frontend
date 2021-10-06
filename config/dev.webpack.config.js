const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const {
  rbac,
  defaultServices,
} = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

// TODO: Add 'prod' - currently it is not wokring while returns
// errors on backend queries: strict cross origin policy
const validEnvValues = ['standalone', 'stage'];

const proxy = validEnvValues.includes(process.env.npm_config_env)
  ? process.env.npm_config_env
  : 'standalone';

const environmentSetup = {
  ...(proxy === 'standalone' && {
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
  }),
  ...(['prod', 'stage'].includes(proxy) && {
    https: true,
    useProxy: true,
    proxyVerbose: true,
    env: `${proxy}-beta`,
  }),
};

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  sassPrefix: '.automation-analytics, .automationAnalytics',
  ...environmentSetup,
  appUrl: ['/beta/ansible/insights/', '/ansible/insights/'],
  deployment: 'beta/apps',
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
