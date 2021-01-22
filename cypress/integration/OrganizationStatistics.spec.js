/* global cy, Cypress, before */
import {
    orgsUrl
} from './constants';

const appid = Cypress.env('appid');
const waitDuration = 1000;

const getUniqueRandomNumbers = (upperBound, total, excluded) => {
    let randomIDS = [];
    while (randomIDS.length < total) {
        let thisID = Math.floor(Math.random() * upperBound);
        if (!randomIDS.includes(thisID) && !excluded.includes(thisID)) {
            randomIDS.push(thisID);
        }
    }

    return randomIDS;
};

async function fuzzOrgStatsPage() {

    // select 3 random bars to view events for ...
    let selectedIDs = getUniqueRandomNumbers(10, 3);
    cy.log('SELECTEDIDS', selectedIDs);
    selectedIDs.forEach((xid) => {
        cy.log(xid);

        // click on the rectangle ...
        cy.get(appid).find('rect').eq(xid).click({ force: true });
        cy.wait(waitDuration);

        // go back to the stats page ...
        cy.getBaseUrl().then(url => {
            const statslink = cy.get('a[href="' + url + '/ansible/automation-analytics/organization-statistics"]');
            statslink.click();
            cy.wait(waitDuration);
        });
    });

    // toggle each org off/on
    cy.get(appid).find('span[class="pf-c-switch__toggle"]').each((toggle, ix) => {
        //toggle.click().wait(waitDuration);
        //toggle.click().wait(waitDuration);
        cy.get(appid).find('span[class="pf-c-switch__toggle"]').eq(ix).click();
        cy.wait(waitDuration);
        cy.get(appid).find('span[class="pf-c-switch__toggle"]').eq(ix).click();
        cy.wait(waitDuration);

    });

    // flip through each org grouping ...
    let orgGroups = [ 'All Orgs', 'Bottom 5 Orgs', 'Top 5 Orgs' ];
    orgGroups.forEach((group) => {
        cy.get(appid).find('select[name="sortOrder"]').eq(0).select(group).wait(waitDuration);
        cy.wait(waitDuration);
    });

    // flip through each time grouping ...
    let timeGroups = [ 'Past Week', 'Past 2 Weeks', 'Past Month' ];
    timeGroups.forEach((group) => {
        cy.get(appid).find('select[name="timeframe"]').eq(0).select(group).wait(waitDuration);
        cy.wait(waitDuration);
    });

    // hover over each donut1 pie slice ...
    cy.get(appid).find('#d3-donut-1-chart-root > svg > g > path').each((slice, ix) => {
        cy.get(appid).find('#d3-donut-1-chart-root > svg > g > path').eq(ix).trigger('mouseover', { force: true });
        cy.wait(waitDuration);
    });

    // hover over each donut2 pie slice ...
    cy.get(appid).find('#d3-donut-2-chart-root > svg > g > path').each((slice, ix) => {
        cy.get(appid).find('#d3-donut-2-chart-root > svg > g > path').eq(ix).trigger('mouseover', { force: true });
        cy.wait(waitDuration);
    });

}

describe('Organization statistics page smoketests', () => {
    before(() => {
        // open the cloud landing page ...
        cy.visit('/');

        // sso login ...
        cy.get('[data-ouia-component-id="1"]').click();
        cy.getUsername().then(uname => cy.get('#username').type(`${uname}{enter}`));
        cy.getPassword().then(password => cy.get('#password').type(`${password}{enter}`));
        cy.visit(orgsUrl);
    });

    it('can interact with the org stats page without breaking the UI', () => {
        fuzzOrgStatsPage();
    });
});
