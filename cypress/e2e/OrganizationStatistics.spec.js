/* global cy, Cypress */
import { orgsUrl } from '../support/constants';

const appid = Cypress.env('appid');

const getUniqueRandomNumbers = (upperBound, total, excluded = []) => {
  let randomIDS = [];
  while (randomIDS.length < total) {
    const thisID = Math.floor(Math.random() * upperBound);
    if (!randomIDS.includes(thisID) && !excluded.includes(thisID)) {
      randomIDS.push(thisID);
    }
  }

  return randomIDS;
};

function fuzzOrgStatsPage() {
  // select 3 random bars to view events for ...
  let selectedIDs = getUniqueRandomNumbers(10, 3);
  cy.log('SELECTEDIDS', selectedIDs);
  selectedIDs.forEach((xid) => {
    // click on the rectangle ...
    cy.get(appid).find('rect').eq(xid).click({ force: true });

    // go back to the stats page ...
    cy.visit(orgsUrl);
  });

  // toggle each org off/on
  cy.get(appid)
    .find('span[class="pf-c-switch__toggle"]')
    .each((_toggle, ix) => {
      cy.get(appid).find('span[class="pf-c-switch__toggle"]').eq(ix).click();
      cy.get(appid).find('span[class="pf-c-switch__toggle"]').eq(ix).click();
    });

  // hover over each donut1 pie slice ...
  cy.get(appid)
    .find('#d3-donut-1-chart-root > svg > g > path')
    .each((_slice, ix) => {
      cy.get(appid)
        .find('#d3-donut-1-chart-root > svg > g > path')
        .eq(ix)
        .trigger('mouseover', { force: true });
    });

  // hover over each donut2 pie slice ...
  cy.get(appid)
    .find('#d3-donut-2-chart-root > svg > g > path')
    .each((_slice, ix) => {
      cy.get(appid)
        .find('#d3-donut-2-chart-root > svg > g > path')
        .eq(ix)
        .trigger('mouseover', { force: true });
    });
}

describe('Organization statistics page smoketests', () => {
  beforeEach(() => {
    cy.visit(orgsUrl);
  });

  it('Query parameters are stored in the URL to enable refresh', () => {
    // Add more once fixtures are implemented - other filters are content-dependent.
    cy.get('[data-cy="quick_date_range"]').click();
    cy.contains('Past 2 weeks').click();
    cy.url().should('include', 'quick_date_range=last_2_weeks');
  });

  it('can interact with the org stats page without breaking the UI', () => {
    fuzzOrgStatsPage();
  });
});
