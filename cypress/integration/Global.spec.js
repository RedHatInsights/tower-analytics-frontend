/* global cy */
import {
  calculatorUrl,
  jobExplorerUrl,
  dashboardUrl,
  notificationsUrl,
  orgsUrl,
} from '../support/constants';

describe('automation analytics smoketests', () => {
  beforeEach(() => {
    cy.loginFlow();
  });

  it('has all the AA navigation items', () => {
    cy.visit('/ansible/automation-analytics');
    const navbar = cy.get('li[ouiaid="automation-analytics"]');
    const navlis = navbar.find('li');
    navlis.should('have.length', 5);
  });

  it('can open each page without breaking the UI', () => {
    cy.visit('/ansible/automation-analytics');
    cy.visit(calculatorUrl);
    cy.visit(jobExplorerUrl);
    cy.visit(dashboardUrl);
    cy.visit(notificationsUrl);
    cy.visit(orgsUrl);
  });
});
