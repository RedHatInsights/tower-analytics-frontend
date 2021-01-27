/* global cy, Cypress, before */
import {
    dashboardUrl
} from './constants';

const appid = Cypress.env('appid');

async function fuzzClustersPage() {

    // open each top template modal and save a screenshot ...
    for (let i = 0; i <= 4; i++) {
        cy.get(appid).find('a').eq(i).click({ waitForAnimations: true }).then(() => {
            cy.screenshot('top-template-modal-' + i + '.png', { capture: 'fullPage' });
            cy.get('button[aria-label="Close"]').click({ waitForAnimations: true });
        });
    }

    // navigate to the job explorer page for each bar in the chart ...
    for (let i = 0; i <= 4; i++) {

        // pick a random bar to click on ...
        let barid = Math.floor(Math.random() * 10);
        cy.log(barid);

        // click it and wait for the jobexplorer page to load ...
        cy.get(appid).find('rect').eq(barid).click({ waitForAnimations: true });
        cy.screenshot('clusters-bar-' + barid + '-jobexplorer-details.png', { capture: 'fullPage' });

        // go back to the clusters page ...
        cy.visit(dashboardUrl);
    }

}

describe('Dashboard page smoketests', () => {
    before(() => {
        // open the cloud landing page ...
        cy.visit('/');

        // sso login ...
        cy.get('[data-ouia-component-id="1"]').click();
        cy.getUsername().then(uname => cy.get('#username').type(`${uname}{enter}`));
        cy.getPassword().then(password => cy.get('#password').type(`${password}{enter}`));
        cy.visit(dashboardUrl);
    });

    it('can interact with the clusters page without breaking the UI', () => {
        fuzzClustersPage();
    });
});
