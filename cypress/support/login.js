import keycloakLoginFields from '../fixtures/keycloakLoginFields.json';
import { clustersUrl } from '../support/constants';

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

Cypress.Commands.add('login', () => {
  cy.visit('/');

  cy.log('Determining login strategy');

  cy.log(JSON.stringify(keycloakLoginFields));

  let strategy = null;

  for (const index of Object.keys(keycloakLoginFields)) {
    if (Cypress.config().baseUrl.includes(index)) {
      cy.log('Baseurl contains: ' + index);
      strategy = index;
      break;
    }
  }

  cy.log('Strategy:');
  cy.log(JSON.stringify(keycloakLoginFields[strategy]));
  cy.get(keycloakLoginFields[strategy]['username']).should('be.visible');

  if (keycloakLoginFields[strategy]['two-step']) {
    cy.log('Two step verfication');
    cy.getUsername().then((uname) =>
      cy.get(keycloakLoginFields[strategy]['username']).type(`${uname}`)
    );
    cy.get('#login-show-step2').click();
    cy.getPassword().then((password) =>
      cy
        .get(keycloakLoginFields[strategy]['password'])
        .type(`${password}`, { log: false })
    );
    cy.get('#rh-password-verification-submit-button').click();
  } else {
    cy.log('One step verfication');
    cy.getUsername().then((uname) =>
      cy.get(keycloakLoginFields[strategy]['username']).type(`${uname}`)
    );
    cy.get('#login-show-step2').click();
    cy.getPassword().then((password) =>
      cy
        .get(keycloakLoginFields[strategy]['password'])
        .type(`${password}`, { log: false })
    );
    cy.get('#rh-password-verification-submit-button').click();
  }

  cy.log(
    'Checking for landing page: ' +
      keycloakLoginFields[strategy]['landing-page']
  );
  cy.visit(Cypress.config().baseUrl + clustersUrl);
  cy.url().should('eq', keycloakLoginFields[strategy]['landing-page']);
  // if (strategy == "env-ephemeral") {
  // cy.visit(Cypress.config().baseUrl + clustersUrl);
  // cy.url().should('eq', Cypress.config().baseUrl + clustersUrl);
  // cy.get('[data-quickstart-id="ansible_automation-analytics_reports"]').click();
  // cy.get('a[href="' + Cypress.config().baseUrl + reportsUrl + '"]', { timeout: 10000 }).should('be.visible');
  // cy.get('[data-ouia-component-type="PF4/Title"]', { timeout: 10000 }).should('be.visible');
  // }
});
