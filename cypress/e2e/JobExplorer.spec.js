import { jobExplorerUrl } from '../support/constants';

const appid = Cypress.env('appid');

describe('Job Explorer page smoketests', () => {
  beforeEach(() => {    
    cy.visit(jobExplorerUrl);

    cy.get('[data-cy="spinner"]').should('not.exist');
    cy.get('[data-cy="loading"]').should('not.exist');
    // cy.get('[data-cy="header-jobex"]', {
    //   timeout: 10000,
    // }).should('be.visible'); // TODO: create this data-cy
    // cy.get('[data-cy="filter-toolbar"]', {
    //   timeout: 10000,
    // }).should('be.visible'); // TODO: create this data-cy
    cy.get('table', {
      timeout: 100000,
    }).should('be.visible'); // TODO: create data-cy for this
  });

  it('Query parameters are stored in the URL to enable refresh', () => {
    // Add more once fixtures are implemented - other filters are content-dependent.
    cy.getByCy('quick_date_range').click();
    cy.contains('Past 2 weeks').click();
    cy.url().should('include', 'quick_date_range=last_2_weeks');
  });

  it('Can navigate through the pages', () => {
    cy.testNavArrowsFlow('top_pagination')
    cy.testNavArrowsFlow('pagination_bottom')
  });

  it('Can change the number of items shown on the list', () => {
    cy.testItemsListFlow('top_pagination', 'jbex')
    cy.testItemsListFlow('pagination_bottom', 'jbex')
  });
});
