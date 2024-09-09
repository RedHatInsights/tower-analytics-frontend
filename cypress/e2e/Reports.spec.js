import {
  reportsUrl,
  allReports,
  skippedTests,
  ENV,
  ENVS,
} from '../support/constants';

describe("Reports' navigation on Reports page - smoketests", () => {
  beforeEach(() => {
    cy.intercept('api/tower-analytics/v1/event_explorer/*').as('eventExplorer');
    cy.visit(reportsUrl);
    cy.getByCy('loading').should('not.exist');
    cy.getByCy('api_error_state').should('not.exist');
    cy.getByCy('api_loading_state').should('not.exist');
    cy.wait('@eventExplorer');
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
      cy.getByCy('preview_title_link').then(($previewTitle) => {
        const newTitlePreview = $previewTitle.text();
        if (ENV != ENVS.EPHEMERAL) {
          // Doesn't seem to work on ephemeral
          expect(newTitlePreview).not.to.eq(originalTitlePreview);
        }
        originalTitlePreview = newTitlePreview;
      });
    });
    allReports.forEach((report) => {
      cy.log(report);
      if (skippedTests['reports'].includes(report)) return;
      cy.getByCy('previous_report_button').click();
      cy.getByCy('preview_title_link').then(($previewTitle) => {
        const newTitlePreview = $previewTitle.text();
        if (ENV != ENVS.EPHEMERAL) {
          // Doesn't seem to work on ephemeral
          expect(newTitlePreview).not.to.eq(originalTitlePreview);
        }
        originalTitlePreview = newTitlePreview;
      });
    });
  });

  it('All report are accessible in preview via dropdownn', () => {
    cy.getByCy('selected_report_dropdown').should('exist');
    allReports.forEach((item, index) => {
      cy.log(item);
      if (skippedTests['reports'].includes(item)) return;

      cy.getByCy('selected_report_dropdown').click();
      cy.get('ul.pf-v5-c-dropdown__menu > button > li > a').should('exist');
      cy.get('ul.pf-v5-c-dropdown__menu > button > li > a').eq(index).click();
      cy.getByCy('preview_title_link')
        .invoke('text')
        .then((item) => {
          cy.get(
            '[data-cy="selected_report_dropdown"] > span.pf-v5-c-dropdown__toggle-text'
          )
            .invoke('text')
            .should('eq', item);
        });
    });
  });
});
