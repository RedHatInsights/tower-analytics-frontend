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
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
