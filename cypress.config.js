const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'wwyf7n',
  video: false,
  videoUploadOnPasses: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  waitForAnimations: true,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 120000,
  requestTimeout: 60000,
  responseTimeout: 60000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  env: {
    appid: '#automation-analytics-application',
  },
  e2e: {
    baseUrl: 'https://stage.foo.redhat.com:1337',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Chrome headless configuration
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--window-size=1920,1080');
          
          // Force screen to be non-retina
          launchOptions.args.push('--force-device-scale-factor=1');
          
          // Additional stability flags
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
        }

        if (browser.name === 'electron' && browser.isHeadless) {
          launchOptions.preferences.width = 1920;
          launchOptions.preferences.height = 1080;
        }

        return launchOptions;
      });
      return config;
    },
  },
});
