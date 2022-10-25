import { jtrr as pageName} from '../../support/constants';

describe('Report: Job Template Run Rate Smoketests', () => {
  beforeEach(() => {
    cy.visitReport(pageName)
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.screenshot('report_jtrr_bar.png');
    cy.screenshot('report_jtrr_line.png');
  });

  it('Can change lookback', () => {
    cy.getByCy('quick_date_range').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });

  it('Can navigate through the pages', () => {
    cy.testNavArrowsFlow('top_pagination')
    cy.testNavArrowsFlow('pagination_bottom')

  });

  it('Can change the number of items shown on the list', () => {
    cy.testItemsListFlow('top_pagination', 'jtrr')
    cy.testItemsListFlow('pagination_bottom', 'jtrr')

  });
});
