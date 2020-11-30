/*
 * Automation Analytics Smoketest.
 *
 * local usage: npm run integration
 * CI usage: npm run integration_headless
 *
 * Specify the baseurl and credentials before starting:
 *  export export CYPRESS_CLOUD_BASE_URL="https://cloud.redhat.com"
 *  export CYPRESS_CLOUD_USERNAME="<your-username>"
 *  export CYPRESS_CLOUD_PASSWORD="<your-password>"
 *
 */


import {
    clearFeatureDialogs,
    getBaseUrl,
    getUsername,
    getPassword,
    hasInnerHrefs,
    hasInnerButtons,
    waitDuration
} from './common';


async function fuzzClustersPage() {

    await cy.get(appid)
        .find('a')
        .first()
        .click({waitForAnimations: true})
        .wait(waitDuration)
        .then(() => {
            cy.screenshot('top-template-modal-first.png', {capture: 'fullPage'});
            cy.get('button[aria-label="Close"]')
                .click()
                .wait(waitDuration);
        })

    await cy.get(appid)
        .find('a')
        .last()
        .click({waitForAnimations: true})
        .wait(waitDuration)
        .then(() => {
            cy.screenshot('top-template-modal-last.png', {capture: 'fullPage'});
            cy.get('button[aria-label="Close"]')
                .click()
                .wait(waitDuration);
        })

}

beforeEach(() => {
    // open the cloud landing page ...
    cy.viewport(1600, 2000);
    cy.visit(getBaseUrl());

    // sso login ...
    cy.get('[data-ouia-component-id="1"]').click();
    cy.wait(waitDuration);
    cy.get('#username').type(getUsername());
    cy.get('#password').type(getPassword());
    cy.get('#kc-login').click();
    cy.wait(waitDuration);
})

describe('automation analytics smoketests', () => {

    it('has all the AA navigation items', () => {
        cy.visit(getBaseUrl());
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        const navbar = cy.get('li[ouiaid="automation-analytics"]');
        const navlis = navbar.find('li');
        console.log(navlis);
        navlis.should('have.length', 5)
    })

    it('can open each page without breaking the UI', () => {
        cy.visit(getBaseUrl());
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        let navurls = [];

        cy.get('li[ouiaid="automation-analytics"] > section > ul > li > a').each((href, hid) => {
            cy.log('href', hid, href[0].pathname);
            navurls.push(href[0].pathname);
            console.log(navurls);

            cy.visit(getBaseUrl() + href[0].pathname);
            cy.wait(waitDuration);
            clearFeatureDialogs();

            const screenshotFilename = hid.toString() + '.png';
            cy.screenshot(screenshotFilename);

        });

    })

    it('can interact with the clusters page without breaking the UI', () => {
        cy.visit(getBaseUrl());
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        let navurls = [];

        cy.get('li[ouiaid="automation-analytics"] > section > ul > li > a').first().each((href, hid) => {
            cy.log('href', hid, href[0].pathname);
            navurls.push(href[0].pathname);
            console.log(navurls);

            cy.visit(getBaseUrl() + href[0].pathname);
            cy.wait(waitDuration);
            clearFeatureDialogs();

            const screenshotFilename = hid.toString() + '.png';
            cy.screenshot(screenshotFilename);

            fuzzClustersPage();

        });

    })

})
