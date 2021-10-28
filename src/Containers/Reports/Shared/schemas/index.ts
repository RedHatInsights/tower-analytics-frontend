import { useFeatureFlag, ValidFeatureFlags } from '../../../../FeatureFlags';

import { ReportPageParams } from '../types';
import affectedHostsByPlaybook from './affectedHostsByPlaybook';
import changesMade from './changesMade';
import playbookRunRate from './playbookRunRate';
import hostsByOrganization from './hostsByOrganizations';
import jobsTasksByOrganization from './jobsTasksByOrganization';
import templatesExplorer from './templatesExplorer';
import mostUsedModules from './mostUsedModules';
import moduleUsagebyOrganization from './moduleUsagebyOrganization';
import moduleUsageByJobTemplate from './moduleUsageByJobTemplate';
import moduleUsageByTask from './moduleUsageByTask';

const defaultReport: ReportPageParams = {
  slug: '',
  name: '',
  description: '',
  categories: [] as string[],
  report: undefined,
};

const flaggedReports = [
  hostsByOrganization,
  jobsTasksByOrganization,
  templatesExplorer,
  mostUsedModules,
  moduleUsagebyOrganization,
  moduleUsageByJobTemplate,
  moduleUsageByTask,
];

const prodReports = [affectedHostsByPlaybook, changesMade, playbookRunRate];

export const getReport = (searchSlug: string): ReportPageParams => {
  const orgReportsEnabled = useFeatureFlag(ValidFeatureFlags.orgReports);

  const reports = [
    ...prodReports,
    ...(orgReportsEnabled ? flaggedReports : []),
  ];

  return reports.find(({ slug }) => slug === searchSlug) ?? defaultReport;
};

export const getAllReports = (): ReportPageParams[] => {
  const orgReportsEnabled = useFeatureFlag(ValidFeatureFlags.orgReports);

  return [...prodReports, ...(orgReportsEnabled ? flaggedReports : [])];
};
