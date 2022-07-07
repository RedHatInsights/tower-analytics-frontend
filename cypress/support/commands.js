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
import { dashboardUrl } from '../support/constants'

Cypress.Commands.add('getBaseUrl', () => Cypress.env('baseUrl'));

Cypress.Commands.add('getUsername', () => Cypress.env('USERNAME'));

Cypress.Commands.add('getPassword', () => Cypress.env('PASSWORD'));

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

/* 
 * TODO: This is a workaround and the tests runs longer than we would like.
 * It needs to be updated in a way we don't even see the iframe,
 * loading the cookies beforehand
 */
Cypress.Commands.add('acceptCookiesDialog', () => {

  const getIframeDocument = () => {
    return cy
      .get('iframe')
      .its('0.contentDocument').should('exist')
  }

  const getIframeBody = () => {
    return getIframeDocument()
      .its('body').should('not.be.undefined')
      .then(cy.wrap)
  }

  const acceptCookies = () => {
    return getIframeBody()
      .find('div.pdynamicbutton')
      .find('a.call')
      .should('be.visible')
      .click(true)
  }

  cy.waitUntil(() => acceptCookies());

});

Cypress.Commands.add('loginFlow', () => {
  cy.visit('/');

  const keycloakLoginUrls = ['localhost', 'front-end-aggregator'];

  // If local test runs
  if (keycloakLoginUrls.some((str) => Cypress.config().baseUrl.includes(str))) {
    cy.getUsername().then((uname) => cy.get('#username-verification').type(`${uname}`));
    cy.getPassword().then((password) =>
      cy.get('#password').type(`${password}{enter}`, { log: false })
    );
  } else {
    // I don't know where this is used, but would guess stage
    cy.getUsername().then((uname) =>
      cy.get('#username-verification').type(`${uname}`)
    );
    cy.get('#login-show-step2').click();
    cy.getPassword().then((password) =>
      cy.get('#password').type(`${password}{enter}`, { log: false })
    );
  }

/* 
 * TODO: This is a workaround and the tests runs longer than we would like.
 * It needs to be updated in a way we don't even see the iframe,
 * loading the cookies beforehand.
 * 
 * IF the iframe is loading in your local tests please uncomment the folowing code:
 */

  // if (cy.get('iframe').should('exist')) {
  //   cy.acceptCookiesDialog();
  // }
  // cy.wait(5000)

  cy.url().should('eq', Cypress.config().baseUrl + dashboardUrl);
});
