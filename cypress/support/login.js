import kcLoginFields from '../fixtures/keycloakLoginFields.json';
import { clustersUrl } from '../support/constants';

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

function setCookiesForUILogin() {
  Cypress.Cookies.debug(true);
  cy.setCookie('cmapi_cookie_privacy', 'permit 1,2,3', { secure: true });
  cy.setCookie('cmapi_gtm_bl', '', { secure: true });
  cy.setCookie('notice_preferences', '2:', { secure: true });
  cy.setCookie('notice_behavior', 'expressed,eu', { secure: true });
  cy.setCookie('notice_gdpr_prefs', '0,1,2:', {
    secure: true,
    domain: 'redhat.com',
  });
}

function uiLogin(strategy, username, password) {
  cy.log('Strategy:', JSON.stringify(kcLoginFields[strategy]));

  cy.get(kcLoginFields[strategy]['username']).as('usernameField');
  cy.get('@usernameField').should('be.visible');
  cy.get('@usernameField').type(`${username}`);

  if (kcLoginFields[strategy]['2step'] === true) {
    cy.log('Two step verfication');
    cy.get('#login-show-step2').as('showStep2');
    cy.get('@showStep2').click().should('be.visible');
  }

  cy.get(kcLoginFields[strategy]['password']).as('passwordField');
  cy.get('@passwordField').should('be.visible');
  cy.get('@passwordField').type(`${password}`, { log: false });

  cy.get('#rh-password-verification-submit-button').as('submitButton');
  cy.get('@submitButton').should('be.visible');
  cy.get('@submitButton').click();

  cy.visit(Cypress.config().baseUrl + clustersUrl);
}

Cypress.Commands.add('loginWithPageSession', () => {
  cy.session(
    'uiLogin',
    () => {
      setCookiesForUILogin();
      cy.visit('/');
      cy.log(JSON.stringify(kcLoginFields));
      let strategy = null;

      // TODO: is there a better way to get the strategy??
      for (const index of Object.keys(kcLoginFields)) {
        if (Cypress.config().baseUrl.includes(index)) {
          cy.log('Baseurl contains: ' + index);
          strategy = index;
          break;
        }
      }

      uiLogin(strategy, Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
    },
    {
      validate() {
        cy.document().its('cookie').should('contain', 'TAsessionID');
      },
      cacheAcrossSpecs: true,
    }
  );
});
