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
Cypress.Commands.add('getPaginationArrows', (cyParent, childBtnAction, ...args) => {
  return cy.getByCy(`${cyParent}`, ...args)
    .find('.pf-c-pagination__nav')
    .find(`[data-action="${childBtnAction}"]`)

});

Cypress.Commands.add('getPaginationBtn', (cyParent, btnAction) => {
  let getPaginationArrows = cy.getPaginationArrows(cyParent, btnAction)

  if (getPaginationArrows) return getPaginationArrows

  throw `Unable to find "${btnAction}" button for data-cy parent: "${cyParent}"`
});

Cypress.Commands.add('getItemsToggle', (cyParent, childBtnAction, ...args) => {
  return cy.getByCy(`${cyParent}`, ...args)
    .find('.pf-c-pagination__nav')
    .find(`[data-action="${childBtnAction}"]`)
});

Cypress.Commands.add('getPaginationBtn', (cyParent, btnAction) => {
  let getPaginationArrows = cy.getPaginationArrows(cyParent, btnAction)

  if (getPaginationArrows) return getPaginationArrows

  throw `Unable to find "${btnAction}" button for data-cy parent: "${cyParent}"`
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
Cypress.Commands.add('testNavArrowsFlow', (selector) => {
  // TODO: navigate through ALL pages

  cy.getPaginationBtn(`${selector}`, 'next').as('nextBtn')
  cy.getPaginationBtn(`${selector}`, 'previous').as('previousBtn')

  cy.get('@previousBtn').should('be.disabled')
  cy.get('@nextBtn').should('not.be.disabled').click()

  cy.getPaginationBtn(`${selector}`, 'next').as('nextBtn')
  cy.getPaginationBtn(`${selector}`, 'previous').as('previousBtn')

  cy.get('@nextBtn').should('not.be.disabled')
  cy.get('@previousBtn').should('not.be.disabled').click()

});

/**
 * 
 * @param {String} selector - The parent data-cy element
 * @param {Boolean} [has_expanded_rows=false] - does it expand the rows?
 * @param {Number} minRows - Min rows in the table
 * @param {Number} maxRows - Max rows in the table
 */
Cypress.Commands.add('testOddItemsListFlow', (selector, has_expanded_rows = false, minRows, maxRows) => {
  // TODO: test all values of items per page
  cy.log('testOddItemsListFlow with RECEIVED rows range: ', minRows, maxRows)
  // let rows = cy.getTotalRows(has_expanded_rows, minRows, maxRows);

  let minTotalRows = has_expanded_rows ? (minRows * 2) : minRows++;
  let maxTotalRows = has_expanded_rows ? (maxRows * 2) : maxRows++;
  cy.log('testOddItemsListFlow with RESULTED rows range: ', minTotalRows, maxTotalRows)
  // get table and amount of lines
  cy.get('table').find('tbody').find('tr').should('have.length', minTotalRows)

  // toggle the list
  cy.getByCy(`${selector}`).find('.pf-c-options-menu').as('pag_option_menu')
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'false').click()
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'true')

  // assert the options available
  cy.get('@pag_option_menu')
    .find('ul', 'per-page-5').should(($ul) => {
      const n = parseFloat($ul.text())
      expect(n).to.be.eq(5)
    }).within(($ul) => {
      cy.get('li').eq(4).find('button').as('maxItems')
      cy.get('li').eq(0).find('button').should('have.attr', 'data-action').and('include', 'per-page-5')
      cy.get('li').eq(1).find('button').should('have.attr', 'data-action').and('include', 'per-page-10')
      cy.get('li').eq(2).find('button').should('have.attr', 'data-action').and('include', 'per-page-15')
      cy.get('li').eq(3).find('button').should('have.attr', 'data-action').and('include', 'per-page-20')
      cy.get('@maxItems').should('have.attr', 'data-action').and('include', 'per-page-25')
      cy.get('@maxItems').click()
    });

  cy.get('table').find('tbody').find('tr').should('have.length', maxTotalRows)

  // toggle back to min items
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'false').click()
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'true')

  cy.get('@pag_option_menu').find('li').eq(0).as('min_items')
  cy.get('@min_items').click()

  cy.get('table').find('tbody').find('tr').should('have.length', minTotalRows)
});

/**
 * 
 * @param {String} selector - The parent data-cy element
 * @param {Boolean} [has_expanded_rows=false] - does it expand the rows?
 * @param {Number} minRows - Min rows in the table
 * @param {Number} maxRows - Max rows in the table
 */
Cypress.Commands.add('testEvenItemsListFlow', (selector, has_expanded_rows = false, minRows, maxRows) => {
  // TODO: test all values of items per page
  cy.log('testEvenItemsListFlow with RECEIVED rows range: ', minRows, maxRows)

  let minTotalRows = has_expanded_rows ? minRows * 2 : ++minRows;
  let maxTotalRows = has_expanded_rows ? maxRows * 2 : ++maxRows;

  cy.log('testEvenItemsListFlow with RESULTED rows range: ', minTotalRows, maxTotalRows)

  // get table and amount of lines
  cy.get('table').find('tbody').as('tb')
  cy.get('@tb').find('tr').should(($tr) => {
    const n = parseFloat($tr)
    expect(n).to.be.eq(minTotalRows)
  });

  // toggle the list
  cy.getByCy(`${selector}`).find('.pf-c-options-menu').as('pag_option_menu')
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'false').click()
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'true')

  // assert the options available
  cy.get('@pag_option_menu')
    .find('ul', 'per-page-6').should(($ul) => {
      const n = parseFloat($ul.text())
      expect(n).to.be.eq(4)
    }).within(($ul) => {
      cy.get('li').eq(3).find('button').as('maxItems')

      cy.get('li').eq(0).find('button').should('have.attr', 'data-action').and('include', 'per-page-4')
      cy.get('li').eq(1).find('button').should('have.attr', 'data-action').and('include', 'per-page-6')
      cy.get('li').eq(2).find('button').should('have.attr', 'data-action').and('include', 'per-page-8')
      cy.get('@maxItems').should('have.attr', 'data-action').and('include', 'per-page-10')
      cy.get('@maxItems').click()
    })

  cy.get('table').find('tbody').find('tr').should('have.length', maxTotalRows)

  // toggle back to min items
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'false').click()
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'true')

  cy.get('@pag_option_menu').find('li').eq(1).as('min_items') // 6 er page is default, not 4
  cy.get('@min_items').click()

  cy.get('table').find('tbody').find('tr').should('have.length', minTotalRows)
});

/**
 * 
 * @param {String} selector - The parent data-cy element
 * @param {Boolean} [is_odd=false] - True if the list is odd (5, 10, 15, 20, 25)
 * @param {Boolean} [has_expanded_rows=false] - does it expand the rows?
 * @param {Number} [defaultPageRows=7]
 */
Cypress.Commands.add('testItemsListFlow', (selector, is_odd = false, has_expanded_rows = false, defaultPageRows = 6, maxPageRows = 10) => {

  cy.log(is_odd, has_expanded_rows, defaultPageRows)

  let minRows = 4;

  if (is_odd) {
    minRows = 5;
    defaultPageRows = 5;
    maxPageRows = 25;
  }

  cy.log('testItemsListFlow with rows range:', defaultPageRows, maxPageRows)

  return is_odd
    ? cy.testOddItemsListFlow(selector, has_expanded_rows, defaultPageRows, maxPageRows)
    : cy.testEvenItemsListFlow(selector, has_expanded_rows, defaultPageRows, maxPageRows);

});
