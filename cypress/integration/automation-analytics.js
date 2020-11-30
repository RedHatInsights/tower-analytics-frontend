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


const baseUrl = 'https://prod.foo.redhat.com:8443';
const username = "bob";
const password = "redhat1234";
const appid = '#automation-analytics-application';


function getBaseUrl() {
    let newUrl = Cypress.env('CLOUD_BASE_URL')
    if ( newUrl === null  || newUrl == undefined) {
        newUrl = baseUrl;
    }
    cy.log("NEWURL: " + newUrl);
    return newUrl;
}

function getUsername() {
    let newUsername = Cypress.env('CLOUD_USERNAME')
    if ( newUsername === null  || newUsername === undefined ) {
        newUsername = username;
    }
    return newUsername;
}

function getPassword() {
    let newPassword = Cypress.env('CLOUD_PASSWORD')
    if ( newPassword == null || newPassword === undefined ) {
        newPassword = password;
    }
    return newPassword;
}

function hasInnerHrefs() {
    let hasHrefs = true;
    cy.get('#automation-analytics-application')
        .find('a', {timeout: 100})
        .catch((err) => {
            hasHrefs = false;
        });

    return hasHrefs;
}

function hasInnerButtons() {
    return false;
}

async function fuzzClustersPage() {

    await cy.get(appid)
        .find('a')
        .first()
        .click({waitForAnimations: true})
        .wait(1000)
        .then(() => {
            cy.screenshot('top-template-modal-first.png', {capture: 'fullPage'});
            cy.get('button[aria-label="Close"]')
                .click()
                .wait(1000);
        })

    await cy.get(appid)
        .find('a')
        .last()
        .click({waitForAnimations: true})
        .wait(1000)
        .then(() => {
            cy.screenshot('top-template-modal-last.png', {capture: 'fullPage'});
            cy.get('button[aria-label="Close"]')
                .click()
                .wait(1000);
        })

}

beforeEach(() => {
    // open the cloud landing page ...
    cy.viewport(1600, 2000);
    //let url = getBaseUrl();
    cy.visit(getBaseUrl());

    // sso login ...
    cy.get('[data-ouia-component-id="1"]').click();
    cy.wait(1000);
    cy.get('#username').type(getUsername());
    cy.get('#password').type(getPassword());
    cy.get('#kc-login').click();
    cy.wait(1000);
})

describe('automation analytics smoketests', () => {

    /*
    xit('can open the crhc landing page', () => {
        cy.visit(baseUrl);
        cy.wait(1000);
    })

    xit('can find and click on the automation-analytics link from the landing page', () => {
        cy.visit(baseUrl);
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(1000);
    })

    xit('has all the AA navigation items', () => {
        cy.visit(baseUrl);
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(1000);

        // pf-c-nav__list
        // li ouiaid=automation-analytics
        const navbar = cy.get('li[ouiaid="automation-analytics"]');
        const navlis = navbar.find('li');
        console.log(navlis);
        navlis.should('have.length', 5)
    })
    */

    it('can open all the AA navigation items', () => {
        cy.visit(getBaseUrl());
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(1000);

        let navurls = [];

        cy.get('li[ouiaid="automation-analytics"] > section > ul > li > a').first().each((href, hid) => {
            console.log('href', hid, href[0].pathname);
            navurls.push(href[0].pathname);
            console.log(navurls);

            cy.visit(getBaseUrl() + href[0].pathname);
            cy.wait(1000);
            const screenshotFilename = hid.toString() + '.png';
            cy.screenshot(screenshotFilename);

            /*
            if ( hasInnerHrefs() ) {
                console.log('HREFS!');
            }
            */

            if ( href[0].pathname === '/ansible/automation-analytics/clusters' ) { 
                fuzzClustersPage();
            }

            //throw 'first page visited ...';
        });

    })

})
