# Quick Reference: Cypress Tests for PatternFly 6

## Common PatternFly 6 Selectors

### Dropdowns and Menus
```javascript
// Open dropdown
cy.get('[data-cy="my-dropdown"]').click();

// Select menu item
cy.get('.pf-v6-c-menu__list > li').contains('Option').click();

// Verify dropdown toggle text
cy.get('[data-cy="my-dropdown"] .pf-v6-c-menu-toggle__text')
  .should('contain', 'Selected Option');
```

### Select Components
```javascript
// Using custom command (recommended)
cy.selectPF6Option('[data-cy="my-select"]', 'Option Text');

// Manual approach
cy.get('[data-cy="my-select"]').click();
cy.get('.pf-v6-c-select__menu-item').contains('Option').click();
```

### Empty States
```javascript
// Verify empty state exists
cy.get('.pf-v6-c-empty-state__content').should('be.visible');

// Verify empty state with specific message
cy.verifyPF6EmptyState('No data available');

// Verify empty state doesn't exist
cy.get('.pf-v6-c-empty-state__content').should('not.exist');
```

### Chip Groups (Filter Tags)
```javascript
// Verify chip exists
cy.get('.pf-v6-c-chip-group__main')
  .contains('Filter Name')
  .should('exist');

// Remove chip
cy.get('.pf-v6-c-chip-group__main')
  .contains('Filter Name')
  .parent()
  .find('button')
  .click();
```

### Switches/Toggles
```javascript
// Click switch
cy.get('.pf-v6-c-switch__toggle').click();

// Verify switch state
cy.get('.pf-v6-c-switch__input')
  .should('be.checked'); // or 'not.be.checked'
```

### Toolbars
```javascript
// Find toolbar item
cy.get('.pf-v6-c-toolbar__item')
  .contains('Button Text')
  .click();

// Clear all filters
cy.get('[data-cy="filter-toolbar"]')
  .find('button')
  .contains('Clear all filters')
  .click();
```

### Data Lists
```javascript
// Find data list items
cy.get('.pf-v6-c-data-list')
  .find('li')
  .should('have.length.at.least', 1);

// Hover over data list item
cy.get('.pf-v6-c-data-list > li')
  .first()
  .trigger('mouseover');
```

## Custom Commands Quick Reference

### Loading States
```javascript
// Wait for all loading to complete
cy.waitForPageLoad();

// Wait for specific spinner
cy.getByCy('spinner').should('not.exist');
```

### Data Attributes
```javascript
// Get by data-cy
cy.getByCy('element-id');

// Get by data-ouia
cy.getByOUIA('element-id');

// Get by data-cy with partial match
cy.getByCyLike('partial-text');
```

### PatternFly 6 Helpers
```javascript
// Wait for select to be ready
cy.waitForPF6Select('[data-cy="my-select"]');

// Select option from PF6 select
cy.selectPF6Option('[data-cy="my-select"]', 'Option');

// Verify empty state
cy.verifyPF6EmptyState('No results');
```

### Table Actions
```javascript
// Show all table rows
cy.tableShowAll();

// Hide all table rows
cy.tableHideAll();
```

## Best Practices

### 1. Always Add Timeouts for Async Elements
```javascript
// Good
cy.getByCy('loading', { timeout: 10000 }).should('not.exist');

// Bad
cy.getByCy('loading').should('not.exist');
```

### 2. Check Visibility Before Interaction
```javascript
// Good
cy.getByCy('button')
  .should('be.visible')
  .and('be.enabled')
  .click();

// Bad
cy.getByCy('button').click();
```

### 3. Use Descriptive Assertions
```javascript
// Good
expect(value, 'Should display user name').to.eq('John Doe');

// Bad
expect(value).to.eq('John Doe');
```

### 4. Intercept API Calls
```javascript
beforeEach(() => {
  cy.intercept('api/endpoint/*').as('apiCall');
  cy.visit('/page');
  cy.wait('@apiCall', { timeout: 15000 });
});
```

### 5. Use beforeEach for Common Setup
```javascript
describe('Feature', () => {
  beforeEach(() => {
    cy.visit('/page');
    cy.waitForPageLoad();
    cy.getByCy('main-content').should('be.visible');
  });

  it('test case', () => {
    // Test implementation
  });
});
```

## Common Patterns

### Waiting for Navigation
```javascript
cy.getByCy('nav-link').click();
cy.url().should('include', '/expected-path');
cy.waitForPageLoad();
```

### Form Submission
```javascript
cy.getByCy('input-field').type('value');
cy.selectPF6Option('[data-cy="select"]', 'Option');
cy.getByCy('submit-button').click();
cy.wait('@submitApi');
cy.getByCy('success-message').should('be.visible');
```

### Iterating Through Items
```javascript
cy.get('.pf-v6-c-menu__list > li').each(($item, index) => {
  cy.log(`Processing item ${index + 1}`);
  cy.wrap($item).should('be.visible');
});
```

### Conditional Testing
```javascript
cy.get('body').then($body => {
  if ($body.find('.pf-v6-c-empty-state').length > 0) {
    cy.log('Empty state found');
  } else {
    cy.log('Content present');
  }
});
```

## Debugging Tips

### 1. Use cy.log() Liberally
```javascript
cy.log('Testing dropdown with value:', selectedValue);
```

### 2. Take Screenshots on Failure
```javascript
cy.screenshot('failure-state', { capture: 'fullPage' });
```

### 3. Pause Execution for Debugging
```javascript
cy.pause(); // Opens Cypress UI at this point
```

### 4. Print Element Details
```javascript
cy.getByCy('element').then($el => {
  console.log('Element:', $el);
  console.log('Text:', $el.text());
  console.log('Classes:', $el.attr('class'));
});
```

### 5. Check Network Tab
```javascript
cy.intercept('**/api/**').as('allApiCalls');
// ... test actions ...
cy.get('@allApiCalls.all').should('have.length.at.least', 1);
```

## Migration Checklist

When updating tests for PF6:

- [ ] Replace `pf-v5-c-*` with `pf-v6-c-*`
- [ ] Replace `pf-c-*` with `pf-v6-c-*`
- [ ] Update dropdown selectors (menu structure changed)
- [ ] Add explicit timeouts where needed
- [ ] Add visibility checks before interactions
- [ ] Use custom commands for common PF6 patterns
- [ ] Add descriptive error messages to assertions
- [ ] Test in both local and CI environments
- [ ] Update documentation if adding new patterns
