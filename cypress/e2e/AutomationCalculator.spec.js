/* global cy */
import { calculatorUrl } from '../support/constants';

describe('Automation Calculator page', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(calculatorUrl);
    cy.get('[data-cy="header-automation_calculator"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="spinner"]').should('not.exist');
    cy.intercept('/api/tower-analytics/v1/roi_cost_effort_data/').as('roiCostEffortData');
    cy.intercept('/api/tower-analytics/v1/roi_templates/*').as('roiTemplates');
  });

  const waitToLoad = () => {
    cy.wait('@roiCostEffortData');
    cy.wait('@roiTemplates');
  };

  it('can change manual cost', () => {
    cy.get('#manual-cost').clear();
    waitToLoad();
    cy.get('#manual-cost').should('have.value', '0');
    cy.get('#manual-cost').type('5');
    waitToLoad();
    // TODO explain trailing 0
    cy.get('#manual-cost').should('have.value', '50');
  });
  it('can change automated cost', () => {
    //let totalSavings = cy.get('[data-cy="total_savings"]').find('h3').textContent;
    cy.get('#automation-cost').clear();
    waitToLoad();
    cy.get('#automation-cost').should('have.value', '0');
    cy.get('#automation-cost').type('2');
    waitToLoad();
    // TODO explain trailing 0
    cy.get('#automation-cost').should('have.value', '20');
    //cy.get('[data-cy="total_savings"]').find('h3').should('not.have.text', totalSavings);
  });
  it('can change visibility', () => {
    cy.get('#table-kebab').click();
    cy.get('button').contains('Show all').click();
    cy.get('#table-kebab').click();
    waitToLoad();

    cy.get('tr').eq(1).find('.pf-c-switch__toggle').click();
    waitToLoad();
    cy.get('[data-cy="savings"]').first().should('have.css', 'color', 'rgb(210, 210, 210)');
    cy.get('tr').eq(1).get('td').contains('Hide').should('exist');

    cy.get('tr').eq(1).find('.pf-c-switch__toggle').click();
    waitToLoad();
    cy.get('[data-cy="savings"]').first().should('have.css', 'color', 'rgb(30, 79, 24)')
    cy.get('tr').eq(1).get('td').contains('Show').should('exist');
  });
  it('can change manual time', () => {
    cy.get('[data-cy="manual-time"]').first().clear();
    waitToLoad();
    cy.get('tr').eq(1).find('input').should('have.value', '0');
    cy.get('[data-cy="manual-time"]').first().type('4');
    waitToLoad();
    // TODO explain trailing 0
    cy.get('tr').eq(1).find('input').should('have.value', '40');
  });
  it('shows empty state when all rows are hidden', () => {
   cy.get('#table-kebab').click();
   cy.get('button').contains('Hide all').click();
    waitToLoad();
    cy.get('.pf-c-empty-state').should('exist');
    cy.get('button').contains('Show all').click();
    waitToLoad();
    cy.get('.pf-c-empty-state').should('not.exist');
  });
  it('Query parameters are stored in the URL to enable refresh', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.contains('Past 2 years').click();
    cy.url().should('include', 'quick_date_range=roi_last_2_years');
  });
});
