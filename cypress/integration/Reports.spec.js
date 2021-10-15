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

  it('All report cards are displayed on main reports page', () => {
    // Add more once fixtures are implemented - other filters are content-dependent.
  });
});