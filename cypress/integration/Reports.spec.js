import { reportsUrl } from '../support/constants';

const appid = Cypress.env('appid');

const hcbjt = 'hosts_changed_by_job_template';
const cmbjt = 'changes_made_by_job_template';
const jtrr = 'job_template_run_rate';
const hbo = 'hosts_by_organization';
const jtbo = 'jobs_and_tasks_by_organization';
const texp = 'templates_explorer';

describe('Reports page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl);
  });

  it.skip('All report cards are displayed on main reports page', () => {});
});

describe('Report: Hosts Changed By Job Template Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + hcbjt);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_hcbjt_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_hcbjt_line.png');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click()
  });
});

describe('Report: Changes Made By Job Template Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + cmbjt);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_cmbjt_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_cmbjt_line.png');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click()
  });
});

describe('Report: Job Template Run Rate Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + jtrr);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_jtrr_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_jtrr_line.png');
  });
  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click()
  });
});

describe('Report: Hosts By Organization Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + hbo);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_hbo_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_hbo_line.png');
  });
  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past 62 days').click()
  });
});

describe('Report: Jobs and Tasks By Organization Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + jtbo);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_jtbo_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_jtbo_line.png');
  });
  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past 62 days').click()
  });
});

describe('Report: Templates Explorer Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + texp);
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click()
  });
});
