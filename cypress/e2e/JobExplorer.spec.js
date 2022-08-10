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

    // get the ammount of pages => how many times the interaction should happen
    
    // if page 1, check if previous button is disabled

    // run next click until the ammount of pages
    cy.getPaginationBtn('top_pagination', 'next').as('nextBtn')
    cy.get('@nextBtn').click().should('be.visible')

    // check the next button is disabled at the final page

    // run previous click until the ammount of pages
    cy.getPaginationBtn('top_pagination', 'previous').as('previousBtn')
    cy.get('@previousBtn').click().should('be.visible')
    // check again if previous button is disabled on page 1

  });

  // it('Can change the number of items shown on the list', () => {

  // });
});
