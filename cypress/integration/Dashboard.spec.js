/* global cy, Cypress */
const appid = Cypress.env('appid');
const waitDuration = 1000;

async function fuzzClustersPage() {

    // open each top template modal and save a screenshot ...
    for (let i = 0; i <= 4; i++) {
        cy.get(appid).find('a').eq(i).click({ waitForAnimations: true }).then(() => {
            cy.wait(waitDuration);
            cy.screenshot('top-template-modal-' + i + '.png', { capture: 'fullPage' });
            cy.get('button[aria-label="Close"]').click({ waitForAnimations: true }).wait(waitDuration);
            cy.wait(waitDuration);
        });
    }

    // navigate to the job explorer page for each bar in the chart ...
    for (let i = 0; i <= 4; i++) {

        // pick a random bar to click on ...
        let barid = Math.floor(Math.random() * 10);
        cy.log(barid);

        // click it and wait for the jobexplorer page to load ...
        cy.get(appid).find('rect').eq(barid).click({ waitForAnimations: true });
        cy.wait(waitDuration * 2);
        cy.screenshot('clusters-bar-' + barid + '-jobexplorer-details.png', { capture: 'fullPage' });

        // go back to the clusters page ...
        cy.getBaseUrl().then(url => {
            cy.get('a[href="' + url + '/ansible/automation-analytics/clusters"]').first().click();
            cy.wait(waitDuration);
        });
    }

}

beforeEach(() => {
    // open the cloud landing page ...
    cy.viewport(1600, 2000);
    cy.getBaseUrl().then(url => cy.visit(url));

    // sso login ...
    cy.get('[data-ouia-component-id="1"]').click();
    cy.getUsername().then(uname => cy.get('#username').type(`${uname}{enter}`));
    cy.getPassword().then(password => cy.get('#password').type(`${password}{enter}`));
});

describe('Dashboard page smoketests', () => {
    it('can interact with the clusters page without breaking the UI', () => {
        cy.getBaseUrl().then(url => cy.visit(url));
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        cy.get('li[ouiaid="automation-analytics"] > section > ul > li > a').first().each((href, hid) => {
            cy.log('href', hid, href[0].pathname);

            cy.getBaseUrl().then(url => cy.visit(url + href[0].pathname));
            cy.wait(waitDuration);
            cy.clearFeatureDialogs();

            fuzzClustersPage();
        });
    });
});
