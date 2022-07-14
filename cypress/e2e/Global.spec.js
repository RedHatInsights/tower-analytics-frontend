/* global cy */
import {
  dashboardUrl,
  orgsUrl,
  jobExplorerUrl,
  clustersUrl,
  reportsUrl,
  savingsPlannerUrl,
  calculatorUrl,
  notificationsUrl,
} from '../support/constants';

describe('Insights smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
  });

  it('has all the AA navigation items', () => {
    cy.visit(dashboardUrl);
    cy.getByOUIALike('OUIA-Generated-NavExpandable')
      .get('[data-quickstart-id="Automation-Analytics"]')
      .should('exist')
      .click();

    cy.get('[data-quickstart-id="Automation-Analytics"]')
      .find('li')
      .should('have.length', 7)

      .find('[data-quickstart-id="ansible_automation-analytics_organization-statistics"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + orgsUrl)

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

      .get('[data-quickstart-id="ansible_automation-analytics_reports_automation_calculator"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + calculatorUrl)

      .get('[data-quickstart-id="ansible_automation-analytics_notifications"]')
      .click()
      .url().should('eq', Cypress.config().baseUrl + notificationsUrl);
  });

// TODO: include assetion maybe with snapshots
  it('can open each page without breaking the UI', () => {
    cy.visit(orgsUrl);
    cy.visit(jobExplorerUrl);
    cy.visit(clustersUrl);
    cy.visit(reportsUrl);
    cy.visit(savingsPlannerUrl);
    cy.visit(calculatorUrl);
    cy.visit(notificationsUrl);
  });
});
