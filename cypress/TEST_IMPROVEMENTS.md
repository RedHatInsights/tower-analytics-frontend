# Cypress Test Improvements for PatternFly 6 Migration

## Overview
This document summarizes the improvements made to the Cypress E2E test suite to support the PatternFly 6 migration and enhance test reliability.

## Changes Made

### 1. PatternFly 6 Selector Updates

Updated all test files to use PatternFly 6 CSS class selectors instead of PatternFly 5:

#### Class Selector Changes
- `pf-v5-c-*` → `pf-v6-c-*`
- `pf-c-*` → `pf-v6-c-*`

#### Specific Component Updates

**Dropdown/Select Components:**
- `pf-v5-c-dropdown__menu` → `pf-v6-c-menu__list`
- `pf-v5-c-dropdown__toggle-text` → `pf-v6-c-menu-toggle__text`
- `pf-c-select__menu-item` → `pf-v6-c-select__menu-item`

**Toolbar Components:**
- `pf-v5-c-toolbar__item` → `pf-v6-c-toolbar__item`

**Empty State:**
- `pf-v5-c-empty-state__content` → `pf-v6-c-empty-state__content`

**Chip Groups:**
- `pf-v5-c-chip-group__main` → `pf-v6-c-chip-group__main`

**Switch Components:**
- `pf-v5-c-switch__toggle` → `pf-v6-c-switch__toggle`

**Data Lists:**
- `pf-v5-c-data-list` → `pf-v6-c-data-list`

**Charts:**
- `pf-c-chart` → `pf-v6-c-chart`

### 2. Files Updated

#### Test Spec Files (18 files)
- `cypress/e2e/Reports.spec.js`
- `cypress/e2e/ReportsPage.spec.js`
- `cypress/e2e/Clusters.spec.js`
- `cypress/e2e/OrganizationStatistics.spec.js`
- `cypress/e2e/AutomationCalculator.spec.js`
- `cypress/e2e/reports/ModuleUsageByJobTemplate.spec.js`
- `cypress/e2e/reports/TemplatesExplorer.spec.js`
- `cypress/e2e/reports/MostUsedModules.spec.js`
- `cypress/e2e/reports/ModuleUsageByTask.spec.js`
- `cypress/e2e/reports/ModuleUsageByOrganization.spec.js`
- `cypress/e2e/reports/JobsTasksByOrganization.spec.js`
- `cypress/e2e/reports/JobTemplateRunRate.spec.js`
- `cypress/e2e/reports/HostsChangedByJobTemplate.spec.js`
- `cypress/e2e/reports/AA2Migration.spec.js`
- `cypress/e2e/reports/ChangesMadeByJobTemplate.spec.js`
- `cypress/e2e/reports/HostsByOrganization.spec.js`
- `cypress/e2e/reports/HostAnomaliesBar.spec.js`

#### Support Files (1 file)
- `cypress/support/commands.js` - Updated custom commands and added new PF6-specific helpers

### 3. Test Reliability Improvements

#### Enhanced Waiting and Timeouts
```javascript
// Before
cy.getByCy('loading').should('not.exist');

// After
cy.getByCy('loading', { timeout: 10000 }).should('not.exist');
```

#### Better Error Messages
```javascript
// Before
expect(newTitle).not.to.eq(previousTitle);

// After
expect(newTitle, 'Report title should change after clicking next button').not.to.eq(previousTitle);
```

#### Added Visibility Checks
```javascript
// Before
cy.getByCy('preview_title_link').invoke('text')

// After
cy.getByCy('preview_title_link')
  .should('be.visible')
  .invoke('text')
```

#### Improved Test Structure (Reports.spec.js)
- Added comprehensive `beforeEach` setup with proper wait conditions
- Verified core UI elements are present before running tests
- Added detailed logging for each test iteration
- Improved assertion messages for better debugging
- Added proper timeouts for asynchronous operations

### 4. New Custom Commands

Added PatternFly 6-specific custom commands in `cypress/support/commands.js`:

#### `cy.waitForPF6Select(selector)`
Waits for a PatternFly 6 Select component to be visible and enabled.

```javascript
cy.waitForPF6Select('[data-cy="my-select"]');
```

#### `cy.selectPF6Option(toggleSelector, optionText)`
Selects an option from a PatternFly 6 Select component.

```javascript
cy.selectPF6Option('[data-cy="my-select"]', 'Option Text');
```

#### `cy.verifyPF6EmptyState(expectedMessage)`
Verifies that a component is displaying a PatternFly 6 empty state.

```javascript
cy.verifyPF6EmptyState('No data available');
```

#### `cy.waitForPageLoad()`
Waits for all loading indicators to complete (unified loading check).

```javascript
cy.waitForPageLoad();
```

### 5. Updated Existing Commands

#### `cy.tableShowAll()` and `cy.tableHideAll()`
Updated to use PatternFly 6 menu classes:

```javascript
// Updated selector
cy.get('.pf-v6-c-menu.pf-m-align-right')
```

## Benefits

1. **Compatibility**: Tests now work with PatternFly 6 components
2. **Reliability**: Added proper waits and timeouts reduce flakiness
3. **Debuggability**: Better error messages make failures easier to diagnose
4. **Maintainability**: New helper commands reduce code duplication
5. **Readability**: Improved test structure and naming conventions
6. **Robustness**: Visibility checks ensure elements are ready before interaction

## Migration Notes for Future Tests

When writing new tests or updating existing ones:

1. **Always use PatternFly 6 class selectors** (`pf-v6-c-*`)
2. **Prefer data-cy attributes** over CSS class selectors when possible
3. **Add explicit timeouts** for elements that may take time to appear
4. **Include visibility checks** before interacting with elements
5. **Use descriptive error messages** in assertions
6. **Leverage custom commands** for common PF6 interactions
7. **Add logging** to help debug test failures in CI/CD

## Example Test Pattern

```javascript
describe('Feature Test', () => {
  beforeEach(() => {
    cy.intercept('api/endpoint/*').as('apiCall');
    cy.visit('/page');
    cy.waitForPageLoad();
  });

  it('should perform action', () => {
    // Wait for element with timeout
    cy.getByCy('button', { timeout: 5000 })
      .should('be.visible')
      .and('be.enabled');
    
    // Use custom command for PF6 select
    cy.selectPF6Option('[data-cy="my-select"]', 'Option');
    
    // Assert with descriptive message
    cy.getByCy('result')
      .invoke('text')
      .should('contain', 'Expected Value', 'Result should display expected value');
  });
});
```

## Running Tests

```bash
# Run all tests in headless mode
npm run cy:headless

# Open Cypress UI for interactive testing
npm run cy:open
```

## Known Issues and Workarounds

1. **Ephemeral Environment**: Some assertions are skipped in ephemeral environments due to data differences
2. **Filter Toolbar**: The "Clear all filters" button may have visibility issues - using `{ force: true }` as workaround
3. **Dropdown Structure**: PatternFly 6 changed dropdown structure from nested buttons to menu lists

## Future Improvements

1. Add visual regression testing for PatternFly 6 components
2. Create more reusable custom commands for common workflows
3. Implement test data fixtures for consistent testing
4. Add performance monitoring for page load times
5. Enhance accessibility testing for PF6 components
