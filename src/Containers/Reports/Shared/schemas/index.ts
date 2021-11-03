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
import moduleUsageByTask from './moduleUsageByTask';

const defaultReport: ReportPageParams = {
  slug: '',
  name: '',
  description: '',
  categories: [] as string[],
  report: undefined,
};

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

export const getReport = (searchSlug: string): ReportPageParams => {
  const moduleReportsEnabled = useFeatureFlag(ValidFeatureFlags.moduleReports);

  const reports = [
    ...prodReports,
    ...(moduleReportsEnabled ? moduleReports : []),
  ];

  return reports.find(({ slug }) => slug === searchSlug) ?? defaultReport;
};

export const getAllReports = (): ReportPageParams[] => {
  prodReports;
  const moduleReportsEnabled = useFeatureFlag(ValidFeatureFlags.moduleReports);

  return [...prodReports, ...(moduleReportsEnabled ? moduleReports : [])];
};
