import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'wwyf7n',
  waitForAnimations: true,
  viewportHeight: 2000,
  video: false,
  videoUploadOnPasses: false,
  viewportWidth: 1600,
  pageLoadTimeout: 120000,
  responseTimeout: 60000,
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  env: {
    appid: '#automation-analytics-application',
    USERNAME: 'admin',
    PASSWORD: 'admin',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl:
      'https://stage.foo.redhat.com:1337/beta/ansible/automation-analytics',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
