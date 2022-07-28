/* global cy */
import { clustersUrl } from '../support/constants';
const appid = Cypress.env('appid');

describe('Clusters page', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(clustersUrl);

    cy.get('[data-cy="header-clusters"]', {
      timeout: 10000,
    }).should('be.visible');
    cy.get('[data-cy="spinner"]').should('not.exist');
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="filter-toolbar"]', {
      timeout: 10000,
    }).should('be.visible');
    cy.get('[data-cy="card-title-job-status"]', {
      timeout: 10000,
    }).should('be.visible');
    cy.intercept('/api/tower-analytics/v1/event_explorer/*').as(
      'eventExplorerData'
    );
    cy.intercept('/api/tower-analytics/v1/job_explorer/*').as(
      'jobExplorerData'
    );
  });

  const waitToLoad = () => {
    cy.wait('@eventExplorerData');
    cy.wait('@jobExplorerData');
  };

  it('loads clusters page with Bar graph and other tables', () => {
    cy.get('[data-cy="card-title-job-status"]').find('h2').textContent;

    cy.get('[data-cy="barchart"]');
    cy.get('#d3-bar-chart-root').type('g');
    waitToLoad();
    cy.contains('Clear all filters');
    cy.contains('Top workflows');
    cy.contains('Top templates');
    cy.contains('Top modules');
  });

  it('has anchor clear filters link', () => {
    waitToLoad();
    cy.get('button').each((button) => {
      let buttonText = button.text();
      if (buttonText === 'Clear all filters') {
        button.click();
      }
    });
  });

  it('Query parameters are stored in the URL to enable refresh', () => {
    cy.get('[data-cy="job_type"]').click();
    cy.contains('Workflow job').click();
    cy.url().should('not.include', 'job_type[]=workflowjob');

    cy.get('[data-cy="quick_date_range"]').click();
    cy.contains('Past 62 days').click();
    cy.url().should('include', 'quick_date_range=last_62_days');
  });

  it('Hover over each bar in bar chart', () => {
    cy.get(appid)
      .find('#d3-bar-chart-root > svg > g > g > path')
      .each((_slice, ix) => {
        cy.get(appid)
          .find('#d3-bar-chart-root > svg > g > g > path')
          .eq(ix)
          .trigger('mouseover', { force: true });
      });
  });

  it('Hover over each row in all tables', () => {
    cy.get(appid)
      .find('*[class^="pf-c-data-list pf-m-grid-md"]')
      .each((_slice, ix) => {
        cy.get(appid)
          .find('*[class^="pf-c-data-list pf-m-grid-md"] > li > div')
          .eq(ix)
          .trigger('mouseover', { force: true });
      });
  });

  it('Hover over each row in Top modules table', () => {
    cy.get(appid)
      .find('[data-cy="top-modules-header"]')
      .each((_slice, ix) => {
        cy.get(appid)
          .find('[data-cy="top-modules-header"] > ul> li > div')
          .eq(ix)
          .trigger('mouseover', { force: true });
      });
  });
});
