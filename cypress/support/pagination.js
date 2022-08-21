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

