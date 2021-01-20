/* global cy, Cypress */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getBaseUrl', () =>
    Cypress.env('CLOUD_BASE_URL')
);

Cypress.Commands.add('getUsername', () =>
    Cypress.env('CLOUD_USERNAME')
);

Cypress.Commands.add('getPassword', () =>
    Cypress.env('CLOUD_PASSWORD')
);

/*
 * If the page has a pendo alert about
 * new feature tours, click the ignore
 * button to close the alert.
 */
Cypress.Commands.add('clearFeatureDialogs', () => {
    cy.get('button').each((button) => {
        let buttonText = button.text();
        if (buttonText === 'Show me later') {
            button.click();
        }
    });
});
