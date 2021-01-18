/* global cy, Cypress */
const appid = Cypress.env('appid');
const waitDuration = 1000;

async function fuzzCalculatorPage() {

    // try all time groupings ...
    let timeGroups = [ 'Past month', 'Past quarter', 'Past year to date', 'Past year' ];
    timeGroups.forEach((tg) => {
        cy.get(appid).find('select[name="roiTimeFrame"]').eq(0).select(tg).wait(waitDuration);
        cy.wait(waitDuration);
    });

    // hover over the first 3 bars to check for tooltips ...
    for (let i = 0; i < 3; i++) {
        cy.get(appid).find('g > rect').eq(i).trigger('mouseover', { force: true });
        cy.wait(waitDuration);
    }

    // increment the manual and automated costs ...
    cy.get(appid).find('#manual-cost').type('100');
    cy.get(appid).find('#automation-cost').type('0');
    cy.wait(waitDuration);

    // template toggles have no unique IDs or elements yet that allow easy automated testing ...

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

describe('Automation Caluclator page smoketests', () => {
    it('can interact with the automation calculator page without breaking the UI', () => {
        cy.getBaseUrl().then(url => cy.visit(url));
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        cy.get('li[ouiaid="automation-analytics"] > section > ul > li > a').eq(4).each((href, hid) => {
            cy.log('href', hid, href[0].pathname);

            cy.getBaseUrl().then(url => cy.visit(url + href[0].pathname));
            cy.wait(waitDuration);
            cy.clearFeatureDialogs();

            const screenshotFilename = 'notifications.png';
            cy.screenshot(screenshotFilename);

            fuzzCalculatorPage();
        });

    });
});
