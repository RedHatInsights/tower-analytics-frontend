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
const hab = 'host_anomalies_bar';
const has = 'host_anomalies_scatter';

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
 // swiching host anomalies off for now because it's not working on stage
 // hab,
 // has,
];

describe('Reports page smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.intercept('/api/tower-analytics/v1/event_explorer_options/').as('eventExplorerOptions');
    cy.visit(reportsUrl);
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
    cy.wait('@eventExplorerOptions');
    cy.get('.pf-c-empty-state__content').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('All report cards are displayed on main reports page', () => {
    allReports.forEach((item) => {
      cy.get(`[data-cy="${item}"]`).should('exist');
    });
  });
  it('All report cards have correct href in the title', () => {
    allReports.forEach((item) => {
      cy.get(`[data-cy="${item}"]`).should('exist');
      cy.get(`[data-cy="${item}"]`).find('a')
          .should('have.attr', 'href',  '/beta/ansible/automation-analytics' + reportsUrl + '/' + item);
    });
  });
  it('All report cards can be selected for the preview with correct links', () => {
    allReports.forEach((item) => {
      cy.get(`[data-cy="${item}"]`).should('exist');
      cy.get(`[data-cy="${item}"]`).click();
      cy.get('[data-cy="loading"]').should('not.exist');
      cy.get('[data-cy="api_error_state"]').should('not.exist');
      cy.get('.pf-c-empty-state').should('not.exist');
      // correct card is highlighted
      cy.get(`[data-cy="${item}"]`).should('have.class', 'pf-m-selected-raised');
      // check View full report link is correct
      cy.get(`[data-cy="view_full_report_link"]`)
          .should('have.attr','href', '/beta/ansible/automation-analytics' + reportsUrl + '/' + item);
      // check Title link is correct
      cy.get('[data-cy="preview_title_link"]')
          .should('have.attr','href', '/beta/ansible/automation-analytics' + reportsUrl + '/' + item);
    });
  });
  it('All report cards can appear in preview via dropdown', () => {
    allReports.forEach((item) => {
      cy.get(`[data-cy="${item}"]`).should('exist');
      cy.get('a').should('have.href', '/beta/ansible/automation-analytics' + reportsUrl + '/' + item);
    });
  });
  it('All report are accessible in preview via arrows', () => {
    let originalTitlePreview = cy.get('[data-cy="preview_title_link"]').textContent;
    allReports.forEach(() => {
      cy.get('[data-cy="next_report_button"]').click();
      cy.get('[data-cy="preview_title_link"]').then(($previewTitle) => {
        const newTitlePreview = $previewTitle.text();
        expect(newTitlePreview).not.to.eq(originalTitlePreview);
        originalTitlePreview = newTitlePreview;
      });
    });
    allReports.forEach(() => {
      cy.get('[data-cy="previous_report_button"]').click();
      cy.get('[data-cy="preview_title_link"]').then(($previewTitle) => {
        const newTitlePreview = $previewTitle.text();
        expect(newTitlePreview).not.to.eq(originalTitlePreview);
        originalTitlePreview = newTitlePreview;
      });
    });
  });
  it('All report are accessible in preview via dropdownn', () => {
    cy.get('[data-cy="selected_report_dropdown"]').should('exist');
    allReports.forEach(($item, index) => {
      cy.get('[data-cy="selected_report_dropdown"]').click();
      cy.get('ul.pf-c-dropdown__menu > button > li > a').should('exist');
      cy.get('ul.pf-c-dropdown__menu > button > li > a').eq(index).click();
      cy.get('[data-cy="preview_title_link"]').invoke('text').then(($text) => {
        cy.get('[data-cy="selected_report_dropdown"] > span.pf-c-dropdown__toggle-text')
            .invoke('text').should('eq', $text)
      });
    });
  });
});

describe('Report: Hosts Changed By Job Template Smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.visit(reportsUrl + '/' + hcbjt);
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.screenshot('report_jtrr_bar.png');
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.screenshot('report_hbo_bar.png');
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
    cy.get('[data-cy="api_loading_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
    cy.get('[data-cy="api_loading_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
    cy.get('[data-cy="api_loading_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
    cy.get('[data-cy="api_loading_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
    cy.get('[data-cy="api_loading_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
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
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="api_error_state"]').should('not.exist');
    cy.get('[data-cy="api_loading_state"]').should('not.exist');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('#line').click();
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
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Can Switch between Line and Bar chart without breaking UI', () => {
    cy.get('#bar').click();
    cy.get('.pf-m-selected').contains('Bar Chart').should('exist');
    cy.get('#line').click();
    cy.get('.pf-m-selected').contains('Line Chart').should('exist');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past year').click();
  });
});

describe('Report: Host Anomalies Bar', () => {
  beforeEach(() => {
    cy.loginFlow();
    cy.intercept('/api/tower-analytics/v1/probe_templates/').as('probeTemplates');
    cy.visit(reportsUrl + '/' + hab);
    cy.wait('@probeTemplates');
  });
  afterEach(() => {
    cy.get('#UserMenu').click();
    cy.get('button').contains('Log out').click({force: true});
  });

  it('Renders bar chart with data', () => {
    cy.get('.pf-c-chart').should('exist');
  });

  it('Can change lookback', () => {
    cy.get('[data-cy="quick_date_range"]').click();
    cy.get('.pf-c-select__menu-item').contains('Past month').click();
  });
});
