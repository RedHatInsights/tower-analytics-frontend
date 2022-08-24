import { reportsUrl } from '../support/constants';

const hcbjt = 'hosts_changed_by_job_template';
const cmbjt = 'changes_made_by_job_template';
const jtrr = 'job_template_run_rate';
const hbo = 'hosts_by_organization';
const jtbo = 'jobs_and_tasks_by_organization';
const texp = 'templates_explorer';
const mum = 'most_used_modules';
const mubo = 'module_usage_by_organization';
const mubjt = 'module_usage_by_job_template';
const mubt = 'module_usage_by_task';
//const aa21m = 'aa_2_1_onboarding';
//const hab = 'host_anomalies_bar';
//const has = 'host_anomalies_scatter';

const allReports = [
  hcbjt,
  cmbjt,
  jtrr,
  hbo,
  jtbo,
  texp,
  mum,
  mubo,
  mubjt,
  mubt,
  // TODO add once not beta exclusive
  //aa21m,
  //hab,
  //has,
];

describe('Reports page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.intercept('/api/tower-analytics/v1/event_explorer_options/').as('eventExplorerOptions');
    cy.visit(reportsUrl);
    cy.getByCy('loading').should('not.exist');
    cy.getByCy('api_error_state').should('not.exist');
    cy.wait('@eventExplorerOptions');
    cy.get('.pf-c-empty-state__content').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({ force: true });
  });

  it('All report cards are displayed on main reports page', () => {
    allReports.forEach((item) => {
      cy.getByCy(item).should('exist');
    });
  });
  it('All report cards have correct href in the title', () => {
    allReports.forEach((item) => {
      cy.getByCy(item).should('exist');
      cy.getByCy(item).find('a')
        .should('have.attr', 'href', '/beta/ansible/automation-analytics' + reportsUrl + '/' + item);
    });
  });
  it('All report cards can be selected for the preview with correct links', () => {
    allReports.forEach((item) => {
      cy.getByCy(item).should('exist');
      cy.getByCy(item).click();
      cy.getByCy('loading').should('not.exist');
      cy.getByCy('api_error_state').should('not.exist');
      cy.get('.pf-c-empty-state').should('not.exist');
      // correct card is highlighted
      cy.getByCy(item).should('have.class', 'pf-m-selected-raised');
      // check View full report link is correct
      cy.get(`[data-cy="view_full_report_link"]`)
        .should('have.attr', 'href', '/beta/ansible/automation-analytics' + reportsUrl + '/' + item);
      // check Title link is correct
      cy.getByCy('preview_title_link')
        .should('have.attr', 'href', '/beta/ansible/automation-analytics' + reportsUrl + '/' + item);
    });
  });
  it('All report cards can appear in preview via dropdown', () => {
    allReports.forEach((item) => {
      cy.getByCy(item).should('exist');
      cy.get('a').should('have.href', '/beta/ansible/automation-analytics' + reportsUrl + '/' + item);
    });
  });
  it('All report are accessible in preview via arrows', () => {
    let originalTitlePreview = cy.getByCy('preview_title_link').textContent;
    allReports.forEach(() => {
      cy.getByCy('next_report_button').click();
      cy.getByCy('preview_title_link').then(($previewTitle) => {
        const newTitlePreview = $previewTitle.text();
        expect(newTitlePreview).not.to.eq(originalTitlePreview);
        originalTitlePreview = newTitlePreview;
      });
    });
    allReports.forEach(() => {
      cy.getByCy('previous_report_button').click();
      cy.getByCy('preview_title_link').then(($previewTitle) => {
        const newTitlePreview = $previewTitle.text();
        expect(newTitlePreview).not.to.eq(originalTitlePreview);
        originalTitlePreview = newTitlePreview;
      });
    });
  });
  it('All report are accessible in preview via dropdownn', () => {
    cy.getByCy('selected_report_dropdown').should('exist');
    allReports.forEach(($item, index) => {
      cy.getByCy('selected_report_dropdown').click();
      cy.get('ul.pf-c-dropdown__menu > button > li > a').should('exist');
      cy.get('ul.pf-c-dropdown__menu > button > li > a').eq(index).click();
      cy.getByCy('preview_title_link').invoke('text').then(($text) => {
        cy.get('[data-cy="selected_report_dropdown"] > span.pf-c-dropdown__toggle-text')
          .invoke('text').should('eq', $text)
      });
    });
  });
});
