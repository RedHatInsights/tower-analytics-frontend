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
      'landing-page': Cypress.config().baseUrl + clustersUrl
    },
    'env-ephemeral': {
      'username': '#username',
      'password': '#password',
      'two-step': false,
      'agree-cookies': true,
      'landing-page': Cypress.config().baseUrl + "/"
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
  for(const element of Object.keys(keycloakLoginFields)) {
    if(Cypress.config().baseUrl.includes(element)) {
      cy.log('Baseurl contains: ' + element);
      strategy = element;
      break;
    }
  }

  cy.log('Strategy: ');
  cy.log(keycloakLoginFields[strategy]);

  if(keycloakLoginFields[strategy]['two-step']) {
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

  if(keycloakLoginFields[strategy]['agree-cookies']) {
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
/**
 * This command get an element using data-ouia-component-id
 * exact match.
 *
 * Example usage:
 * cy.getByOUIA("inventory-test")
 *
 * @param {String} selector - The selector value
 **/
 Cypress.Commands.add('getByOUIA', (selector, ...args) => {
  return cy.get(`[data-ouia-component-id="${selector}"]`, ...args)
})

/**
 * This command get an element using data-ouia-component-id
 * using a partial match anywhere in the element.
 *
 * Example usage:
 * cy.getByOUIALike("inventory-test")
 *
 * @param {String} selector - The selector value
 **/
Cypress.Commands.add('getByOUIALike', (selector, ...args) => {
  return cy.get(`[data-ouia-component-id*="${selector}"]`, ...args)
})

/**
 * This command get an element using data-cy
 * exact match.
 *
 * Example usage:
 * cy.getByCy("inventory-test")
 *
 * @param {String} selector - The selector value
 **/

Cypress.Commands.add('getByCy', (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args)
})

/**
 * This command get an element using data-cy
 * using a partial match anywhere in the element.
 *
 * See more on: https://api.jquery.com/category/selectors/attribute-selectors/
 *
 * Example usage:
 * cy.getByCyLike("inventory-test")
 *
 * @param {String} selector - The selector value
 * @param {String} matchType - The operator value
 * @param {String} args - The operator value to partially find an element.
 * See more options on https://api.jquery.com/category/selectors/attribute-selectors/
 **/

Cypress.Commands.add('getByCyLike', (selector, matchType = '*', ...args) => {
  return matchType == '*'
    ? cy.get(`[data-cy*="${selector}"]`, ...args)
    : cy.get(`[data-cy${matchType}="${selector}"]`, ...args)
})

/**
 * This command get an element using id
 * using a partial match anywhere in the element.
 *
 * Example usage:
 * cy.getByIdLike("select-option-description")
 *
 * @param {String} selector - The selector value
 **/
Cypress.Commands.add('getByIdLike', (selector, ...args) => {
  return cy.get(`[id*="${selector}"]`, ...args)
})

/** This command allows the user to enter a locator that uses a data-ouia-component-id, a data-cy, or an id, and find that locator
 * with the one command.
 *
 * User simply passes in the locator string and Cypress will find that locator.
 * Example: cy.findByCustomId('locator')
 *
 * @param {String} idToFind - user inserts the locator here.
 */
Cypress.Commands.add('findByCustomId', (idToFind) => {
  const { queryHelpers } = require('@testing-library/dom')
  let queryAllByOuia = queryHelpers.queryAllByAttribute.bind(null, 'data-ouia-component-id')
  let queryAllByDataCy = queryHelpers.queryAllByAttribute.bind(null, 'data-cy')
  let queryAllById = queryHelpers.queryAllByAttribute.bind(null, 'id')

  let resultA = queryAllByOuia(Cypress.$('body')[0], idToFind)
  let resultB = queryAllByDataCy(Cypress.$('body')[0], idToFind)
  let resultC = queryAllById(Cypress.$('body')[0], idToFind)
  if (resultA.length) return resultA
  if (resultB.length) return resultB
  if (resultC.length) return resultC

  throw `Unable to find an element by: [data-ouia-component-id="${idToFind}"] or [data-cy="${idToFind}"] or [id="${idToFind}"]`
})
