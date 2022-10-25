import { jtbo as pageName } from '../../support/constants';

describe('Report: Jobs and Tasks By Organization Smoketests', () => {
  beforeEach(() => {
    cy.visitReport(pageName)
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
    cy.testItemsListFlow('top_pagination', 'jtbo')
    cy.testItemsListFlow('pagination_bottom', 'jtbo')

  });
});
