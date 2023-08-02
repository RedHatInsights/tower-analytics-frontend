import {
  aapUrl,
  reportsUrl,
  allReports,
  skippedTests,
  ENV,
  ENVS,
} from '../support/constants';

describe('Reports page smoketests', () => {
  beforeEach(() => {
    cy.intercept('api/tower-analytics/v1/event_explorer/*').as('eventExplorer');
    cy.visit(reportsUrl);
    cy.getByCy('loading').should('not.exist');
    cy.getByCy('api_error_state').should('not.exist');
    cy.getByCy('api_loading_state').should('not.exist');
    cy.wait('@eventExplorer');
  });

  it('All report cards are displayed on main reports page', () => {
    allReports.forEach((item) => {
      cy.getByCy(item).should('exist');
    });
  });

  it('All report cards have correct href in the title', () => {
    allReports.forEach((item) => {
      cy.getByCy(item).should('exist');
      cy.getByCy(item)
        .find('a')
        .should('have.attr', 'href', aapUrl + reportsUrl + '/' + item);
    });
  });

  it('All report cards can be selected for the preview with correct links', () => {
    allReports.forEach((item) => {
      cy.log(item);
      if (skippedTests['reports'].includes(item)) return;

      cy.getByCy(item).click().should('exist');
      if (ENV != ENVS.STAGE) {
        cy.waitSpinner();
      }
      // correct card is highlighted
      cy.getByCy(item).should('have.class', 'pf-m-selected-raised');
      // check View full report link is correct
      if (ENV != ENVS.STAGE) {
        cy.getByCy('view_full_report_link').should(
          'have.attr',
          'href',
          aapUrl + reportsUrl + '/' + item
        );
      } else {
        cy.get(`[data-cy="view_full_report_link"]`).should(
          'have.attr',
          'href',
          aapUrl + reportsUrl + '/' + item
        );
      }
      // check Title link is correct
      cy.getByCy('preview_title_link').should(
        'have.attr',
        'href',
        aapUrl + reportsUrl + '/' + item
      );
    });
  });

  // TODO: flaky and redundant test, we need to rewrite it
  // it('All report cards can appear in preview via dropdown', () => {
  //   allReports.forEach((item) => {
  //     cy.getByCy(item).should('exist')
  //     cy.get('a').should('have.href', aapUrl + reportsUrl + '/' + item)
  //   })
  // })

  // FIXME: Workaround to force cypress to wait the graph to load
  it('All report are accessible in preview via arrows', () => {
    let originalTitlePreview = cy.getByCy('preview_title_link').textContent;

    allReports.forEach((report) => {
      cy.log(report);
      if (skippedTests['reports'].includes(report)) return;
      cy.getByCy('next_report_button').click();
      cy.wait(250);
      cy.getByCy('preview_title_link').then((previewTitle) => {
        cy.log(previewTitle);
        const newTitlePreview = previewTitle.text();
        expect(newTitlePreview).not.to.eq(originalTitlePreview);
        originalTitlePreview = newTitlePreview;
      });
    });

    allReports.forEach((report) => {
      cy.log(report);
      if (skippedTests['reports'].includes(report)) return;
      cy.getByCy('previous_report_button').click();

      cy.getByCy('preview_title_link').then((previewTitle) => {
        cy.log(previewTitle);
        const newTitlePreview = previewTitle.text();
        expect(newTitlePreview).not.to.eq(originalTitlePreview);
        originalTitlePreview = newTitlePreview;
      });
    });
  });

  it('All report are accessible in preview via dropdownn', () => {
    cy.getByCy('selected_report_dropdown').should('exist');
    allReports.forEach(($item, index) => {
      cy.getByCy('selected_report_dropdown').click();
      cy.get('ul.pf-c-dropdown__menu > button > li > a').should('exist');
      cy.get('ul.pf-c-dropdown__menu > button > li > a').eq(index).click();
      cy.getByCy('preview_title_link')
        .invoke('text')
        .then(($text) => {
          cy.get(
            '[data-cy="selected_report_dropdown"] > span.pf-c-dropdown__toggle-text'
          )
            .invoke('text')
            .should('eq', $text);
        });
    });
  });
});
