/* global cy, before */
import {
    appid,
    calculatorUrl,
    jobExplorerUrl
} from './constants';

beforeEach(() => {
    cy.viewport(1600, 2000);
});

describe('Automation Caluclator page smoketests', () => {
    before(() => {
        // open the cloud landing page ...
        cy.visit('/');

        // sso login ...
        cy.get('[data-ouia-component-id="1"]').click();
        cy.getUsername().then(uname => cy.get('#username').type(`${uname}{enter}`));
        cy.getPassword().then(password => cy.get('#password').type(`${password}{enter}`));
        cy.visit(calculatorUrl);
    });

    it('can change manual and automated cost', () => {
        cy.get('#manual-cost').type('1');
        cy.get('#automation-cost').type('1');

        cy.get('#manual-cost').should('have.value', '501');
        cy.get('#automation-cost').should('have.value', '201');

        // Maybe check the total cost after the chagne --> fixtures needed
    });

    it('can hover over the first 3 bars to show tooltip', () => {
        for (let i = 0; i < 3; i++) {
            cy.get(appid).find('g > rect').eq(i).trigger('mouseover', { force: true });
            cy.get('#svg-chart-Tooltip-base-d3-roi-chart-root').should('have.css', 'opacity', '1');
        }
    });

    it('can click on the template name', () => {
        cy.get('.top-templates').find('a').eq(0).click();
        cy.location().should((location) => {
            expect(location.pathname).to.include(jobExplorerUrl);
        });
    });
});
