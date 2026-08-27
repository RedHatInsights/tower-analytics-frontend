import { ENV, ENVS, calculatorUrl } from '../support/constants';

// This repo has no Jest tooling (no config, no dependency, no script, never
// existed in history) — every other test here, including the sibling
// AAP-84050 frontend test story for this epic, is Cypress E2E. Rather than
// bolt on a second test runner for one PR, the error-handling branches that
// would otherwise only exist as unit tests (see applyDefaultToAll in
// AutomationCalculator.tsx) are covered below as Cypress scenarios instead.

const waitToLoad = () => {
  cy.wait('@roiCostEffortData');
  cy.wait('@roiTemplates');
};

// Deterministic roi_templates payload: one unreviewed-looking template, write
// RBAC, so the apply-default button renders enabled regardless of live data.
// `applied` flips the top-level savings figures so a test can assert the
// *second* fetch (triggered by the post-apply refresh) genuinely reflects
// new data, instead of a static response that can't prove the refresh
// actually changed anything.
const buildRoiTemplatesStub = (applied) => ({
  meta: {
    count: 1,
    legend: [
      {
        id: 1,
        name: 'Stubbed Template',
        manual_effort_minutes: 30,
        template_weigh_in: true,
        successful_hosts_total: 5,
        successful_hosts_savings: 100,
        successful_hosts_saved_hours: 2,
        monetary_gain: 50,
        elapsed: 120,
        host_count: 5,
        total_count: 5,
        total_org_count: 1,
        total_cluster_count: 1,
        total_inventory_count: 1,
        template_success_rate: 90,
        failed_hosts_costs: 0,
      },
    ],
  },
  cost: {
    hourly_manual_labor_cost: 50,
    hourly_automation_cost: 20,
    default_manual_effort_minutes: 30,
  },
  rbac: { perms: { all: false, write: true } },
  monetary_gain_current_page: applied ? 250 : 100,
  monetary_gain_other_pages: 0,
  successful_hosts_saved_hours_current_page: applied ? 5 : 2,
  successful_hosts_saved_hours_other_pages: 0,
});

// Re-visits the page with a stubbed roi_templates response so the apply
// default button is deterministically enabled, instead of depending on
// whatever unreviewed templates happen to exist in the live/seed backend.
// Returns a setter the test can call to flip the stub's "applied" state
// after a successful apply-default POST, so the next refetch differs.
const visitWithStubbedTemplates = () => {
  let applied = false;
  cy.intercept('/api/tower-analytics/v1/roi_templates/*', (req) =>
    req.reply(buildRoiTemplatesStub(applied)),
  ).as('roiTemplatesStub');
  cy.visit(calculatorUrl);
  cy.wait('@roiTemplatesStub');
  return {
    markApplied: () => {
      applied = true;
    },
  };
};

// visitWithStubbedTemplates() re-intercepts the same roi_templates route the
// outer beforeEach already aliased as 'roiTemplates'. Cypress matches the
// newest-registered intercept first, so 'roiTemplatesStub' shadows
// 'roiTemplates' for the rest of the test — waiting on '@roiTemplates' here
// would never match another request and would hang/desync instead of
// actually waiting for the post-apply refetch.
const waitForStubbedLoad = () => {
  cy.wait('@roiCostEffortData');
  cy.wait('@roiTemplatesStub');
};

