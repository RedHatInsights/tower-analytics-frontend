import { reportsUrl, jtbo } from '../../support/constants';

describe('Report: Jobs and Tasks By Organization Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + jtbo);
    cy.getByCy('loading').should('not.exist');
    cy.getByCy('api_error_state').should('not.exist');
    cy.getByCy('api_loading_state').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({ force: true });
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
  });

  it('Can change lookback', () => {
    cy.getByCy('quick_date_range').click();
    cy.get('.pf-c-select__menu-item').contains('Past 62 days').click();
  });

  it('Can navigate through the pages', () => {
    cy.testNavArrowsFlow('top_pagination')
    cy.testNavArrowsFlow('pagination_bottom')

  });

  it('Can change the number of items shown on the list', () => {
    cy.testItemsListFlow('top_pagination', false, false, 1, 1)
    cy.testItemsListFlow('pagination_bottom', false, false, 1, 1)

  });
});
