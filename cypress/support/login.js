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

Cypress.Commands.add('login', () => {

  //  to see debug config for cookies in teh console
  Cypress.Cookies.debug(true);
  cy.visit('/');

  // these cokies should resolve the accept cookies dialog
  cy.setCookie('cookie_3rdparty', 'enabled', {
    domain: 'prefmgr-cookie.truste-svc.net'
  });

  cy.setCookie('token_test', 'dont matter', {
    domain: 'consent-pref.trustarc.com'
  });

  cy.setCookie('notice_preferences', '2:');
  cy.setCookie('notice_gdpr_prefs', '0,1,2:');
  cy.setCookie('notice_behavior', 'expressed,eu');
  cy.setCookie('cmapi_cookie_privacy', 'permit 1,2,3');
  cy.setCookie('cmapi_gtm_bl', '');

  cy.intercept('https://consent.trustarc.com/*').as('cookies');

  cy.log('Determining login strategy');

  const keycloakLoginFields = {
    'localhost': {
      'username': '#username-verification',
      'password': '#password',
      'two-step': false,
      'agree-cookies': true,
      'landing-page': Cypress.config().baseUrl + clustersUrl
    },
    // when you login on eph, the landing page is "/"
    'front-end-aggregator-ephemeral': {
      'username': '#username-verification',
      'password': '#password',
      'two-step': false,
      'agree-cookies': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl
    },
    'env-ephemeral': {
      'username': '#username',
      'password': '#password',
      'two-step': false,
      'agree-cookies': false,
      'landing-page': Cypress.config().baseUrl + clustersUrl
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
      'agree-cookies': true,
      'landing-page': Cypress.config().baseUrl + clustersUrl
    }
  }

  let strategy = null;

  // probably some fancy filter function for this
  for (const element of Object.keys(keycloakLoginFields)) {
    if (Cypress.config().baseUrl.includes(element)) {
      cy.log('Baseurl contains: ' + element);
      strategy = element;
      break;
    }
  }

  cy.log('Strategy: ');
  cy.log(JSON.stringify(keycloakLoginFields[strategy]));
  cy.get(keycloakLoginFields[strategy]['username']).should('be.visible');

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

  cy.log('Checking for landing page: ' + keycloakLoginFields[strategy]['landing-page']);
  cy.url().should('eq', keycloakLoginFields[strategy]['landing-page']);
});
