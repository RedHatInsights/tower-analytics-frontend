/* global cy */
/*
 * Automation Analytics Smoketest.
 *
 * local usage: npm run integration
 * CI usage: npm run integration_headless
 *
 * Specify the baseurl and credentials before starting:
 *  export CYPRESS_CLOUD_BASE_URL="https://cloud.redhat.com"
 *  export CYPRESS_CLOUD_USERNAME="<your-username>"
 *  export CYPRESS_CLOUD_PASSWORD="<your-password>"
 *
 */
const waitDuration = 1000;

beforeEach(() => {
    // open the cloud landing page ...
    cy.viewport(1600, 2000);
    cy.getBaseUrl().then(url => cy.visit(url));

    // sso login ...
    cy.get('[data-ouia-component-id="1"]').click();
    cy.getUsername().then(uname => cy.get('#username').type(`${uname}{enter}`));
    cy.getPassword().then(password => cy.get('#password').type(`${password}{enter}`));
});

describe('automation analytics smoketests', () => {

    it('has all the AA navigation items', () => {
        cy.getBaseUrl().then(url => cy.visit(url));
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        const navbar = cy.get('li[ouiaid="automation-analytics"]');
        const navlis = navbar.find('li');
        navlis.should('have.length', 5);
    });

    it('can open each page without breaking the UI', () => {
        cy.getBaseUrl().then(url => cy.visit(url));
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        cy.get('li[ouiaid="automation-analytics"] > section > ul > li > a').each((href, hid) => {
            cy.log('href', hid, href[0].pathname);

            cy.getBaseUrl().then(url => cy.visit(url + href[0].pathname));
            cy.wait(waitDuration);
            cy.clearFeatureDialogs();

            const screenshotFilename = hid.toString() + '.png';
            cy.screenshot(screenshotFilename);

        });
    });
});
