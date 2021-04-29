const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true,
    useFileHash: false,
    ...(process.env.BETA && { deployment: 'beta/apps' })
});

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')(
        {
            root: resolve(__dirname, '../'),
            useFileHash: false,
            exposes: {
                './RootApp': resolve(__dirname, '../src/AppEntry')
            }
        }
    )
);
const srcDir = resolve(__dirname, '../src');
// Fix JS config
webpackConfig.module.rules[1] = {
    test: /\.jsx?$/,
    include: srcDir,
    use: 'babel-loader'
};
// Remove TS config
webpackConfig.module.rules.splice(2, 1);
module.exports = {
    ...webpackConfig,
    plugins
};
