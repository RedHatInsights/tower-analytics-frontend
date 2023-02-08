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
import './commands'
import './login'
import './pagination'

// Returning false here prevents Cypress from failing the test
Cypress.on('uncaught:exception', (err, runnable) => {
    return false
});

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(() => {
  Cypress.Cookies.debug(true);
  // these cokies should resolve the accept cookies dialog
  cy.setCookie('cmapi_cookie_privacy', 'permit 1,2,3', { secure: true });
  cy.setCookie('cmapi_gtm_bl', '', { secure: true });
  cy.setCookie('notice_preferences', '2:', { secure: true });
  cy.setCookie('notice_behavior', 'expressed,eu', { secure: true });
  cy.setCookie('notice_gdpr_prefs', '0,1,2:', { secure: true });

  cy.login();
});

// after(() => {
//   cy.getByIdLike('#UserMenu').as('userMenu');
//   cy.get('@userMenu').then(() =>{
//     cy.get('@userMenu').click({ force: true });
//     cy.get('[aria-labelledby="UserMenu"]').find('button').as('logoutButton');
//     cy.get('@logoutButton').contains('Log out').click({ force: true });
//   })
// });
