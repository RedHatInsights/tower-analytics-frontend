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
    appid,
    clearFeatureDialogs,
    getBaseUrl,
    getUsername,
    getPassword,
    hasInnerHrefs,
    hasInnerButtons,
    waitDuration
} from './common';

async function fuzzClustersPage() {

    // open each top template modal and save a screenshot ...
    for ( let i=0; i <= 4; i++ ) {
        cy.get(appid).find("a").eq(i).click({waitForAnimations: true}).then(() => {
            cy.wait(waitDuration);
            cy.screenshot('top-template-modal-' + i + '.png', {capture: 'fullPage'});
            cy.get('button[aria-label="Close"]').click({waitForAnimations: true}).wait(waitDuration);
            cy.wait(waitDuration);
        });
    }

    // navigate to the job explorer page for each bar in the chart ...
    for ( let i=0; i <= 4; i++ ) {

        // pick a random bar to click on ...
        let barid = Math.floor(Math.random() * 10);
        cy.log(barid);

        // click it and wait for the jobexplorer page to load ...
        cy.get(appid).find("rect").eq(barid).click({waitForAnimations: true});
        cy.wait(waitDuration * 2);
        cy.screenshot('clusters-bar-' + barid + '-jobexplorer-details.png', {capture: 'fullPage'});

        // go back to the clusters page ...
        const aalink = cy.get('a[href="' + getBaseUrl() + '/ansible/automation-analytics/clusters"]').first();
        aalink.click();
        cy.wait(waitDuration);
    }

}


async function fuzzNotificationsPage() {

    // select 3 random clusters to view notitications for ...
    let randomIDS = [];
    for (let i=0; i<4; i++) {
        let thisID = Math.floor(Math.random() * 10);
        randomIDS.push(thisID);
    }
    cy.get(appid).find('select[name="selectedCluster"]').eq(0).then(($select) => {
        $select.find('option').each((ix, opt) => {
            if (ix !== 0 && randomIDS.includes(ix)) {
                cy.log(ix, opt);
                console.log(ix, opt, typeof opt, opt.innerHTML);
                cy.wait(waitDuration);
                cy.get(appid).find('select[name="selectedCluster"]').eq(0).select(opt.innerHTML).wait(waitDuration);
            }
        })
    })

    // go back to all clusters ...
    cy.get(appid).find('select[name="selectedCluster"]').eq(0).select("All Clusters").wait(waitDuration);

    // try all message type filters ...
    let levels = ["View Critical", "View Warning", "View Notice", "View All"];
    levels.forEach((level) => {
        cy.get(appid).find('select[name="selectedNotification"]').eq(0).select(level).wait(waitDuration);
        cy.wait(waitDuration);
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

    xit('has all the AA navigation items', () => {
        cy.visit(getBaseUrl());
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        const navbar = cy.get('li[ouiaid="automation-analytics"]');
        const navlis = navbar.find('li');
        console.log(navlis);
        navlis.should('have.length', 5)
    })

    xit('can open each page without breaking the UI', () => {
        cy.visit(getBaseUrl());
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

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

    xit('can interact with the clusters page without breaking the UI', () => {
        cy.visit(getBaseUrl());
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

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

    it('can interact with the notifications page without breaking the UI', () => {
        cy.visit(getBaseUrl());
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        cy.get('li[ouiaid="automation-analytics"] > section > ul > li > a').eq(3).each((href, hid) => {
            cy.log('href', hid, href[0].pathname);
            navurls.push(href[0].pathname);
            console.log(navurls);

            cy.visit(getBaseUrl() + href[0].pathname);
            cy.wait(waitDuration);
            clearFeatureDialogs();

            const screenshotFilename = 'notifications.png';
            cy.screenshot(screenshotFilename);

            fuzzNotificationsPage();

        });

    })

})
