import { useFeatureFlag, ValidFeatureFlags } from '../../../../FeatureFlags';

import { ReportPageParams } from '../types';
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
  aa21OnboardingReport,
];

const automationCalculatorReport = [automationCalculator];

export const getReport = (searchSlug: string): ReportPageParams | undefined => {
  const moduleReportsEnabled = useFeatureFlag(ValidFeatureFlags.moduleReports);
  const newAutomationCalculator = useFeatureFlag(
    ValidFeatureFlags.newAutomationCalculator
  );

  const reports = [
    ...prodReports,
    ...(moduleReportsEnabled ? moduleReports : []),
    ...(newAutomationCalculator ? automationCalculatorReport : []),
  ];

  return reports.find(({ slug }) => slug === searchSlug);
};

export const getAllReports = (): ReportPageParams[] => {
  const moduleReportsEnabled = useFeatureFlag(ValidFeatureFlags.moduleReports);
  const newAutomationCalculator = useFeatureFlag(
    ValidFeatureFlags.newAutomationCalculator
  );

  return [
    ...prodReports,
    ...(moduleReportsEnabled ? moduleReports : []),
    ...(newAutomationCalculator ? automationCalculatorReport : []),
  ];
};
