import { savingsPlannerUrl } from '../support/constants';

const appid = Cypress.env('appid');

describe('Savings Planner page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.intercept('**/plans/*').as('getPlans')
    cy.visit(savingsPlannerUrl);
    cy.wait('@getPlans');
  });
  it('Query parameters are stored in the URL to enable refresh', () => {
    // Add more once fixtures are implemented - other filters are content-dependent.
    cy.get('[data-cy="sort_options"]').click();
    cy.contains('Manual Time').click();
    cy.url().should('include', 'sort_options=manual_time');
  });
});

