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
    cy.login();
});

after(() => {
    cy.get('#UserMenu').click({ force: true })
    cy.get('[aria-labelledby="UserMenu"]').find('button').as('logoutButton')
    cy.get('@logoutButton').contains('Log out').click({ force: true })
});