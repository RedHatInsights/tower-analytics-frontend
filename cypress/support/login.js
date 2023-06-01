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

  const keycloakLoginFields = {
    localhost: {
      username: '#username-verification',
      password: '#password',
      'two-step': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl,
    },
    // when you login on eph, the landing page is "/"
    'front-end-aggregator-ephemeral': {
      username: '#username-verification',
      password: '#password',
      'two-step': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl,
    },
    'env-ephemeral': {
      username: '#username',
      password: '#password',
      'two-step': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl,
    },
    'mocks-keycloak-ephemeral': {
      username: '#username',
      password: '#password',
      'two-step': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl,
    },
    'console.stage.redhat.com': {
      username: '#username-verification',
      password: '#password',
      'two-step': true,
      'landing-page': Cypress.config().baseUrl + clustersUrl,
    },
    'stage.foo.redhat.com': {
      username: '#username-verification',
      password: '#password',
      'two-step': true,
      'landing-page': Cypress.config().baseUrl + clustersUrl,
    },
  };

  let strategy = null;

  // probably some fancy filter function for this
  //Cypress.config().baseUrl is not a string, it's an object
  for (const element of Object.keys(keycloakLoginFields)) {
    if (String(Cypress.config().baseUrl).includes(element)) {
      //for (const element of Object.keys(keycloakLoginFields)) {
      //  if (Cypress.config().baseUrl.includes(element)) {
      cy.log('Baseurl contains: ' + element);
      strategy = element;
      break;
    }
  }
  //need to check if strategy is valid and contains a username fiel
  cy.log('Strategy: ');
  cy.log(JSON.stringify(keycloakLoginFields[strategy]));
  //cy.get(keycloakLoginFields[strategy]['username']).should('be.visible');
  if (
    keycloakLoginFields[strategy] &&
    keycloakLoginFields[strategy]['username']
  ) {
    cy.get(keycloakLoginFields[strategy]['username']).should('be.visible');
  } else {
    cy.log('Username not found for the given strategy');
  }
  //check if strategy is valid and contains a two step field
  //if (keycloakLoginFields[strategy]['two-step']) {
  if (
    keycloakLoginFields[strategy] &&
    keycloakLoginFields[strategy]['two-step']
  ) {
    cy.log('Two step verfication');
    cy.getUsername().then((uname) =>
      cy.get(keycloakLoginFields[strategy]['username']).type(`${uname}`)
    );
    cy.get('#login-show-step2').click();
    cy.getPassword().then((password) =>
      cy
        .get(keycloakLoginFields[strategy]['password'])
        .type(`${password}{enter}`, { log: false })
    );
  } else {
    cy.log('One step verfication');
    cy.getUsername().then((uname) =>
      cy.get(keycloakLoginFields[strategy]['username']).type(`${uname}`)
    );
    cy.getPassword().then((password) =>
      cy
        .get(keycloakLoginFields[strategy]['password'])
        .type(`${password}{enter}`, { log: false })
    );
  }

  //check if strategy is valid and have a landing page
  if (
    keycloakLoginFields[strategy] &&
    keycloakLoginFields[strategy]['landing-page']
  ) {
    cy.log(
      'Checking for landing page: ' +
        keycloakLoginFields[strategy]['landing-page']
    );
  } else {
    cy.log('Landing page not found for the given strategy');
  }
  //cy.log(
  //  'Checking for landing page: ' +
  //    keycloakLoginFields[strategy]['landing-page']
  //);
  // check if the page loads correctly
  cy.visit(Cypress.config().baseUrl + clustersUrl);
  cy.url()
    .should('eq', keycloakLoginFields[strategy]['landing-page'])
    .then(() => {
      // verifiy that the page has loaded
      cy.get('body').should('be.visible');
    });
  //cy.visit(Cypress.config().baseUrl + clustersUrl);
  //cy.url().should('eq', keycloakLoginFields[strategy]['landing-page']);
  // if (strategy == "env-ephemeral") {
  // cy.visit(Cypress.config().baseUrl + clustersUrl);
  // cy.url().should('eq', Cypress.config().baseUrl + clustersUrl);
  // cy.get('[data-quickstart-id="ansible_automation-analytics_reports"]').click();
  // cy.get('a[href="' + Cypress.config().baseUrl + reportsUrl + '"]', { timeout: 10000 }).should('be.visible');
  // cy.get('[data-ouia-component-type="PF4/Title"]', { timeout: 10000 }).should('be.visible');
  // }
});
