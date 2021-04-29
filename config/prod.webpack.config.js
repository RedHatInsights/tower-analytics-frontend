// For @redhat-cloud-services/frontend-components-config which ignored the webpack mode
process.env.NODE_ENV = 'production';
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    ...(process.env.BETA && { deployment: 'beta/apps' })
});

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')(
        {
            root: resolve(__dirname, '../')
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

module.exports = function (env) {
    if (env && env.analyze === 'true') {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return {
        ...webpackConfig,
        plugins
    };
};
