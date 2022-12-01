import { hab as pageName } from '../../support/constants';
//disable as there's no data for this page on eph. env. right now
xdescribe('Report: Slow hosts by job template (aka Host Anomalies Bar)', () => {
  beforeEach(() => {
    cy.visitReport(pageName);
  });

  it('Renders bar chart with data', () => {
    cy.get('.pf-c-chart').should('exist');
  });

  it('Can change lookback', () => {
    cy.getByCy('quick_date_range').click();
    cy.get('.pf-c-select__menu-item').contains('Past month').click();
  });
});
