/* global require, module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true
});
const overrideConfig = require('./overrides.config');
const { output: { filename, chunkFilename }} = overrideConfig;
const combined = {
    ...webpackConfig,
    output: {
        ...webpackConfig.output,
        filename,
        chunkFilename
    }
};

module.exports = {
    ...combined,
    plugins
};
