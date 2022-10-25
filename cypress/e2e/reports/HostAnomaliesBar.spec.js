import { hab as pageName } from '../../support/constants';

// swiching host anomalies off for now because it's not working on stage
xdescribe('Report: Host Anomalies Bar', () => {
  beforeEach(() => {
    cy.visitReport(pageName)
    cy.intercept('/api/tower-analytics/v1/probe_templates/').as('probeTemplates')
    cy.wait('@probeTemplates')
  });

  it('Renders bar chart with data', () => {
    cy.get('.pf-c-chart').should('exist');
  });

  it('Can change lookback', () => {
    cy.getByCy('quick_date_range').click();
    cy.get('.pf-c-select__menu-item').contains('Past month').click();
  });
});
