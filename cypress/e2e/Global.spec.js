/* global cy */
import {
  dashboardUrl,
  orgsUrl,
  jobExplorerUrl,
  clustersUrl,
  reportsUrl,
  savingsPlannerUrl,
  calculatorUrl,
  calculatorUrlDirect,
  notificationsUrl,
} from '../support/constants';

describe('Insights smoketests', () => {

  it('has all the AA navigation items', () => {
    cy.visit(dashboardUrl);
   // cy.wait(5000);
    // This is not applicable to eph. env.
    /*
    cy.getByOUIALike('OUIA-Generated-NavExpandable')
      .get('[data-quickstart-id="Automation-Analytics"]')
      .should('exist')
      .click();
     */

    //cy.get('[data-quickstart-id="Automation-Analytics"]') // this is for devel or stage
    cy.get('[data-ouia-component-id="SideNavigation"]') // this is for eph. env.
        .find('a')
      //.should('have.length', 7)

        /*
      .get('[data-quickstart-id="ansible_automation-analytics_organization-statistics"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + orgsUrl)
         */

      .get('[data-quickstart-id="ansible_automation-analytics_job-explorer"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + jobExplorerUrl)

      .get('[data-quickstart-id="ansible_automation-analytics_clusters"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + clustersUrl)

      .get('[data-quickstart-id="ansible_automation-analytics_reports"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + reportsUrl)

      .get('[data-quickstart-id="ansible_automation-analytics_savings-planner"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + savingsPlannerUrl)

      .get('[data-quickstart-id="ansible_automation-analytics_automation_calculator"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + calculatorUrlDirect)

      .get('[data-quickstart-id="ansible_automation-analytics_notifications"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + notificationsUrl);
  });

  // This function checks that there's no 500/404/403 warning in the UI
  const checkPageHasNoErrors = () => {
    cy.get('#automation-analytics-application').should('exist');
    cy.get('[data-cy="error_page"]').should('not.exist');
    cy.get('[data-cy="error_page_404"]').should('not.exist');
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
    cy.get('[data-cy="page_component"]').should('exist');
  };

// TODO: include assetion maybe with snapshots
  it('can open each page without breaking the UI', () => {
    cy.visit(orgsUrl);
    checkPageHasNoErrors();

    cy.visit(jobExplorerUrl);
    checkPageHasNoErrors();

    cy.visit(clustersUrl);
    checkPageHasNoErrors();

    cy.visit(reportsUrl);
    checkPageHasNoErrors();

    cy.visit(savingsPlannerUrl);
    checkPageHasNoErrors();

    cy.visit(calculatorUrl);
    checkPageHasNoErrors();

    cy.visit(notificationsUrl);
    checkPageHasNoErrors();
  });
});
