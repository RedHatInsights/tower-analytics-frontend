// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands';
import './login';
import './pagination';

// Returning false here prevents Cypress from failing the test
// using _err and _runnable arguments is optional
Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false;
});

// Alternatively you can use CommonJS syntax:
// require('./commands')

// these cokies should resolve the accept cookies dialog
beforeEach(() => {
  cy.loginWithPageSession();
});
