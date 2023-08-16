const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  https: true,
  sassPrefix: '.automation-analytics, .automationAnalytics',
  useCloud: true,
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      exclude: [
        'react-router-dom',
        '@patternfly/react-core',
        '@ansible/ansible-ui-framework',
        '@patternfly/react-icons',
        '@patternfly/react-tokens',
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
