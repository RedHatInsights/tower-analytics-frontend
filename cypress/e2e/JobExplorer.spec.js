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

  it('Can navigate through the pages', () => {
    // TODO: navigate through ALL pages
    
    cy.getPaginationBtn('top_pagination', 'next').as('nextBtn')
    cy.getPaginationBtn('top_pagination', 'previous').as('previousBtn')
    
    cy.get('@previousBtn').should('be.disabled')
    cy.get('@nextBtn').should('not.be.disabled').click()
    
    cy.getPaginationBtn('top_pagination', 'next').as('nextBtn')
    cy.getPaginationBtn('top_pagination', 'previous').as('previousBtn')

    cy.get('@nextBtn').should('not.be.disabled')
    cy.get('@previousBtn').should('not.be.disabled').click()
  });

  it('Can change the number of items shown on the list', () => {
    // TODO: test all values of items per page

    // toggle the list
    cy.getByCy('top_pagination').find('.pf-c-options-menu').as('top_pag_option_menu');
    cy.findByIdLike('@top_pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'false').click()
    
    cy.findByIdLike('@top_pag_option_menu', 'aa-pagination-toggle')
    .should('have.attr', 'aria-expanded', 'true')
    
    // get table and amount of lines
    cy.get('tbody').find('tr').should('have.length', 10)
    
    // assert the options available
    cy.get('@top_pag_option_menu')
    .find('ul', 'per-page-5').should(($ul) => {
        const n = parseFloat($ul.text())
        expect(n).to.be.eq(5)
      }).within(($ul) => {
          cy.get('li').eq(0).find('button').should('have.attr', 'data-action').and('include', 'per-page-5')
          cy.get('li').eq(1).find('button').should('have.attr', 'data-action').and('include', 'per-page-10')
          cy.get('li').eq(2).find('button').should('have.attr', 'data-action').and('include', 'per-page-15')
          cy.get('li').eq(3).find('button').should('have.attr', 'data-action').and('include', 'per-page-20')
          cy.get('li').eq(4).find('button').as('maxItems')
          cy.get('@maxItems').should('have.attr', 'data-action')
          .and('include', 'per-page-25')
          cy.get('@maxItems').click()
        })
    cy.get('tbody').find('tr').should('have.length', 50)
      });
    });
    