import { savingsPlannerUrl, ENV, ENVS} from '../support/constants';

describe('Savings Planner page smoketests', () => {
  if (ENV != ENVS.EPHEMERAL) {
      // Doesn't seem to work on ephemeral
    beforeEach(() => {
      cy.intercept('**/plans/*').as('getPlans');
      cy.visit(savingsPlannerUrl);
      cy.wait('@getPlans');
    });
    it('Query parameters are stored in the URL to enable refresh', () => {
      // Add more once fixtures are implemented - other filters are content-dependent.
      cy.get('[data-cy="sort_options"]').click();
      cy.contains('Manual Time').click();
      cy.url().should('include', 'sort_options=manual_time');
    });
  }
});
