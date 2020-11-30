const baseUrl = 'https://prod.foo.redhat.com:8443';
const username = "bob";
const password = "redhat1234";
const appid = '#automation-analytics-application';


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

