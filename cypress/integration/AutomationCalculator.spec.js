/* global cy */
import { appid, calculatorUrl, jobExplorerUrl } from '../support/constants';

describe('Automation Caluclator page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(calculatorUrl);
  });

  it('can change manual and automated cost', () => {
    cy.get('#manual-cost').type('1');
    cy.get('#automation-cost').type('1');

    cy.get('#manual-cost').should('have.value', '501');
    cy.get('#automation-cost').should('have.value', '201');

    // Maybe check the total cost after the chagne --> fixtures needed
  });

  it('can hover over the first 3 bars to show tooltip', () => {
    for (let i = 0; i < 3; i++) {
      cy.get(appid)
        .find('g > rect')
        .eq(i)
        .trigger('mouseover', { force: true });
      cy.get('#svg-chart-Tooltip-base-d3-roi-chart-root').should(
        'have.css',
        'opacity',
        '1'
      );
    }
  });

  xit('can click on the template name', () => {
    cy.get('.top-templates').find('a').eq(0).click();
    cy.location().should((location) => {
      expect(location.pathname).to.include(jobExplorerUrl);
    });
  });
  it('Query parameters are stored in the URL to enable refresh', () => {
    // Add more once fixtures are implemented - other filters are content-dependent.
    cy.get('[data-cy="quick_date_range"]').click();
    cy.contains('Past 2 years').click();
    cy.url().should('include', 'quick_date_range=roi_last_2_years');
  });
});
