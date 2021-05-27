/* global cy, Cypress */
import { dashboardUrl } from '../support/constants';

const appid = Cypress.env('appid');

const toolBarCatSelector = 'div[id="filterable-toolbar-with-chip-groups"] > .pf-c-toolbar__content > .pf-c-toolbar__content-section > div[class="pf-c-toolbar__group pf-m-filter-group"]';
const toolBarChipGroup = '#filterable-toolbar-with-chip-groups > div:nth-child(2)'

async function fuzzClustersPage() {
  // open each top template modal and save a screenshot ...
  for (let i = 0; i <= 4; i++) {
    cy.get(appid)
      .find('a')
      .eq(i)
      .click({ waitForAnimations: true })
      .then(() => {
        cy.screenshot('top-template-modal-' + i + '.png', {
          capture: 'fullPage',
        });
        cy.get('button[aria-label="Close"]').click({ waitForAnimations: true });
      });
  }
}

describe('Dashboard page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(dashboardUrl);
  });

  it('can interact with the clusters page without breaking the UI', () => {
    fuzzClustersPage();
  });

  xit('Page contains chart, and 3 card elements', () => {
    cy.get('#d3-bar-chart-root').should((chartElem) => {
      expect(chartElem).to.have.length(1);
    });

    it.only('can interact with the clusters page without breaking the UI', () => {
        fuzzClustersPage();
    });

    it.skip('Page contains chart, and 3 card elements', () => {
        cy.get('#d3-bar-chart-root').should((chartElem) => {
            expect(chartElem).to.have.length(1);
        });
        cy.get('div[class="dataCard"] > ul').should((cards) => {
            expect(cards).to.have.length(3);
        });
    });

    it.skip('There is a filter toolbar on the Clusters page', () => {
        cy.get('div[id="filterable-toolbar-with-chip-groups"]').should(toolbar => {
            expect(toolbar).to.have.length(1);
        });
    });
});

