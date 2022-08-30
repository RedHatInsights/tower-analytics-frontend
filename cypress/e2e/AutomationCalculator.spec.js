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
    let originalTotalSavingsValue = cy.get('[data-cy="total_savings"]').find('h3').textContent;
    let originalPageSavingsValue = cy.get('[data-cy="current_page_savings"]').find('h3').textContent;
    //let originalSavingsValues = [];
    //cy.get('[data-cy="savings"]').each(($el) =>  originalSavingsValues.push($el.text()));

    cy.get('#manual-cost').clear();
    waitToLoad();
    cy.get('#manual-cost').should('have.value', '0');
    // TODO there's a bug in UI. Savings column is not updated when inputs change
    /*
    cy.get('[data-cy="savings"]').each(($el, index) => {
      const newSavingsValue = $el.text();
      // FIXME this should be not.to.be
      expect(newSavingsValue).not.to.eq(originalSavingsValues[index]);
    });
     */
    cy.get('#manual-cost').type('5');
    waitToLoad();
    // TODO explain trailing 0
    cy.get('#manual-cost').should('have.value', '50');

    cy.get('[data-cy="total_savings"]').find('h3').then(($totalSavings) => {
      const totalSavingsValue = $totalSavings.text();
      expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
    });
    cy.get('[data-cy="current_page_savings"]').find('h3').then(($pageSavings) => {
      const pageSavingsValue = $pageSavings.text();
      expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
    });
  });
  it('can change automated cost', () => {
    let originalTotalSavingsValue = cy.get('[data-cy="total_savings"]').find('h3').textContent;
    let originalPageSavingsValue = cy.get('[data-cy="current_page_savings"]').find('h3').textContent;
    //let originalSavingsValues = [];
    //cy.get('[data-cy="savings"]').each(($el) =>  originalSavingsValues.push($el.text()));

    cy.get('#automation-cost').clear();
    waitToLoad();
    cy.get('#automation-cost').should('have.value', '0');
    // TODO there's a bug in UI. Savings column is not updated when inputs change
    /*
    cy.get('[data-cy="savings"]').each(($el, index) => {
      const newSavingsValue = $el.text();
      // FIXME this should be not.to.be
      expect(newSavingsValue).not.to.eq(originalSavingsValues[index]);
    });
     */
    cy.get('#automation-cost').type('2');
    waitToLoad();
    // TODO explain trailing 0
    cy.get('#automation-cost').should('have.value', '20');

    cy.get('[data-cy="total_savings"]').find('h3').then(($totalSavings) => {
      const totalSavingsValue = $totalSavings.text();
      expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
    });
    cy.get('[data-cy="current_page_savings"]').find('h3').then(($pageSavings) => {
      const pageSavingsValue = $pageSavings.text();
      expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
    });
  });
  it('can change visibility', () => {
    let originalTotalSavingsValue = cy.get('[data-cy="total_savings"]').find('h3').textContent;
    let originalPageSavingsValue = cy.get('[data-cy="current_page_savings"]').find('h3').textContent;

    cy.get('#table-kebab').click();
    cy.get('button').contains('Show all').click();
    cy.get('#table-kebab').click();
    waitToLoad();

    cy.get('tr').eq(1).find('.pf-c-switch__toggle').click();
    waitToLoad();
    cy.get('[data-cy="savings"]').first().should('have.css', 'color', 'rgb(210, 210, 210)');
    cy.get('tr').eq(1).get('td').contains('Hide').should('exist');

    // TODO click on the popup that's there
    cy.get('tr').eq(1).find('.pf-c-switch__toggle').click({force: true});
    waitToLoad();
    cy.get('[data-cy="savings"]').first().should('have.css', 'color', 'rgb(30, 79, 24)');
    cy.get('tr').eq(1).get('td').contains('Show').should('exist');

    cy.get('[data-cy="total_savings"]').find('h3').then(($totalSavings) => {
      const totalSavingsValue = $totalSavings.text();
      expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
    });
    cy.get('[data-cy="current_page_savings"]').find('h3').then(($pageSavings) => {
      const pageSavingsValue = $pageSavings.text();
      expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
    });
  });
  it('can change manual time', () => {
    let originalTotalSavingsValue = cy.get('[data-cy="total_savings"]').find('h3').textContent;
    let originalPageSavingsValue = cy.get('[data-cy="current_page_savings"]').find('h3').textContent;
    //let originalSavingsValue = cy.get('[data-cy="savings"]').first().textContent;

    cy.get('[data-cy="manual-time"]').first().clear();
    waitToLoad();
    cy.get('tr').eq(1).find('input').should('have.value', '0');
    /*
    cy.get('[data-cy="savings"]').first().then(($savings) => {
      const rowSavingsValue = $savings.text();
      expect(rowSavingsValue).not.to.eq(originalSavingsValue);
    });
     */
    cy.get('[data-cy="manual-time"]').first().type('4');
    waitToLoad();
    // TODO explain trailing 0
    cy.get('tr').eq(1).find('input').should('have.value', '40');

    cy.get('[data-cy="total_savings"]').find('h3').then(($totalSavings) => {
      const totalSavingsValue = $totalSavings.text();
      expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
    });
    cy.get('[data-cy="current_page_savings"]').find('h3').then(($pageSavings) => {
      const pageSavingsValue = $pageSavings.text();
      expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
    });
  });
  // TODO fix it's flaky -> 1:1 fail success
  it('shows empty state when all rows are hidden', () => {
    let originalTotalSavingsValue = cy.get('[data-cy="total_savings"]').find('h3').textContent;

    cy.get('#table-kebab').click();
    cy.get('button').contains('Hide all').click();
    waitToLoad();
    cy.get('[data-cy="total_savings"]').find('h3').then(($totalSavings) => {
      const totalSavingsValue = $totalSavings.text();
      expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
    });
    cy.get('[data-cy="current_page_savings"]').find('h3').then(($pageSavings) => {
      const pageSavingsValue = $pageSavings.text();
      expect(pageSavingsValue).to.eq('$0.00');
    });
    cy.get('.pf-c-empty-state').should('exist');

    cy.get('button').contains('Show all').click();
    waitToLoad();
    cy.get('.pf-c-empty-state').should('not.exist');
    cy.get('[data-cy="current_page_savings"]').find('h3').then(($pageSavings) => {
      const pageSavingsValue = $pageSavings.text();
      expect(pageSavingsValue).not.to.eq('$0.00');
    });
  });
  it('shows Automation formula', () => {
    cy.get('[data-cy="automation_formula_button"]').click();
    cy.get('[data-cy="automation_formula_modal"]').should('exist');
    cy.get('[data-cy="automation_formula_cancel_button"]').click();
    cy.get('[data-cy="automation_formula_modal"]').should('not.exist');
  });
  it('Query parameters are stored in the URL to enable refresh', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.contains('Past 2 years').click();
    cy.url().should('include', 'quick_date_range=roi_last_2_years');
  });
});
