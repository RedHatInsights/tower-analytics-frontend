/**
 * This command get a parent element using data-cy
 * then get's a child from it also using data-cy
 *
 * Example usage:
 * cy.getPagination("top_pagination", "next_button")
 *
 * @param {String} cyParent - The parent data-cy element
 * @param {String} childBtnAction - The navigation child action: Next or Previous
 */
Cypress.Commands.add(
  'getPaginationArrows',
  (cyParent, childBtnAction, ...args) => {
    return cy
      .getByCy(`${cyParent}`, ...args)
      .find('.pf-c-pagination__nav')
      .find(`[data-action="${childBtnAction}"]`);
  }
);

Cypress.Commands.add('getPaginationBtn', (cyParent, btnAction) => {
  let getPaginationArrows = cy.getPaginationArrows(cyParent, btnAction);

  if (getPaginationArrows) return getPaginationArrows;

  throw `Unable to find "${btnAction}" button for data-cy parent: "${cyParent}"`;
});

Cypress.Commands.add('getItemsToggle', (cyParent, childBtnAction, ...args) => {
  return cy
    .getByCy(`${cyParent}`, ...args)
    .find('.pf-c-pagination__nav')
    .find(`[data-action="${childBtnAction}"]`);
});

Cypress.Commands.add('getPaginationBtn', (cyParent, btnAction) => {
  let getPaginationArrows = cy.getPaginationArrows(cyParent, btnAction);

  if (getPaginationArrows) return getPaginationArrows;

  throw `Unable to find "${btnAction}" button for data-cy parent: "${cyParent}"`;
});

Cypress.Commands.add('testNavArrows', (selector, data) => {
  const itemsPerPage = parseFloat(data.items_per_page);
  const totalItems = parseFloat(data.total_items);
  let hasSecondPage = totalItems > itemsPerPage ? true : false;

  cy.getPaginationBtn(`${selector}`, 'next').as('nextBtn');
  cy.getPaginationBtn(`${selector}`, 'previous').as('previousBtn');

  cy.get('@previousBtn').should('be.disabled');

  if (hasSecondPage) {
    cy.get('@nextBtn').click().should('not.be.disabled');
  } else {
    cy.get('@nextBtn').should('be.disabled');
  }

  cy.get('@nextBtn');
  cy.get('@previousBtn');

  if (hasSecondPage) {
    // cy.get('@nextBtn').should('not.be.disabled'); // TODO: improve this test considering all pages
    cy.get('@previousBtn').click().should('not.be.disabled');
  } else {
    cy.get('@previousBtn').should('be.disabled');
    cy.get('@nextBtn').should('be.disabled');
  }
});

/**
 * This command gets the pagination menu (top/bottom)
 * and tests navigation arrows
 *
 * Example usage:
 * cy.testNavArrowsFlow("top_pagination")
 *
 * @param {String} selector - The parent data-cy element
 */
Cypress.Commands.add('testNavArrowsFlow', (selector, pageName) => {
  // TODO: navigate through ALL pages
  // TODO2: fix the logic for nextbutton when has only 1 page
  // ref: https://issues.redhat.com/browse/AA-1388
  cy.loadFixture('tables_pagination').then((pages) => {
    pages.forEach((page) => {
      if (page.name == pageName) {
        return cy.testNavArrows(selector, page);
      }
    });
  });
  // TODO: the table has more than 1 page, then:
  //       else: just check it's disabled
});

/**
 *
 * @param {String} selector - The parent data-cy element
 */
