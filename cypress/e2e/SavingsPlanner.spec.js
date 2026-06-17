import { ENV, ENVS, savingsPlannerUrl } from '../support/constants';

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

describe('Savings Planner input validation', () => {
  if (ENV != ENVS.EPHEMERAL) {
    beforeEach(() => {
      cy.intercept('**/plans/*').as('getPlans');
      cy.intercept('**/plan_options/').as('getPlanOptions');
      cy.visit(savingsPlannerUrl);
      cy.wait('@getPlans');
    });

    it('should enforce max length on name field', () => {
      // Click on "Add plan" button
      cy.contains('Add plan').click();
      cy.wait('@getPlanOptions');

      // Generate a string longer than 255 characters
      const longName = 'a'.repeat(256);

      // Type into the name field
      cy.get('#name-field').type(longName);

      // User should see the full input (not truncated)
      cy.get('#name-field').should('have.value', longName);

      // Should show validation error
      cy.get('#name-field')
        .parent()
        .parent()
        .should('contain', 'exceeds maximum length of 255 characters');

      // Next button should be disabled due to validation
      cy.contains('button', 'Next').should('be.disabled');
    });

    it('should enforce max length on description field', () => {
      cy.contains('Add plan').click();
      cy.wait('@getPlanOptions');

      // Enter valid name first
      cy.get('#name-field').type('Test Plan');

      // Generate a string longer than 1024 characters
      const longDescription = 'a'.repeat(1025);

      // Type into the description field
      cy.get('#description-field').type(longDescription);

      // User should see the full input (not truncated)
      cy.get('#description-field').should('have.value', longDescription);

      // Should show validation error
      cy.get('#description-field')
        .parent()
        .parent()
        .should('contain', 'exceeds maximum length of 1024 characters');

      // Next button should be disabled
      cy.contains('button', 'Next').should('be.disabled');
    });

    it('should enforce max length on task field', () => {
      cy.contains('Add plan').click();
      cy.wait('@getPlanOptions');

      // Enter valid name to proceed to next step
      cy.get('#name-field').type('Test Plan');
      cy.contains('button', 'Next').click();

      // Generate a string longer than 255 characters
      const longTask = 'a'.repeat(256);

      // Type into the task field
      cy.get('#task-field').type(longTask);

      // User should see the full input (not truncated)
      cy.get('#task-field').should('have.value', longTask);

      // Should show validation error
      cy.get('.pf-v6-c-form__group').should(
        'contain',
        'exceeds maximum length of 255 characters',
      );

      // Add button should be disabled due to validation
      cy.get('button[aria-label="Add task"]').should('be.disabled');
    });

    it('should accept valid input within length limits', () => {
      cy.contains('Add plan').click();
      cy.wait('@getPlanOptions');

      // Enter valid name
      const validName = 'Valid Plan Name';
      cy.get('#name-field').type(validName);

      // Enter valid description
      const validDescription = 'This is a valid description for the plan.';
      cy.get('#description-field').type(validDescription);

      // Next button should be enabled
      cy.contains('button', 'Next').should('not.be.disabled');

      // Go to tasks step
      cy.contains('button', 'Next').click();

      // Enter valid task
      const validTask = 'Complete setup';
      cy.get('#task-field').type(validTask);

      // Add button should be enabled
      cy.get('button[aria-label="Add task"]').should('not.be.disabled');

      // Click add task
      cy.get('button[aria-label="Add task"]').click();

      // Task should appear in the list
      cy.contains('1. Complete setup').should('exist');
    });

    it('should prevent XSS via React auto-escaping', () => {
      cy.contains('Add plan').click();
      cy.wait('@getPlanOptions');

      // Try to enter XSS payload in name field
      const xssPayload = '<script>alert("XSS")</script>';
      cy.get('#name-field').type(xssPayload);

      // React stores the raw value and auto-escapes at render time
      cy.get('#name-field').should(
        'have.value',
        '<script>alert("XSS")</script>',
      );
    });
  }
});
