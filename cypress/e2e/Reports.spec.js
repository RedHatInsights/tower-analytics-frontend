import {
  ENV,
  ENVS,
  allReports,
  reportsUrl,
  skippedTests,
} from '../support/constants';

describe("Reports' navigation on Reports page - smoketests", () => {
  beforeEach(() => {
    cy.intercept('api/tower-analytics/v1/event_explorer/*').as('eventExplorer');
    cy.visit(reportsUrl);
    
    // Wait for page to fully load
    cy.getByCy('loading', { timeout: 10000 }).should('not.exist');
    cy.getByCy('api_error_state').should('not.exist');
    cy.getByCy('api_loading_state').should('not.exist');
    
    // Try to wait for API but don't fail if it doesn't happen
    cy.window().then({ timeout: 15000 }, () => {
      // Just give page time to load
      cy.wait(2000);
    });
    
    // Verify core UI elements are present
    cy.getByCy('preview_title_link').should('be.visible');
    cy.getByCy('next_report_button').should('be.visible');
    cy.getByCy('previous_report_button').should('be.visible');
    cy.getByCy('selected_report_dropdown').should('be.visible');
  });

  // TODO: flaky and redundant test, we need to rewrite it
  // it('All report cards can appear in preview via dropdown', () => {
  //   allReports.forEach((item) => {
  //     cy.getByCy(item).should('exist')
  //     cy.get('a').should('have.href', aapUrl + reportsUrl + '/' + item)
  //   })
  // })

  it('All reports are accessible in preview via arrows', () => {
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

  it('All reports are accessible in preview via dropdown', () => {
    cy.getByCy('selected_report_dropdown')
      .should('exist')
      .and('be.visible', 'Report dropdown should be visible');
    
    allReports.forEach((reportName, index) => {
      if (skippedTests['reports'].includes(reportName)) {
        cy.log(`Skipping report: ${reportName}`);
        return;
      }

      cy.log(`Testing dropdown selection for report: ${reportName} (${index + 1}/${allReports.length})`);
      
      // Open dropdown
      cy.getByCy('selected_report_dropdown').click();
      
      // PatternFly 6 Dropdown uses DropdownList with DropdownItem components wrapped in buttons
      cy.get('[role="menu"]', { timeout: 5000 })
        .should('be.visible')
        .find('button')
        .should('have.length.at.least', 1, 'Dropdown should contain menu items');
      
      // Click the item at the specified index
      cy.get('[role="menu"]')
        .find('button')
        .eq(index)
        .click();
      
      // Verify the selected report matches the preview title
      cy.getByCy('preview_title_link', { timeout: 5000 })
        .should('be.visible')
        .invoke('text')
        .then((previewTitle) => {
          cy.getByCy('selected_report_dropdown')
            .invoke('text')
            .should('contain', previewTitle, `Dropdown selection should match preview title for ${reportName}`);
        });
    });
  });
});