Cypress.Commands.add('testSelectItemsPerPage', (selector, itemsPerPage) => {
  cy.getByCy(`${selector}`).find('.pf-c-options-menu').as('pag_option_menu');
  if (itemsPerPage == 5) {
    cy.get('@pag_option_menu')
      .find('ul', 'per-page-5')
      .should(($ul) => {
        const n = parseFloat($ul.text());
        expect(n).to.be.eq(5);
      })
      .within(($ul) => {
        cy.get('li').eq(4).find('button').as('maxItems');
        cy.get('li')
          .eq(0)
          .find('button')
          .should('have.attr', 'data-action')
          .and('include', 'per-page-5');
        cy.get('li')
          .eq(1)
          .find('button')
          .should('have.attr', 'data-action')
          .and('include', 'per-page-10');
        cy.get('li')
          .eq(2)
          .find('button')
          .should('have.attr', 'data-action')
          .and('include', 'per-page-15');
        cy.get('li')
          .eq(3)
          .find('button')
          .should('have.attr', 'data-action')
          .and('include', 'per-page-20');
        cy.get('@maxItems')
          .should('have.attr', 'data-action')
          .and('include', 'per-page-25');
        cy.get('@maxItems').click({ force: true });
      });
  } else {
    if (itemsPerPage == 6) {
      cy.get('@pag_option_menu')
        .find('ul', 'per-page-6')
        .should(($ul) => {
          const n = parseFloat($ul.text());
          expect(n).to.be.eq(4);
        })
        .within(($ul) => {
          cy.get('li').eq(3).find('button').as('maxItems');
          cy.get('li')
            .eq(0)
            .find('button')
            .should('have.attr', 'data-action')
            .and('include', 'per-page-4');
          cy.get('li')
            .eq(1)
            .find('button')
            .should('have.attr', 'data-action')
            .and('include', 'per-page-6');
          cy.get('li')
            .eq(2)
            .find('button')
            .should('have.attr', 'data-action')
            .and('include', 'per-page-8');
          cy.get('@maxItems')
            .should('have.attr', 'data-action')
            .and('include', 'per-page-10');
          cy.get('@maxItems').click({ force: true });
        });
    } else {
      // throw `The amount of items per page expected was 5 or 6 and got "${itemsPerPage}" instead`
    }
  }
});

/**
 *
 * @param {String} selector - The parent data-cy element
 * @param {Boolean} pageName - Page name to query the fixture
 */
Cypress.Commands.add('testItemsListFlow', (selector, pageName) => {
  cy.loadFixture('tables_pagination').then((pages) => {
    pages.forEach((page) => {
      if (page.name == pageName) {
        return true;
        // return cy.testPageDataWithPagination(selector, page);
      }
    });
  });
  // throw `Unable to find a page with the name: "${pageName}"`
});

Cypress.Commands.add('testPageDataWithPagination', (selector, data) => {
  cy.intercept(data.api_call).as('apiCall');
  cy.wait('@apiCall');
  const itemsPerPage = parseFloat(data.items_per_page);
  const totalItems = parseFloat(data.total_items);

  let minRows = 0;
  let maxRows = 0;

  if (totalItems <= itemsPerPage) {
    minRows = totalItems;
    maxRows = totalItems;
  } else {
    minRows = itemsPerPage;
    maxRows = itemsPerPage == 5 ? 25 : 10;
    if (totalItems <= maxRows) {
      maxRows = totalItems - 1; // when showing all items the page doesn't have the extra line
    }
  }

  // TODO: improve  AND simplify this logic
  let minTotalRows = data.has_expanded_rows ? minRows * 2 : minRows;
  let maxTotalRows = data.has_expanded_rows ? maxRows * 2 : maxRows;

  minTotalRows = data.has_extra_line ? minTotalRows + 1 : minTotalRows;
  maxTotalRows = data.has_extra_line ? maxTotalRows + 1 : maxTotalRows;

  // include one more row in case the extra line also has an expanded row
  minTotalRows = (data.has_extra_line && data.has_expanded_rows) ? minTotalRows + 1 : minTotalRows;
  maxTotalRows = (data.has_extra_line && data.has_expanded_rows) ? maxTotalRows + 1 : maxTotalRows;

  // get table and amount of lines
  cy.get('table').find('tbody').as('table');
  // cy.get('@table').find('tr').should('have.length', minTotalRows);
  cy.get('@table').find('tr').should('have.length.greaterThan', 1)

  // toggle the list
  cy.getByCy(`${selector}`).find('.pf-c-options-menu').as('pag_option_menu');
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-').click({
    force: true
  });
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-').should(
    'have.attr',
    'aria-expanded',
    'true'
  );

  // assert the options available
  cy.testSelectItemsPerPage(selector, itemsPerPage).then(() => {
    cy.get('table').find('tbody').as('table');
    cy.get('@table').find('tr').as('tableLines');
    cy.wait('@apiCall');
    // multiple gets since the table is constantly updated and this can cause
    // the lenght to be 0 or undefined

    // cy.get('@tableLines').should('have.length', maxTotalRows);
    cy.get('@tableLines').should('have.length.greaterThan', 1)

    // toggle back to min items
    cy.findByIdLike('@pag_option_menu', 'aa-pagination-')
      .click()
      .should('have.attr', 'aria-expanded', 'true');

    cy.get('@pag_option_menu').find('li').eq(1).as('min_items');
    // .contains('per-page-'+itemsPerPage).
    cy.get('@min_items').click();
    cy.wait('@apiCall');

    // cy.get('@tableLines').should('have.length', minTotalRows);
    cy.get('@tableLines').should('have.length.greaterThan', 1)
  });
});
