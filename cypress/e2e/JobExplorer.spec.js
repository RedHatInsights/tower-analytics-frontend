import { jobExplorerUrl } from '../support/constants';

describe('Job Explorer page smoketests', () => {
  beforeEach(() => {
    cy.visit(jobExplorerUrl);

    cy.get('[data-cy="spinner"]', { timeout: 10000 }).should('not.exist');
    cy.get('[data-cy="loading"]', { timeout: 10000 }).should('not.exist');

    // Wait for either table or empty state - only check for existence
    cy.get('body', { timeout: 30000 }).should('exist');
  });

  it('Query parameters are stored in the URL to enable refresh', () => {
    // Add more once fixtures are implemented - other filters are content-dependent.
    cy.getByCy('quick_date_range').click();
    cy.contains('Past 2 weeks').click();
    cy.url().should('include', 'quick_date_range=last_2_weeks');
  });

  it('Can navigate through the pages', () => {
    cy.testNavArrowsFlow('top_pagination');
    cy.testNavArrowsFlow('pagination_bottom');
  });

  it('Can change the number of items shown on the list', () => {
    cy.testItemsListFlow('top_pagination', 'jbex');
    cy.testItemsListFlow('pagination_bottom', 'jbex');
  });
});
