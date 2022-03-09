import { useFeatureFlag, ValidFeatureFlags } from '../../../../FeatureFlags';
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
import hostAnamolies from './hostAnomalies';
import { ReportSchema } from '../../Layouts/types';

const prodReports = [
  affectedHostsByPlaybook,
  changesMade,
  playbookRunRate,
  hostsByOrganization,
  jobsTasksByOrganization,
  templatesExplorer,
  hostAnamolies,
];

const moduleReports = [
  mostUsedModules,
  moduleUsageByOrganization,
  moduleUsageByJobTemplate,
  moduleUsageByTask,
];

const onboardingReports = [aa21OnboardingReport];

const automationCalculatorReport = [automationCalculator];

export const getReport = (searchSlug: string): ReportSchema | undefined => {
  const moduleReportsEnabled = useFeatureFlag(ValidFeatureFlags.moduleReports);
  const newAutomationCalculator = useFeatureFlag(
    ValidFeatureFlags.newAutomationCalculator
  );
  const aa21OnboardingReportEnabled = useFeatureFlag(
    ValidFeatureFlags.onboardingReports
  );

  const reports = [
    ...prodReports,
    ...(moduleReportsEnabled ? moduleReports : []),
    ...(newAutomationCalculator ? automationCalculatorReport : []),
    ...(aa21OnboardingReportEnabled ? onboardingReports : []),
  ];

  return reports.find(({ layoutProps: { slug } }) => slug === searchSlug);
};

export const getAllReports = (): ReportSchema[] => {
  const moduleReportsEnabled = useFeatureFlag(ValidFeatureFlags.moduleReports);
  const newAutomationCalculator = useFeatureFlag(
    ValidFeatureFlags.newAutomationCalculator
  );
  const aa21OnboardingReportEnabled = useFeatureFlag(
    ValidFeatureFlags.onboardingReports
  );

  return [
    ...prodReports,
    ...(moduleReportsEnabled ? moduleReports : []),
    ...(newAutomationCalculator ? automationCalculatorReport : []),
    ...(aa21OnboardingReportEnabled ? onboardingReports : []),
  ];
};
