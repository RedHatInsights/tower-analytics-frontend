/* global cy */
import {
  calculatorUrl,
  jobExplorerUrl,
  dashboardUrl,
  notificationsUrl,
  orgsUrl,
} from '../support/constants';

describe('Insights smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
  });

  it('has all the AA navigation items', () => {
    cy.visit(dashboardUrl);
    cy.get('[aria-labelledby="Operations Insights"]')
      .find('.pf-c-nav__toggle-icon')
      .click({ multiple: true });
    cy.get('[aria-labelledby="Operations Insights"]')
      .find('li')
      .should('have.length', 11);
    cy.get('[aria-labelledby="Security Insights"]')
      .find('li')
      .should('have.length', 1);
    cy.get('[aria-labelledby="Business Insights"]')
      .find('li')
      .should('have.length', 6);
  });
  // requires expansion
  it('can open each page without breaking the UI', () => {
    cy.visit(calculatorUrl);
    cy.visit(jobExplorerUrl);
    cy.visit(dashboardUrl);
    cy.visit(notificationsUrl);
    cy.visit(orgsUrl);
  });
});