describe('Automation Calculator page', () => {
  beforeEach(() => {
    cy.visit(calculatorUrl);

    cy.intercept('/api/tower-analytics/v1/roi_cost_effort_data/').as(
      'roiCostEffortData',
    );
    cy.intercept('/api/tower-analytics/v1/roi_templates/*').as('roiTemplates');

    // Wait for page to load (header or empty state)
    cy.get('body', { timeout: 30000 }).then(($body) => {
      if ($body.find('[data-cy="header-automation_calculator"]').length > 0) {
        cy.log('Automation calculator page loaded');
      } else if ($body.find('.pf-v6-c-empty-state__content').length > 0) {
        cy.log('Empty state found');
      } else {
        cy.log('Page loaded without expected elements');
      }
    });
  });

  it('can change manual cost', () => {
    // Skip test if no data available
    cy.get('body').then(($body) => {
      if ($body.find('.pf-v6-c-empty-state__content').length > 0) {
        cy.log('Empty state found - skipping manual cost test');
        return;
      }

      if (ENV != ENVS.STAGE) {
        cy.tableShowAll(); // make sure the 1st test show all lines
        cy.waitSpinner();
      }
      let originalTotalSavingsValue = cy
        .getByCy('total_savings')
        .find('h3').textContent;
      let originalPageSavingsValue = cy
        .getByCy('current_page_savings')
        .find('h3').textContent;
      let originalSavingsValues = [];
      cy.getByCy('savings').each(($el) =>
        originalSavingsValues.push($el.text()),
      );

      cy.get('#manual-cost').clear();
      waitToLoad();
      cy.get('#manual-cost').should('have.value', '0');

      if (ENV != ENVS.EPHEMERAL) {
        // assuming this test was written for stage
        // does not work on ephemeral
        cy.getByCy('savings').each(($el, index) => {
          const newSavingsValue = $el.text();
          // FIXME this should be not.to.be
          expect(newSavingsValue).not.to.eq(originalSavingsValues[index]);
        });
      }

      cy.get('#manual-cost').type('5');
      waitToLoad();
      // TODO explain trailing 0
      cy.get('#manual-cost').should('have.value', '50');

      cy.getByCy('total_savings')
        .find('h3')
        .then(($totalSavings) => {
          const totalSavingsValue = $totalSavings.text();
          expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
        });
      cy.getByCy('current_page_savings')
        .find('h3')
        .then(($pageSavings) => {
          const pageSavingsValue = $pageSavings.text();
          expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
        });
    });
  });

  it('can change automated cost', () => {
    // Skip test if no data available
    cy.get('body').then(($body) => {
      if ($body.find('.pf-v6-c-empty-state__content').length > 0) {
        cy.log('Empty state found - skipping automated cost test');
        return;
      }

      let originalTotalSavingsValue = cy
        .getByCy('total_savings')
        .find('h3').textContent;
      let originalPageSavingsValue = cy
        .getByCy('current_page_savings')
        .find('h3').textContent;
      let originalSavingsValues = [];
      cy.getByCy('savings').each(($el) =>
        originalSavingsValues.push($el.text()),
      );

      cy.get('#automation-cost').clear();
      waitToLoad();
      cy.get('#automation-cost').should('have.value', '0');

      // TODO there's a bug in UI. Savings column is not updated when inputs change
      /*
      cy.getByCy('savings').each(($el, index) => {
        const newSavingsValue = $el.text();
        // FIXME this should be not.to.be
        expect(newSavingsValue).not.to.eq(originalSavingsValues[index]);
      });
       */

      // TODO: flaky test, we need to find a better way to type an ensure the correct values
      cy.get('#automation-cost').type('2');
      waitToLoad();
      // TODO explain trailing 0
      cy.get('#automation-cost').should('have.value', '20');

      cy.getByCy('total_savings')
        .find('h3')
        .then(($totalSavings) => {
          const totalSavingsValue = $totalSavings.text();
          expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
        });
      cy.getByCy('current_page_savings')
        .find('h3')
        .then(($pageSavings) => {
          const pageSavingsValue = $pageSavings.text();
          expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
        });
    });
  });

  it('can change default manual effort', () => {
    // Skip test if no data available
    cy.get('body').then(($body) => {
      if ($body.find('.pf-v6-c-empty-state__content').length > 0) {
        cy.log('Empty state found - skipping default manual effort test');
        return;
      }

      cy.get('#default-manual-effort').clear();
      waitToLoad();
      cy.get('#default-manual-effort').should('have.value', '0');

      cy.get('#default-manual-effort').type('60');
      waitToLoad();
      cy.get('#default-manual-effort')
        .invoke('val')
        .then((val) => {
          expect(Number(val)).to.be.greaterThan(0);
        });
    });
  });

  it('can change visibility', () => {
    let originalTotalSavingsValue = cy
      .getByCy('total_savings')
      .find('h3').textContent;
    let originalPageSavingsValue = cy
      .getByCy('current_page_savings')
      .find('h3').textContent;

    if (ENV != ENVS.STAGE) {
      cy.tableShowAll();
    } else {
      cy.get('#table-kebab').click();
      cy.get('button').contains('Show all').click();
      cy.get('#table-kebab').click();
    }
    waitToLoad();

    cy.get('tr').eq(1).find('.pf-v6-c-switch__toggle').click();
    waitToLoad();
    cy.getByCy('savings')
      .first()
      .should('have.css', 'color', 'rgb(210, 210, 210)');
    cy.get('tr').eq(1).get('td').contains('Hide').should('exist');

    cy.get('tr').eq(1).find('.pf-v6-c-switch__toggle').click();
    waitToLoad();
    cy.getByCy('savings')
      .first()
      .should('have.css', 'color', 'rgb(30, 79, 24)');
    cy.get('tr').eq(1).get('td').contains('Show').should('exist');

    cy.getByCy('total_savings')
      .find('h3')
      .then(($totalSavings) => {
        const totalSavingsValue = $totalSavings.text();
        expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
      });
    cy.getByCy('current_page_savings')
      .find('h3')
      .then(($pageSavings) => {
        const pageSavingsValue = $pageSavings.text();
        expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
      });
  });

  /*
  TODO: This test keeps failing because the backend enforces the field value.
  We need to rewrite it
  */
  // it('can change manual time', () => {
  //   let originalTotalSavingsValue = cy
  //     .getByCy('total_savings')
  //     .find('h3').textContent;
  //   let originalPageSavingsValue = cy
  //     .getByCy('current_page_savings')
  //     .find('h3').textContent;
  //   let originalSavingsValue = cy.getByCy('savings').first().textContent;

  //   cy.getByCyLike('manual-time').first().as('inputTime');
  //   cy.get('@inputTime').clear();
  //   waitToLoad();
  //   cy.get('@inputTime').should('have.value', '0');

  //   // cy.getByCy('savings').first().then(($savings) => {
  //   //   const rowSavingsValue = $savings.text();
  //   //   expect(rowSavingsValue).not.to.eq(originalSavingsValue);
  //   // });

  //   cy.getByCy('manual-time').first().type('4');
  //   waitToLoad();
  //   // TODO explain trailing 0
  //   cy.get('tr').eq(1).find('input').should('have.value', '40');

  //   cy.getByCy('total_savings')
  //     .find('h3')
  //     .then(($totalSavings) => {
  //       const totalSavingsValue = $totalSavings.text();
  //       expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
  //     });
  //   cy.getByCy('current_page_savings')
  //     .find('h3')
  //     .then(($pageSavings) => {
  //       const pageSavingsValue = $pageSavings.text();
  //       expect(pageSavingsValue).not.to.eq(originalPageSavingsValue);
  //     });
  // });

  it('shows empty state when all rows are hidden', () => {
    // most of this is dupplicated code and should be merged

    let originalTotalSavingsValue =
      ENV != ENVS.STAGE
        ? '$'
        : cy.getByCy('total_savings').find('h3').textContent;

    if (ENV != ENVS.STAGE) {
      cy.tableShowAll();
      cy.waitSpinner();
      cy.getByCy('total_savings')
        .find('h3')
        .then(($el) => {
          originalTotalSavingsValue = $el.text();
        });
    }

    if (ENV == ENVS.STAGE) {
      cy.get('#table-kebab').click();
      cy.get('button').contains('Hide all').click();
      waitToLoad();
    }

    if (ENV != ENVS.STAGE) {
      cy.tableHideAll().then(() => {
        cy.get('.pf-v6-c-empty-state').should('exist');
        cy.getByCy('total_savings')
          .find('h3')
          .then(($totalSavings) => {
            const totalSavingsValue = $totalSavings.text();
            expect(totalSavingsValue).not.be.eq(originalTotalSavingsValue);
          });
        cy.getByCy('current_page_savings')
          .find('h3')
          .then(($pageSavingsHidenTable) => {
            const pageSavingsValueHidenTable = $pageSavingsHidenTable.text();
            expect(pageSavingsValueHidenTable).be.eq('$0.00');
          });

        cy.tableShowAll().then(() => {
          cy.get('.pf-v6-c-empty-state').should('not.exist');
          cy.getByCy('current_page_savings')
            .find('h3')
            .then(($pageSavings) => {
              const pageSavingsValue = $pageSavings.text();
              expect(pageSavingsValue).not.be.eq('$0.00');
            });
        });
      });
      // local - ephemeral
    } else {
      cy.getByCy('total_savings')
        .find('h3')
        .then(($totalSavings) => {
          const totalSavingsValue = $totalSavings.text();
          expect(totalSavingsValue).not.to.eq(originalTotalSavingsValue);
        });
      cy.getByCy('current_page_savings')
        .find('h3')
        .then(($pageSavings) => {
          const pageSavingsValue = $pageSavings.text();
          expect(pageSavingsValue).to.eq('$0.00');
        });
      cy.get('.pf-v6-c-empty-state').should('exist');

      cy.get('button').contains('Show all').click();
      waitToLoad();

      cy.get('.pf-v6-c-empty-state').should('not.exist');
      cy.getByCy('current_page_savings')
        .find('h3')
        .then(($pageSavings) => {
          const pageSavingsValue = $pageSavings.text();
          expect(pageSavingsValue).not.to.eq('$0.00');
        });
    }
  });

  it('applies default manual time to all templates on confirm', () => {
    const { markApplied } = visitWithStubbedTemplates();

    cy.intercept('POST', '**/roi_templates_apply_default/', (req) => {
      markApplied();
      req.reply({ updated_count: 3 });
    }).as('applyDefault');

    cy.getByCy('apply_default_button').should('not.be.disabled').click();
    cy.getByCy('apply_default_modal').should('exist');
    // Modal no longer promises a specific pre-count (backend, not the
    // paginated client, is the source of truth for how many get updated).
    cy.getByCy('apply_default_modal').should(
      'contain.text',
      'This will overwrite the manual time for every template with the ' +
        "current default of 30 minutes, including templates you've already " +
        'reviewed. Do you want to apply this default value to all templates?',
    );

    cy.getByCy('current_page_savings')
      .find('h3')
      .invoke('text')
      .then((originalCurrentPageSavings) => {
        cy.getByCy('apply_default_confirm_button').click();
        cy.wait('@applyDefault').its('request.body').should('deep.equal', {});
        waitForStubbedLoad();

        cy.getByCy('apply_default_modal').should('not.exist');
        cy.contains('Default manual time applied to 3 templates.').should(
          'exist',
        );

        // Genuine before/after diff: the stub returns different savings
        // figures once `markApplied()` flips, proving the table actually
        // reflects the post-apply refresh rather than a static response.
        cy.getByCy('current_page_savings')
          .find('h3')
          .invoke('text')
          .should('not.eq', originalCurrentPageSavings);
      });
  });

  it('cancels apply default without calling the endpoint', () => {
    cy.intercept('POST', '**/roi_templates_apply_default/', {
      updated_count: 3,
    }).as('applyDefault');

    visitWithStubbedTemplates();

    cy.getByCy('apply_default_button').should('not.be.disabled').click();
    cy.getByCy('apply_default_modal').should('exist');

    cy.getByCy('apply_default_cancel_button').click();
    cy.getByCy('apply_default_modal').should('not.exist');
    cy.get('@applyDefault.all').should('have.length', 0);
  });

  it('shows an error notification and keeps state usable when apply default fails', () => {
    cy.intercept('POST', '**/roi_templates_apply_default/', {
      statusCode: 500,
      body: { error: 'boom' },
    }).as('applyDefaultFailure');

    visitWithStubbedTemplates();

    cy.getByCy('apply_default_button').should('not.be.disabled').click();
    cy.getByCy('apply_default_modal').should('exist');

    cy.getByCy('apply_default_confirm_button').click();
    cy.wait('@applyDefaultFailure');

    cy.contains('Unable to apply default manual time').should('exist');
    cy.getByCy('apply_default_modal').should('not.exist');
    // button remains usable for a retry
    cy.getByCy('apply_default_button').should('not.be.disabled');
  });

  it('shows a warning and closes the modal when the refresh after a successful apply fails', () => {
    // First roi_templates fetch (initial page load) succeeds; the second
    // (the update() refresh triggered by a successful apply) fails. This is
    // the regression case for applyDefaultToAll: a refresh failure must not
    // leave the modal stuck open or surface as an apply failure.
    let requestCount = 0;
    cy.intercept('/api/tower-analytics/v1/roi_templates/*', (req) => {
      requestCount += 1;
      if (requestCount === 1) {
        req.reply(buildRoiTemplatesStub(false));
      } else {
        req.reply({ statusCode: 500, body: { error: 'boom' } });
      }
    }).as('roiTemplatesStub');
    cy.visit(calculatorUrl);
    cy.wait('@roiTemplatesStub');

    cy.intercept('POST', '**/roi_templates_apply_default/', {
      updated_count: 2,
    }).as('applyDefault');

    cy.getByCy('apply_default_button').should('not.be.disabled').click();
    cy.getByCy('apply_default_confirm_button').click();
    cy.wait('@applyDefault');
    cy.wait('@roiTemplatesStub'); // the failing refresh request

    cy.getByCy('apply_default_modal').should('not.exist');
    cy.contains(
      'Default manual time applied, but the table could not refresh',
    ).should('exist');
    // no leftover disabled/loading state from the failed refresh
    cy.getByCy('apply_default_button').should('not.be.disabled');
  });

  it('falls back to 0 when the apply response has no updated_count', () => {
    cy.intercept('POST', '**/roi_templates_apply_default/', {}).as(
      'applyDefault',
    );

    visitWithStubbedTemplates();

    cy.getByCy('apply_default_button').should('not.be.disabled').click();
    cy.getByCy('apply_default_confirm_button').click();
    cy.wait('@applyDefault');
    waitForStubbedLoad();

    cy.contains('Default manual time applied to 0 templates.').should('exist');
  });

  it('disables cancel/close while a request is in flight', () => {
    cy.intercept('POST', '**/roi_templates_apply_default/', {
      delay: 1000,
      body: { updated_count: 1 },
    }).as('applyDefaultSlow');

    visitWithStubbedTemplates();

    cy.getByCy('apply_default_button').should('not.be.disabled').click();
    cy.getByCy('apply_default_confirm_button').click();

    // while the request is in flight, Continue is loading/disabled and
    // Cancel can't dismiss the modal out from under the pending request
    cy.getByCy('apply_default_confirm_button').should('be.disabled');
    cy.getByCy('apply_default_cancel_button').should('be.disabled');
    cy.getByCy('apply_default_modal').should('exist');

    cy.wait('@applyDefaultSlow');
    cy.getByCy('apply_default_modal').should('not.exist');
  });

  it('shows Automation formula', () => {
    cy.getByCy('automation_formula_button').click();
    cy.getByCy('automation_formula_modal').should('exist');
    cy.getByCy('automation_formula_cancel_button').click();
    cy.getByCy('automation_formula_modal').should('not.exist');
  });

  it('Query parameters are stored in the URL to enable refresh', () => {
    cy.getByCy('quick_date_range').click();
    cy.contains('Past 2 years').click();
    cy.url().should('include', 'quick_date_range=roi_last_2_years');
  });
});
