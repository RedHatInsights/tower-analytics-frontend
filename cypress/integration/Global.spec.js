/* global cy, before */
import {
    calculatorUrl,
    jobExplorerUrl,
    dashboardUrl,
    notificationsUrl,
    orgsUrl
} from './constants';

describe('automation analytics smoketests', () => {
    before(() => {
        // open the cloud landing page ...
        cy.visit('/');

        // sso login ...
        cy.get('[data-ouia-component-id="1"]').click();
        cy.getUsername().then(uname => cy.get('#username').type(`${uname}{enter}`));
        cy.getPassword().then(password => cy.get('#password').type(`${password}{enter}`));
    });

    it('has all the AA navigation items', () => {
        cy.visit('/ansible/automation-analytics');
        const navbar = cy.get('li[ouiaid="automation-analytics"]');
        const navlis = navbar.find('li');
        navlis.should('have.length', 5);
    });

    it('can open each page without breaking the UI', () => {
        cy.visit('/ansible/automation-analytics');
        cy.visit(calculatorUrl);
        cy.visit(jobExplorerUrl);
        cy.visit(dashboardUrl);
        cy.visit(notificationsUrl);
        cy.visit(orgsUrl);
    });
});
