import { reportsUrl, hbo } from '../../support/constants';

describe('Report: Hosts By Organization Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + hbo);
    cy.getByCy('loading').should('not.exist');
    cy.getByCy('api_error_state').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({ force: true });
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.screenshot('report_hbo_bar.png');
    cy.screenshot('report_hbo_line.png');
  });

  it('Can change lookback', () => {
    cy.getByCy('quick_date_range').click();
    cy.get('.pf-c-select__menu-item').contains('Past 62 days').click();
  });
});
