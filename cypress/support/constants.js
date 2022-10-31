/* global Cypress */
export const appid = Cypress.env('appid')
export const aapUrl = '/ansible/automation-analytics'
export const dashboardUrl = '/ansible-dashboard'
export const orgsUrl = '/organization-statistics'
export const jobExplorerUrl = '/job-explorer'
export const clustersUrl = '/clusters'
export const reportsUrl = '/reports'
export const savingsPlannerUrl = '/savings-planner'
export const calculatorUrl = '/reports/automation_calculator'
export const notificationsUrl = '/notifications'

export const hcbjt = 'hosts_changed_by_job_template'
export const cmbjt = 'changes_made_by_job_template'
export const jtrr = 'job_template_run_rate'
export const hbo = 'hosts_by_organization'
export const jtbo = 'jobs_and_tasks_by_organization'
export const texp = 'templates_explorer'
export const mum = 'most_used_modules'
export const mubo = 'module_usage_by_organization'
export const mubjt = 'module_usage_by_job_template'
export const mubt = 'module_usage_by_task'
export const aa21m = 'aa_2_1_onboarding'
export const hab = 'host_anomalies_bar'
export const has = 'host_anomalies_scatter'

export const allReports = [
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
    hab,
    has,
]