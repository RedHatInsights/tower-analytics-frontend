// import { reportsUrl, hab } from '../../support/constants';

// // swiching host anomalies off for now because it's not working on stage
// xdescribe('Report: Host Anomalies Bar', () => {
//   beforeEach(() => {
//     cy.loginFlow();
//     cy.intercept('/api/tower-analytics/v1/probe_templates/').as('probeTemplates');
//     cy.visit(reportsUrl + '/' + hab);
//     cy.wait('@probeTemplates');
//   });
//   afterEach(() => {
//     cy.get('#UserMenu').click();
//     cy.get('button').contains('Log out').click({ force: true });
//   });

//   it('Renders bar chart with data', () => {
//     cy.get('.pf-c-chart').should('exist');
//   });

//   it('Can change lookback', () => {
//     cy.getByCy('quick_date_range').click();
//     cy.get('.pf-c-select__menu-item').contains('Past month').click();
//   });

//   it('Can navigate through the pages', () => {
//     cy.testNavArrowsFlow('top_pagination')
//     cy.testNavArrowsFlow('pagination_bottom')

//   });

//   it('Can change the number of items shown on the list', () => {
//     cy.testItemsListFlow('top_pagination')
//     cy.testItemsListFlow('pagination_bottom')
    
//   });
// });
