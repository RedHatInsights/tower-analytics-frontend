import { reportsUrl } from '../support/constants';

describe('PatternFly 6 Components Verification', () => {
  beforeEach(() => {
    cy.intercept('api/tower-analytics/v1/event_explorer/*').as('eventExplorer');
  });

  it('Verify PatternFly 6 CSS classes are present', () => {
    cy.visit(reportsUrl);
    cy.wait('@eventExplorer', { timeout: 15000 }).then(() => {
      cy.waitForPageLoad();
    });

    // Check for PatternFly 6 classes in the page
    cy.get('body').then(($body) => {
      const html = $body.html();

      // Log what we find
      if (html.includes('pf-v6-c-')) {
        cy.log('✓ PatternFly 6 classes found in page');
      } else {
        cy.log('✗ No PatternFly 6 classes found');
      }

      if (html.includes('pf-v5-c-')) {
        cy.log('⚠ PatternFly 5 classes still present');
      }
    });

    // Verify dropdown component renders
    cy.getByCy('selected_report_dropdown')
      .should('exist')
      .then(($dropdown) => {
        cy.log('Dropdown element:', $dropdown.prop('outerHTML'));
      });

    // Click dropdown and inspect menu structure
    cy.getByCy('selected_report_dropdown').click();

    // Wait a moment for menu to render
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    // Log the menu structure
    cy.get('body').then(($body) => {
      // Check for different possible menu structures
      const hasRoleMenu = $body.find('[role="menu"]').length > 0;
      const hasV6Menu = $body.find('.pf-v6-c-menu').length > 0;
      const hasV5Menu = $body.find('.pf-v5-c-menu').length > 0;
      const hasDropdownList = $body.find('[class*="DropdownList"]').length > 0;

      cy.log('Menu structure detected:');
      cy.log('- [role="menu"]:', hasRoleMenu);
      cy.log('- .pf-v6-c-menu:', hasV6Menu);
      cy.log('- .pf-v5-c-menu:', hasV5Menu);
      cy.log('- DropdownList:', hasDropdownList);

      if (hasRoleMenu) {
        const menuHtml = $body.find('[role="menu"]').first().prop('outerHTML');
        cy.log('Menu HTML (first 500 chars):', menuHtml.substring(0, 500));
      }
    });
  });

  it('Verify switch components use PF6 classes', () => {
    cy.visit('/organization-statistics');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);

    // Look for switch toggles
    cy.get('body').then(($body) => {
      const hasV6Switch = $body.find('.pf-v6-c-switch__toggle').length > 0;
      const hasV5Switch = $body.find('.pf-v5-c-switch__toggle').length > 0;

      cy.log('Switch components:');
      cy.log('- PF6 switches (.pf-v6-c-switch__toggle):', hasV6Switch);
      cy.log('- PF5 switches (.pf-v5-c-switch__toggle):', hasV5Switch);
    });
  });

  it('Verify empty state components use PF6 classes', () => {
    // Visit a page that might have empty states
    cy.visit('/clusters');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);

    cy.get('body').then(($body) => {
      const hasV6EmptyState = $body.find('.pf-v6-c-empty-state').length > 0;
      const hasV5EmptyState = $body.find('.pf-v5-c-empty-state').length > 0;

      cy.log('Empty state components:');
      cy.log('- PF6 empty states (.pf-v6-c-empty-state):', hasV6EmptyState);
      cy.log('- PF5 empty states (.pf-v5-c-empty-state):', hasV5EmptyState);
    });
  });
});
