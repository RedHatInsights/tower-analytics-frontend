import { mubjt as pageName } from '../../support/constants';

describe('Report: Module Usage By Job Template Smoketests', () => {
  beforeEach(() => {
    cy.visitReport(pageName);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
  });

  it('Can change lookback', () => {
    cy.getByCy('quick_date_range').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });

  it('Can navigate through the pages', () => {
    cy.testNavArrowsFlow('top_pagination', pageName);
    cy.testNavArrowsFlow('pagination_bottom', pageName);
  });

  it('Can change the number of items shown on the list', () => {
    cy.testItemsListFlow('top_pagination', pageName);
    cy.testItemsListFlow('pagination_bottom', pageName);
  });
});
