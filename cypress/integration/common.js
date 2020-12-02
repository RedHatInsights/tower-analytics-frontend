const baseUrl = 'https://prod.foo.redhat.com:8443';
const username = "bob";
const password = "redhat1234";
export const appid = '#automation-analytics-application';
export const waitDuration = 1000;


export function getBaseUrl() {
    let newUrl = Cypress.env('CLOUD_BASE_URL')
    if ( newUrl === null  || newUrl == undefined) {
        newUrl = baseUrl;
    }
    cy.log("NEWURL: " + newUrl);
    return newUrl;
}

export function getUsername() {
    let newUsername = Cypress.env('CLOUD_USERNAME')
    if ( newUsername === null  || newUsername === undefined ) {
        newUsername = username;
    }
    return newUsername;
}

export function getPassword() {
    let newPassword = Cypress.env('CLOUD_PASSWORD')
    if ( newPassword == null || newPassword === undefined ) {
        newPassword = password;
    }
    return newPassword;
}

export function hasInnerHrefs() {
    let hasHrefs = true;
    cy.get('#automation-analytics-application')
        .find('a', {timeout: 100})
        .catch((err) => {
            hasHrefs = false;
        });

    return hasHrefs;
}

export function hasInnerButtons() {
    return false;
}

/* 
 * If the page has a pendo alert about
 * new feature tours, click the ignore
 * button to close the alert.
 */
export function clearFeatureDialogs() {
    cy.get('button').each((button) => {
        let buttonText = button.text();
        if ( buttonText === "Show me later" ) {
            button.click();
            cy.wait(waitDuration);
        }
    });
}

export function getUniqueRandomNumbers(upperBound, total, excluded) {
    let randomIDS = [];
    while (randomIDS.length < total) {
        let thisID = Math.floor(Math.random() * upperBound);
        if (!randomIDS.includes(thisID) && !excluded.includes(thisID)) {
            randomIDS.push(thisID);
        }
    }
    return randomIDS
}