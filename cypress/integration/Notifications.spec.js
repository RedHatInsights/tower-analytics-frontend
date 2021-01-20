/* global cy, Cypress */
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

async function fuzzNotificationsPage() {

    // select 3 random clusters to view notitications for ...
    let selectedIDs = getUniqueRandomNumbers(10, 3, [ 0 ]);
    cy.log('SELECTEDIDS', selectedIDs);
    selectedIDs.forEach((xid) => {
        cy.get(appid).find('select[name="selectedCluster"]').eq(0).then(($select) => {
            $select.find('option').eq(xid).each((ix, opt) => {
                cy.get(appid).find('select[name="selectedCluster"]').eq(0).select(opt.innerHTML).wait(waitDuration);
            });
        });
    });

    // go back to all clusters ...
    cy.get(appid).find('select[name="selectedCluster"]').eq(0).select('All Clusters').wait(waitDuration);

    // try all message type filters ...
    let levels = [ 'View Critical', 'View Warning', 'View Notice', 'View All' ];
    levels.forEach((level) => {
        cy.get(appid).find('select[name="selectedNotification"]').eq(0).select(level).wait(waitDuration);
        cy.wait(waitDuration);
    });

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

describe('Notification page smoketests', () => {
    it('can interact with the notifications page without breaking the UI', () => {
        cy.getBaseUrl().then(url => cy.visit(url));
        const aalink = cy.get('a[href="/ansible/automation-analytics"]').first();
        aalink.click();
        cy.wait(waitDuration);

        cy.get('li[ouiaid="automation-analytics"] > section > ul > li > a').eq(3).each((href, hid) => {
            cy.log('href', hid, href[0].pathname);

            cy.getBaseUrl().then(url => cy.visit(url + href[0].pathname));
            cy.wait(waitDuration);
            cy.clearFeatureDialogs();

            fuzzNotificationsPage();
        });

    });
});
