import { clustersUrl } from '../support/constants'

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

  acceptCookies();

});

Cypress.Commands.add('loginFlow', () => {
  cy.visit('/');

  cy.log('Determining login strategy');

  const keycloakLoginFields = {
    'localhost': {
      'username': '#username-verification',
      'password': '#password',
      'two-step': false,
      'agree-cookies': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl
    },
    'front-end-aggregator-ephemeral': {
      'username': '#username-verification',
      'password': '#password',
      'two-step': false,
      'agree-cookies': false,
      'landing-page': Cypress.config().baseUrl + '/'
    },
    'env-ephemeral': {
      'username': '#username',
      'password': '#password',
      'two-step': false,
      'agree-cookies': true,
      'landing-page': Cypress.config().baseUrl + '/'
    },
    'mocks-keycloak-ephemeral': {
      'username': '#username',
      'password': '#password',
      'two-step': false,
      'agree-cookies': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl
    },
    'console.stage.redhat.com': {
      'username': '#username-verification',
      'password': '#password',
      'two-step': true,
      'agree-cookies': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl
    },
    'stage.foo.redhat.com': {
      'username': '#username-verification',
      'password': '#password',
      'two-step': true,
      'agree-cookies': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl
    }
  }

  let strategy = null;

  // probably some fancy filter function for this
  // let key = keycloakLoginUrls.filter(....)
  for (const element of Object.keys(keycloakLoginFields)) {
    if (Cypress.config().baseUrl.includes(element)) {
      cy.log('Baseurl contains: ' + element);
      strategy = element;
      break;
    }
  }

  cy.log('Strategy: ');
  cy.log(keycloakLoginFields[strategy]);

  if (keycloakLoginFields[strategy]['two-step']) {
    cy.log('Two step verfication');
    cy.getUsername().then((uname) =>
      cy.get(keycloakLoginFields[strategy]['username']).type(`${uname}`)
    );
    cy.get('#login-show-step2').click();
    cy.getPassword().then((password) =>
      cy.get(keycloakLoginFields[strategy]['password']).type(`${password}{enter}`, { log: false })
    );
  } else {
    cy.log('One step verfication');
    cy.getUsername().then((uname) => cy.get(keycloakLoginFields[strategy]['username']).type(`${uname}`));
    cy.getPassword().then((password) =>
      cy.get(keycloakLoginFields[strategy]['password']).type(`${password}{enter}`, { log: false })
    );
  }

  if (keycloakLoginFields[strategy]['agree-cookies']) {
    cy.log('Accept cookies');
    /*
    * TODO: This is a workaround and the tests runs longer than we would like.
    * It needs to be updated in a way we don't even see the iframe,
    * loading the cookies beforehand.
    */
    if (cy.get('iframe').should('exist')) {
      cy.acceptCookiesDialog();
    }
    cy.wait(5000)
  }

  cy.log('Checking for landing page: ' + keycloakLoginFields[strategy]['landing-page']);
  cy.url().should('eq', keycloakLoginFields[strategy]['landing-page']);
});
