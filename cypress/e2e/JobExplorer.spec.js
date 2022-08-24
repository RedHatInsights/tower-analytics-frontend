import { jobExplorerUrl } from '../support/constants';

const appid = Cypress.env('appid');

xdescribe('Job Explorer page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(jobExplorerUrl);
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
    cy.testItemsListFlow('top_pagination')
    cy.testItemsListFlow('pagination_bottom')
    
  });
});
