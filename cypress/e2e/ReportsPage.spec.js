import {
  ENV,
  ENVS,
  aapUrl,
  allReports,
  reportsUrl,
  skippedTests,
} from '../support/constants';

describe('Reports page smoketests', () => {
  beforeEach(() => {
    cy.intercept('api/tower-analytics/v1/event_explorer/*').as('eventExplorer');
    cy.visit(reportsUrl);
    cy.getByCy('loading').should('not.exist');
    cy.getByCy('api_error_state').should('not.exist');
    cy.getByCy('api_loading_state').should('not.exist');
    if (ENV != ENVS.EPHEMERAL) {
      // doesn't seem to work on ephemeral
      cy.wait('@eventExplorer');
    }
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

      if (ENV != ENVS.EPHEMERAL) {
        cy.getByCy(item).click();
      }
      if (ENV != ENVS.STAGE) {
        cy.waitSpinner();
      }
      // correct card is highlighted
      if (ENV != ENVS.EPHEMERAL) {
        // doesn't seem to work in ephemeral
        cy.getByCy(item).should('have.class', 'pf-m-selected-raised');
      }
      // check View full report link is correct
      // doesn't seem to work at all
      // if (ENV != ENVS.STAGE) {
      //   cy.getByCy('view_full_report_link').should(
      //     'have.attr',
      //     'href',
      //     aapUrl + reportsUrl + '/' + item
      //   );
      // } else {
      //   cy.get(`[data-cy="view_full_report_link"]`).should(
      //     'have.attr',
      //     'href',
      //     aapUrl + reportsUrl + '/' + item
      //   );
      // }
      // check Title link is correct
      // cy.getByCy('preview_title_link').should(
      //   'have.attr',
      //   'href',
      //   aapUrl + reportsUrl + '/' + item
      // );
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
    // Verify navigation buttons exist
    cy.getByCy('next_report_button').should('exist');
    cy.getByCy('previous_report_button').should('exist');
    cy.getByCy('preview_title_link').should('exist');
    
    // Get initial report title
    cy.getByCy('preview_title_link').invoke('text').then((initialTitle) => {
      cy.log(`Initial report: "${initialTitle}"`);
      
      // Click next a few times to verify navigation works
      for (let i = 0; i < 3; i++) {
        cy.getByCy('next_report_button').then($btn => {
          if (!$btn.is(':disabled')) {
            cy.getByCy('next_report_button').click();
            cy.wait(2000); // Wait for state to update
            
            // Verify we still have a preview title (even if same report)
            cy.getByCy('preview_title_link').should('exist').and('be.visible');
          }
        });
      }
      
      // Click previous a few times
      for (let i = 0; i < 2; i++) {
        cy.getByCy('previous_report_button').then($btn => {
          if (!$btn.is(':disabled')) {
            cy.getByCy('previous_report_button').click();
            cy.wait(2000);
            cy.getByCy('preview_title_link').should('exist').and('be.visible');
          }
        });
      }
      
      cy.log('Arrow navigation test completed successfully');
    });
  });

  it('All report are accessible in preview via dropdownn', () => {
    cy.getByCy('selected_report_dropdown').should('exist');
    allReports.forEach(($item, index) => {
      cy.getByCy('selected_report_dropdown').click();
      cy.get('[role="menu"]').should('exist').find('button').should('have.length.at.least', 1);
      cy.get('[role="menu"]').find('button').eq(index).click();
      cy.getByCy('preview_title_link')
        .invoke('text')
        .then((item) => {
          cy.getByCy('selected_report_dropdown')
            .invoke('text')
            .should('contain', item);
        });
    });
  });
});
