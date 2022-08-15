import { jobExplorerUrl } from '../support/constants';

const appid = Cypress.env('appid');

describe('Job Explorer page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(jobExplorerUrl);
  });

  it('Query parameters are stored in the URL to enable refresh', () => {
    // Add more once fixtures are implemented - other filters are content-dependent.
    cy.getByCy('quick_date_range').click();
    cy.contains('Past 2 weeks').click();
    cy.url().should('include', 'quick_date_range=last_2_weeks');
  });

  it('Can navigate through all the pages', () => {

    // Create commands to return the pages dropdown;
    cy.getByCy('top_pagination')
    .find('.pf-c-options-menu').as('top_pag_option_menu');
    
   cy.findByIdLike('@top_pag_option_menu', 'aa-pagination-toggle').click()

    cy.get('@top_pag_option_menu')
    .find('ul', 'per-page-5').should(($ul) => {
      const n = parseFloat($ul.text())
      expect(n).to.be.eq(5)
    }).within(($ul) => {
      cy.get('li').eq(0).find('button').should('have.attr', 'data-action').and('include', 'per-page-5')
      // click and check with the table was updated
      cy.get('li').eq(1).find('button').should('have.attr', 'data-action').and('include', 'per-page-10')
      // click and check with the table was updated
      cy.get('li').eq(2).find('button').should('have.attr', 'data-action').and('include', 'per-page-15')
      // click and check with the table was updated
      cy.get('li').eq(3).find('button').should('have.attr', 'data-action').and('include', 'per-page-20')
      // click and check with the table was updated
      cy.get('li').eq(4).find('button').should('have.attr', 'data-action').and('include', 'per-page-25')
      // click and check with the table was updated
    })

    // // Create commands to return the amount of pages available;
    // // get the ammount of pages => how many times the interaction should happen
    
    // // Create commands to iterate and compare the amount of pages and how many times the pagination arrow can be clicked;
    // // if page 1, check if previous button is disabled

    // // run next click until the ammount of pages
    // cy.getPaginationBtn('top_pagination', 'next').as('nextBtn')
    // cy.get('@nextBtn').click().should('be.visible')

    // // check the next button is disabled at the final page

    // // run previous click until the ammount of pages
    // cy.getPaginationBtn('top_pagination', 'previous').as('previousBtn')
    // cy.get('@previousBtn').click().should('be.visible')
    // // check again if previous button is disabled on page 1

  });

  // it('Can change the number of items shown on the list', () => {

  // });
});