describe('Dashboard page filter tests', () => {
    beforeEach(() => {
        cy.loginFlow();
        cy.visit(dashboardUrl);
    });

    it('Can filter by organization', () => {
        cy.get(toolBarCatSelector).first().contains('Filter by').click();
        cy.get('button[class="pf-c-select__menu-item"]').contains('Organization').click();
        cy.get('button[id^="pf-select-toggle-id-"]').contains('Filter by organization').parent().parent().click();
        cy.get('div[class="pf-c-select__menu"]').find('span').contains('No organization').parent().siblings('input').click();
        // Verify the organization filter is added in the Chip Group
        cy.get(toolBarChipGroup).find('span').contains('Organization').siblings().find('span').contains('No organization');
        const screenshotFilename = 'clusters_filter_by_org.png';
        cy.screenshot(screenshotFilename);
    });

    it('Can filter by a preset date range', () => {
        const todayminusone = moment(new Date().toISOString()).subtract(1, 'day').format('M/DD');
        const twoMonthssAgo = moment(new Date().toISOString()).subtract(61, 'day').format('M/DD');
        const moreThanTwoMonthssAgo = moment(new Date().toISOString()).subtract(63, 'day').format('M/DD');

        cy.get('div[data-cy="quick_date_range"]').click();
        cy.get('.pf-c-select__menu-item').contains('Past 62 days').click();
        // Verify the date range filter is reflected in the barchart
        cy.get('#d3-bar-chart-root > svg').find('.x-axis').find('g').contains(todayminusone);
        cy.get('#d3-bar-chart-root > svg').find('.x-axis').find('g').contains(twoMonthssAgo);
        cy.get('#d3-bar-chart-root > svg').find('.x-axis').find('g').should('not.contain',moreThanTwoMonthssAgo);
        const screenshotFilename = 'clusters_filter_by_quickDateRange.png';
        cy.screenshot(screenshotFilename);
    });

    it('Can filter by a custom date range', () => {
        const today = moment(new Date().toISOString()).format('YYYY-MM-DD');
        const oneWeekAgo = moment(new Date().toISOString()).subtract(1, 'week').format('YYYY-MM-DD');
        const chartDateToday = moment(new Date().toISOString()).format('M/DD');
        const chartDateOneWeekAgo = moment(new Date().toISOString()).subtract(1, 'week').format('M/DD');
        const chartDateMoreThanOneWeekAgo = moment(new Date().toISOString()).subtract(8, 'day').format('M/DD');

        cy.get('div[data-cy="quick_date_range"]').click();
        cy.get('.pf-c-select__menu-item').contains('Custom').click();
        cy.get('#startDate').then(input => setDate(input[0], oneWeekAgo));
        cy.get('#endDate').then(input => setDate(input[0], today));
        // Verify the cusom date range filter is reflected in the barchart
        cy.get('#d3-bar-chart-root > svg').find('.x-axis').find('g').contains(chartDateToday);
        cy.get('#d3-bar-chart-root > svg').find('.x-axis').find('g').contains(chartDateOneWeekAgo);
        cy.get('#d3-bar-chart-root > svg').find('.x-axis').find('g').should('not.contain',chartDateMoreThanOneWeekAgo);
        const screenshotFilename = 'clusters_filter_by_customDateRange';
        cy.screenshot(screenshotFilename);
    });

    it('Can filter by cluster', () => {
        cy.get(toolBarCatSelector).first().click();
        cy.get('button[class="pf-c-select__menu-item"]').contains('Cluster').click();
        cy.get('button[id^="pf-select-toggle-id-"]').contains('Filter by cluster').parent().parent().click();
        cy.get('div[class="pf-c-select__menu"]').find('span').first().siblings('input').click();
        cy.get('#d3-line-chart-root > svg').then(chartElem => {
            expect(chartElem).to.have.length(1);
        });
        // Verify the Cluster filter is added in the Chip Group
        cy.get(toolBarChipGroup).find('span').contains('Cluster');
        const screenshotFilename = 'clusters_filter_by_cluster.png';
        cy.screenshot(screenshotFilename);
    });

    it('Can filter by job type', () => {
        cy.get(toolBarCatSelector).first().click();
        cy.get('button[class="pf-c-select__menu-item"]').contains('Job').click();
        cy.get('button[id^="pf-select-toggle-id-"]').contains('Filter by job type').parent().parent().click();
        cy.get('div[class="pf-c-select__menu"]').find('span').contains('Workflow job').parent().siblings('input').click();
        // Verify the Job Type filter is added in the Chip Group
        cy.get(toolBarChipGroup).find('span').contains('Job').siblings().find('span').should('not.contain', 'Workflow job');
        const screenshotFilename = 'clusters_filter_by_jobType.png';
        cy.screenshot(screenshotFilename);
    });

    it('Can filter by template', () => {
        cy.get(toolBarCatSelector).first().click();
        cy.get('button[class="pf-c-select__menu-item"]').contains('Template').click();
        cy.get('button[id^="pf-select-toggle-id-"]').contains('Filter by template').parent().parent().click();
        cy.get('div[class="pf-c-select__menu"]').find('span').first().siblings('input').click();
        // Verify the Template filter is added in the Chip Group
        cy.get(toolBarChipGroup).find('span').contains('Template');
        const screenshotFilename = 'clusters_filter_by_template.png';
        cy.screenshot(screenshotFilename);
    });

    it('Can filter by entering text in typeAhead', () => {
        cy.get(toolBarCatSelector).first().contains('Filter by').click();
        cy.get('button[class="pf-c-select__menu-item"]').contains('Organization').click();
        cy.get('button[id^="pf-select-toggle-id-"]').contains('Filter by organization').parent().parent().click();
        // Enter text in filter search input and verify that the search is successful
        cy.get('div[class="pf-c-select__menu"]').find('input[type="search"]').type('No organization')
        cy.get('div[class="pf-c-select__menu"]').find('span[class="pf-c-check__label"]').should('have.length', 1)
        cy.get('div[class="pf-c-select__menu"]').find('span').contains('No organization').parent().siblings('input').click();
        // Verify the Organization filter is added in the Chip Group
        cy.get(toolBarChipGroup).find('span').contains('Organization').siblings().find('span').contains('No organization');
        const screenshotFilename = 'clusters_filter_by_entering_text_in_typeahead.png';
        cy.screenshot(screenshotFilename);
    });

    it('Can clear filters', () => {
        cy.get(toolBarCatSelector).first().contains('Filter by').click();
        cy.get('button[class="pf-c-select__menu-item"]').contains('Organization').click();
        cy.get('button[id^="pf-select-toggle-id-"]').contains('Filter by organization').parent().parent().click();
        cy.get('div[class="pf-c-select__menu"]').find('span').contains('No organization').parent().siblings('input').click();
        // Verify the filter is added in the Chip group
        cy.get(toolBarChipGroup).find('span').contains('Organization').siblings().find('span').contains('No organization');
        cy.get(toolBarChipGroup).find('button').contains('Clear all filters').click();
        // Verify the filter is removed from the Chip group
        cy.get(toolBarChipGroup).find('span').should('not.contain', 'Organization');
        const screenshotFilename = 'clusters_clear_filter.png';
        cy.screenshot(screenshotFilename);
    });
});

