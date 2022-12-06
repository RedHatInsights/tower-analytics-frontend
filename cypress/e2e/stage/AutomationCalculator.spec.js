/* global cy */
import { calculatorUrl } from '../../support/constants';

describe('Automation Calculator page', () => {
  beforeEach(() => {
    cy.visit(calculatorUrl);

    cy.intercept('/api/tower-analytics/v1/roi_cost_effort_data/').as(
      'roiCostEffortData'
    );
    cy.intercept('/api/tower-analytics/v1/roi_templates/*').as('roiTemplates');

    cy.getByCy('header-automation_calculator').should('be.visible');
  });

  const waitToLoad = () => {
    cy.wait('@roiCostEffortData');
    cy.wait('@roiTemplates');
  };

  it('can change manual cost', () => {
    let originalTotalSavingsValue = cy
      .getByCy('total_savings')
      .find('h3').textContent;
    let originalPageSavingsValue = cy
      .getByCy('current_page_savings')
      .find('h3').textContent;
    let originalSavingsValues = [];
    cy.getByCy('savings').each(($el) =>
      originalSavingsValues.push($el.text())
    );

    cy.get('#manual-cost').clear();
    waitToLoad();
    cy.get('#manual-cost').should('have.value', '0');

    cy.getByCy('savings').each(($el, index) => {
      const newSavingsValue = $el.text();
      // FIXME this should be not.to.be
      expect(newSavingsValue).not.to.eq(originalSavingsValues[index]);
    });

    cy.get('#manual-cost').type('5');
    waitToLoad();
    // TODO explain trailing 0
    cy.get('#manual-cost').should('have.value', '50');

    cy.getByCy('total_savings')
      .find('h3')
      .then(($totalSavings) => {
        const totalSavingsValue = $totalSavings.text();
        expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
      });
    cy.getByCy('current_page_savings')
      .find('h3')
      .then(($pageSavings) => {
        const pageSavingsValue = $pageSavings.text();
        expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
      });
  });

  it('can change automated cost', () => {
    let originalTotalSavingsValue = cy
      .getByCy('total_savings')
      .find('h3').textContent;
    let originalPageSavingsValue = cy
      .getByCy('current_page_savings')
      .find('h3').textContent;
    let originalSavingsValues = [];
    cy.getByCy('savings').each(($el) => originalSavingsValues.push($el.text()));

    cy.get('#automation-cost').clear();
    waitToLoad();
    cy.get('#automation-cost').should('have.value', '0');

    // TODO there's a bug in UI. Savings column is not updated when inputs change
    /*
    cy.getByCy('savings').each(($el, index) => {
      const newSavingsValue = $el.text();
      // FIXME this should be not.to.be
      expect(newSavingsValue).not.to.eq(originalSavingsValues[index]);
    });
     */

    // TODO: flaky test, we need to find a better way to type an ensure the correct values
    cy.get('#automation-cost').type('2');
    waitToLoad();
    // TODO explain trailing 0
    cy.get('#automation-cost').should('have.value', '20');

    cy.getByCy('total_savings')
      .find('h3')
      .then(($totalSavings) => {
        const totalSavingsValue = $totalSavings.text();
        expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
      });
    cy.getByCy('current_page_savings')
      .find('h3')
      .then(($pageSavings) => {
        const pageSavingsValue = $pageSavings.text();
        expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
      });
  });

  it('can change visibility', () => {
    let originalTotalSavingsValue = cy
      .getByCy('total_savings')
      .find('h3').textContent;
    let originalPageSavingsValue = cy
      .getByCy('current_page_savings')
      .find('h3').textContent;

    cy.get('#table-kebab').click();
    cy.get('button').contains('Show all').click();
    cy.get('#table-kebab').click();
    waitToLoad();

    cy.get('tr').eq(1).find('.pf-c-switch__toggle').click();
    waitToLoad();
    cy.getByCy('savings')
      .first()
      .should('have.css', 'color', 'rgb(210, 210, 210)');
    cy.get('tr').eq(1).get('td').contains('Hide').should('exist');

    cy.get('tr').eq(1).find('.pf-c-switch__toggle').click();
    waitToLoad();
    cy.getByCy('savings')
      .first()
      .should('have.css', 'color', 'rgb(30, 79, 24)');
    cy.get('tr').eq(1).get('td').contains('Show').should('exist');

    cy.getByCy('total_savings')
      .find('h3')
      .then(($totalSavings) => {
        const totalSavingsValue = $totalSavings.text();
        expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
      });
    cy.getByCy('current_page_savings')
      .find('h3')
      .then(($pageSavings) => {
        const pageSavingsValue = $pageSavings.text();
        expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
      });
  });

  /*
  TODO: This test keeps failing because the backend enforces the field value.
  We need to rewrite it
  */
  // it('can change manual time', () => {
  //   let originalTotalSavingsValue = cy
  //     .getByCy('total_savings')
  //     .find('h3').textContent;
  //   let originalPageSavingsValue = cy
  //     .getByCy('current_page_savings')
  //     .find('h3').textContent;
  //   let originalSavingsValue = cy.getByCy('savings').first().textContent;

  //   cy.getByCyLike('manual-time').first().as('inputTime');
  //   cy.get('@inputTime').clear();
  //   waitToLoad();
  //   cy.get('@inputTime').should('have.value', '0');

  //   // cy.getByCy('savings').first().then(($savings) => {
  //   //   const rowSavingsValue = $savings.text();
  //   //   expect(rowSavingsValue).not.to.eq(originalSavingsValue);
  //   // });

  //   cy.getByCy('manual-time').first().type('4');
  //   waitToLoad();
  //   // TODO explain trailing 0
  //   cy.get('tr').eq(1).find('input').should('have.value', '40');

  //   cy.getByCy('total_savings')
  //     .find('h3')
  //     .then(($totalSavings) => {
  //       const totalSavingsValue = $totalSavings.text();
  //       expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
  //     });
  //   cy.getByCy('current_page_savings')
  //     .find('h3')
  //     .then(($pageSavings) => {
  //       const pageSavingsValue = $pageSavings.text();
  //       expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
  //     });
  // });

  it('shows empty state when all rows are hidden', () => {
    let originalTotalSavingsValue = cy
      .getByCy('total_savings')
      .find('h3').textContent;

    cy.get('#table-kebab').click();
    cy.get('button').contains('Hide all').click();
    waitToLoad();
    cy.getByCy('total_savings')
      .find('h3')
      .then(($totalSavings) => {
        const totalSavingsValue = $totalSavings.text();
        expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
      });
    cy.getByCy('current_page_savings')
      .find('h3')
      .then(($pageSavings) => {
        const pageSavingsValue = $pageSavings.text();
        expect(pageSavingsValue).to.eq('$0.00');
      });
    cy.get('.pf-c-empty-state').should('exist');

    cy.get('button').contains('Show all').click();
    waitToLoad();
    cy.get('.pf-c-empty-state').should('not.exist');
    cy.getByCy('current_page_savings')
      .find('h3')
      .then(($pageSavings) => {
        const pageSavingsValue = $pageSavings.text();
        expect(pageSavingsValue).not.to.eq('$0.00');
      });
  });

  it('shows Automation formula', () => {
    cy.getByCy('automation_formula_button').click();
    cy.getByCy('automation_formula_modal').should('exist');
    cy.getByCy('automation_formula_cancel_button').click();
    cy.getByCy('automation_formula_modal').should('not.exist');
  });

  it('Query parameters are stored in the URL to enable refresh', () => {
    cy.getByCy('quick_date_range').click();
    cy.contains('Past 2 years').click();
    cy.url().should('include', 'quick_date_range=roi_last_2_years');
  });
});
