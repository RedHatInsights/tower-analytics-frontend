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
const aa21m = 'aa_2_1_onboarding';
const ha = 'host_anomalies';

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
  aa21m,
  ha,
];

describe('Reports page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl);
  });

  it('All report cards are displayed on main reports page', () => {
    allReports.forEach((item) => {
      cy.get(`[data-testid="${item}"]`).should('exist');
    });
  });
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
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
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
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
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
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
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
    cy.get('.pf-c-select__menu-item').contains('Past 62 days').click();
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
    cy.get('.pf-c-select__menu-item').contains('Past 62 days').click();
  });
});

describe('Report: Templates Explorer Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + texp);
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });
});

describe('Report: Most Used Modules Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + mum);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_mum_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_mum_line.png');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });
});

describe('Report: Module Usage By Organization Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + mubo);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_mubo_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_mubo_line.png');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });
});

describe('Report: Module Usage By Job Template Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + mubjt);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_mubjt_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_mubjt_line.png');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });
});

describe('Report: Module Usage By Task Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + mubt);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_mubt_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_mubt_line.png');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });
});

describe('Report: AA 2.1 Migration', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + aa21m);
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.screenshot('report_aa21m_bar.png');
    cy.get('#line').click();
    cy.screenshot('report_aa21m_line.png');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });
});

describe('Report: Host Anomalies', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + ha);
  });

  it('Renders bar chart with data', () => {
    cy.get('#bar').click();
    cy.screenshot('report_ha_bar.png');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });
});