describe('Dashboard page drilldown tests', () => {
    beforeEach(() => {
        cy.loginFlow();
        cy.visit(dashboardUrl);
    });

    it('Can navigate to job explorer from bar chart', () => {
        const today = moment(new Date().toISOString()).format('YYYY-MM-DD');
        // Filter by Job type
        cy.get(toolBarCatSelector).first().click();
        cy.get('button[class="pf-c-select__menu-item"]').contains('Job').click();
        cy.get('button[id^="pf-select-toggle-id-"]').contains('Filter by job type').parent().parent().click();
        cy.get('div[class="pf-c-select__menu"]').find('span').contains('Workflow job').parent().siblings('input').click();
        cy.get(toolBarChipGroup).find('span').contains('Job').siblings().find('span').should('not.contain', 'Workflow job');
        // Click on the bar for today ( 3rd from the last rect)
        cy.get(appid).find('rect').eq(-3).click();
        // Verify the redirect to Job explorer
        cy.get(appid).find('.pf-c-title').contains("Job Explorer")
        // Verify the job type filter and date filter is carried correctly to Job Explorer page
        cy.get(toolBarChipGroup).find('span').contains('Job').siblings().find('span').should('contain', 'Workflow job');
        cy.get('#startDate').should('have.value', today);
        cy.get('#endDate').should('have.value', today);
        const screenshotFilename = 'clusters_drilldown_barchart.png';
        cy.screenshot(screenshotFilename);
    });

    it('Can navigate to job explorer from top templates modal', () => {});

    it('Can navigate to job explorer from top workflows modal', () => {
        const todayminusone = moment(new Date().toISOString()).subtract(1, 'day').format('M/DD');
        const twoMonthssAgo = moment(new Date().toISOString()).subtract(61, 'day').format('M/DD');
        
        // Filter by Organization
        cy.get(toolBarCatSelector).first().contains('Filter by').click();
        cy.get('button[class="pf-c-select__menu-item"]').contains('Organization').click();
        cy.get('button[id^="pf-select-toggle-id-"]').contains('Filter by organization').parent().parent().click();
        cy.get('div[class="pf-c-select__menu"]').find('span').contains('No organization').parent().siblings('input').click();
        cy.get(toolBarChipGroup).find('span').contains('Organization').siblings().find('span').contains('No organization');
        cy.get(appid).find('#d3-bar-chart-root', { timeout: 1000 }).should('be.visible');
        // Filter by Date range
        cy.get('div[data-cy="quick_date_range"]').click();
        cy.get('.pf-c-select__menu-item').contains('Past 62 days').click();
        cy.get('#d3-bar-chart-root > svg').find('.x-axis').find('g').contains(todayminusone);
        cy.get('#d3-bar-chart-root > svg').find('.x-axis').find('g').contains(twoMonthssAgo);
        // Open Top Workflows modal and click on View all jobs
        cy.get(appid).find('a').eq(0).click();
        cy.get('#pf-modal-part-0').find('a').contains('View all jobs').click();
        // Verify the redirect to Job explorer
        cy.get(appid).find('.pf-c-title').contains("Job Explorer")
        // Verify the organization and date range filter is carried correctly to Job Explorer page
        cy.get(toolBarChipGroup).find('span').should('not.contain','Organization');
        cy.get('div[data-cy="quick_date_range"]').contains('Past 30 days');
        cy.get(toolBarChipGroup).find('span').contains('Template');
        cy.get(toolBarChipGroup).find('span').contains('Job').siblings().find('span').should('not.contain', 'Playbook run');
        const screenshotFilename = 'clusters_drilldown_top_templates.png';
        cy.screenshot(screenshotFilename);
    });

});