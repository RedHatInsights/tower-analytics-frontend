const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const {
  rbac,
  defaultServices,
} = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

// TODO: Add 'prod' - currently it is not wokring while returns
// errors on backend queries: strict cross origin policy
const validEnvValues = ['standalone', 'stage', 'eph'];

const env = validEnvValues.includes(process.env.npm_config_env)
  ? process.env.npm_config_env
  : 'standalone';

// Only when using ephemeral environment
const ephId = process.env.npm_config_eph_id ?? '1';

const environmentSetup = {
  ...(env === 'standalone' && {
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
        app.get('/api/featureflags/v0', (_req, res) => {
          res.send({ toggles: [] });
        }),
      ({ app }) =>
        app.get(
          '(/beta)?/config/chrome/ansible-navigation.json',
          (_req, res) => {
            res.sendFile(resolve(__dirname, './ansible-navigation.json'));
          }
        ),
    ],
  }),
  ...(['prod', 'stage'].includes(env) && {
    https: true,
    useProxy: true,
    proxyVerbose: true,
    env: `${env}-beta`,
  }),
  ...(['eph'].includes(env) && {
    https: true,
    useProxy: true,
    proxyVerbose: true,
    env: 'qa-beta', // TODO change to whatewer the aggregator pulls data from
    keycloakUri: `https://keycloak-ephemeral-${ephId}.apps.c-rh-c-eph.8p0c.p1.openshiftapps.com`,
    target: `https://front-end-aggregator-ephemeral-${ephId}.apps.c-rh-c-eph.8p0c.p1.openshiftapps.com`,
  }),
};

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  sassPrefix: '.automation-analytics, .automationAnalytics',
  appUrl: [
    '/beta/ansible/automation-analytics/',
    '/ansible/automation-analytics/',
  ],
  ...(env === 'standalone' && { deployment: 'beta/apps' }),
  ...environmentSetup,
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
      shared: [
        {
          'react-router-dom': { singleton: true, requiredVersion: '*' },
        },
      ],
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};
