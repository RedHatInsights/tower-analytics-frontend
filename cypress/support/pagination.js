import './commands'
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
  })

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
Cypress.Commands.add('getItemsToggle', (cyParent, childBtnAction, ...args) => {
  return cy.getByCy(`${cyParent}`, ...args)
  .find('.pf-c-pagination__nav')
  .find(`[data-action="${childBtnAction}"]`)

  });
  
  Cypress.Commands.add('getPaginationBtn', (cyParent, btnAction) => {
    let getPaginationArrows = cy.getPaginationArrows(cyParent, btnAction)

    if (getPaginationArrows) return getPaginationArrows

    throw `Unable to find "${btnAction}" button for data-cy parent: "${cyParent}"`
  })

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
 * This command gets the pagination menu (top/bottom)
 * and tests navigation arrows
 * 
 * Example usage:
 * cy.testItemsList("top_pagination")
 * 
 * @param {String} selector - The parent data-cy element
 */
Cypress.Commands.add('testItemsListFlow', (selector) => {
  // TODO: test all values of items per page

  // get table and amount of lines
  cy.get('tbody').find('tr').should('have.length', 10)
  
  // toggle the list
  cy.getByCy(`${selector}`).find('.pf-c-options-menu').as('pag_option_menu');
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
      })
  cy.get('tbody').find('tr').should('have.length', 50)
  
  // toggle back to 5 items
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
  .should('have.attr', 'aria-expanded', 'false').click()
  cy.findByIdLike('@pag_option_menu', 'aa-pagination-toggle')
  .should('have.attr', 'aria-expanded', 'true')

  cy.get('@pag_option_menu').find('li').eq(0).as('5_items')
  cy.get('@5_items').click()
  cy.get('tbody').find('tr').should('have.length', 10)
  });
  
