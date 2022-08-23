import { reportsUrl } from '../support/constants';

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

/**
 * This command find an element inside a given parent with id
 * using a partial match anywhere in the element.
 *
 * Example usage:
 * cy.findByIdLike("parent-selector" "select-option-description")
 *
 * @param {String} parentSelector
 * @param {String} selector - The selector value
 **/
Cypress.Commands.add('findFromParent', (parentSelector, selector, ...args) => {
  cy.get(`${parentSelector}`)
    .find(`${selector}`, ...args)
})

/**
 * This command find an element inside a given parent with id
 * using a partial match anywhere in the element.
 *
 * Example usage:
 * cy.findByIdLike("parent-selector" "select-option-description")
 *
 * @param {String} parentSelector
 * @param {String} selector - The selector value
 **/
Cypress.Commands.add('findByIdLike', (parentSelector, selector, ...args) => {
  cy.get(`${parentSelector}`)
    .find(`[id*="${selector}"]`, ...args)
})

/** This command allows the user to enter a locator that uses a data-ouia-component-id,
 * a data-cy, id, or aria-labelledby, and find that locator
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

Cypress.Commands.add('visitReport', (pageName) => {
  cy.loadFixture('tables_pagination').then((pages) => {
    pages.forEach((page) => {
      if (page.name == pageName) {
        cy.intercept(page.api_call).as('apiCall')
        cy.log('Page data from fixture:', page)
        cy.log('Reports Url:', reportsUrl)
        cy.visit(`${reportsUrl}` + '/' + pageName)
        cy.getByCy('loading').should('not.exist')
        cy.getByCy('api_error_state').should('not.exist')
        cy.getByCy('api_loading_state').should('not.exist')
        cy.log('Intercepting the url:', page.api_call)
        cy.wait('@apiCall', { timeout: 8000 })
      }
    })
  })
})

Cypress.Commands.add('loadFixture', (name) => {
  const fixturePath = (Cypress.env('test_env') == undefined ? "ephemeral" : Cypress.env('test_env')) + '/' + name
  cy.log('fixturePath ', fixturePath)
  cy.fixture(fixturePath).then((data) => {
    return data;
  })
})

Cypress.Commands.add('loadPageDataFixture', (pageName) => {
  cy.loadFixture('tables_pagination').then((pages) => {
    pages.forEach((page) => {
      if (page.name == pageName) {
        return page;
      }
    })
  })
})

Cypress.Commands.add('waitSpinner', () => {
  cy.getByCy('spinner').should(($spinner) => {
    expect($spinner).not.to.exist;
  });
});

Cypress.Commands.add('tableShowAll', () => {
  cy.get('#table-kebab')
    .click()
    .then(() => {
      cy.get('.pf-c-dropdown__menu.pf-m-align-right')
        .find('button')
        .contains('Show all')
        .click()
      cy.get('#table-kebab').click()
    });
  cy.waitSpinner()
})

Cypress.Commands.add('tableHideAll', () => {
  cy.get('#table-kebab')
    .click()
    .then(() => {
      cy.get('.pf-c-dropdown__menu.pf-m-align-right')
        .find('button')
        .contains('Hide all')
        .click();
      cy.get('#table-kebab').click();
    });
  cy.waitSpinner();
})
