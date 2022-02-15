import affectedHostsByPlaybook from './affectedHostsByPlaybook';
import changesMade from './changesMade';
import playbookRunRate from './playbookRunRate';
import hostsByOrganization from './hostsByOrganizations';
import jobsTasksByOrganization from './jobsTasksByOrganization';
import templatesExplorer from './templatesExplorer';
import mostUsedModules from './mostUsedModules';
import moduleUsageByOrganization from './moduleUsageByOrganization';
import moduleUsageByJobTemplate from './moduleUsageByJobTemplate';
import aa21OnboardingReport from './aa21OnboardingReport';
import moduleUsageByTask from './moduleUsageByTask';
import automationCalculator from './automationCalculator';
import { ReportSchema } from '../../Layouts/types';

const prodReports = [
  affectedHostsByPlaybook,
  changesMade,
  playbookRunRate,
  hostsByOrganization,
  jobsTasksByOrganization,
  templatesExplorer,
];

const moduleReports = [
  mostUsedModules,
  moduleUsageByOrganization,
  moduleUsageByJobTemplate,
  moduleUsageByTask,
];

const onboardingReports = [aa21OnboardingReport];

const automationCalculatorReport = [automationCalculator];

export const getReport = (
  searchSlug: string,
  moduleReportsEnabled: boolean,
  newAutomationCalculator: boolean,
  aa21OnboardingReportEnabled: boolean
): ReportSchema | undefined | null => {
  const reports = [
    ...prodReports,
    ...(moduleReportsEnabled ? moduleReports : []),
    ...(newAutomationCalculator ? automationCalculatorReport : []),
    ...(aa21OnboardingReportEnabled ? onboardingReports : []),
  ];
  console.log('*********** src/Containers/Reports/Shared/schemas/index.ts');
  console.log('all reports: ', reports);
  console.log('onboardingReports ', onboardingReports);
  console.log('prodReports ', prodReports);
  console.log('moduleReports ', moduleReports);
  console.log('automationCalculatorReport ', automationCalculatorReport);
  console.log('moduleReportsEnabled ', moduleReportsEnabled);
  console.log('newAutomationCalculator ', newAutomationCalculator);
  console.log('aa21OnboardingReportEnabled: ', aa21OnboardingReportEnabled);
  console.log('searchSlug: ', searchSlug);
  console.log('*********  src/Containers/Reports/Shared/schemas/index.ts');

  return reports.find(({ layoutProps: { slug } }) => slug === searchSlug);
};

export const getAllReports = (
  moduleReportsEnabled: boolean,
  newAutomationCalculator: boolean,
  aa21OnboardingReportEnabled: boolean
): ReportSchema[] => {
  return [
    ...prodReports,
    ...(moduleReportsEnabled ? moduleReports : []),
    ...(newAutomationCalculator ? automationCalculatorReport : []),
    ...(aa21OnboardingReportEnabled ? onboardingReports : []),
  ];
};
