import { useFeatureFlag, ValidFeatureFlags } from '../../../../FeatureFlags';

import { ReportPageParams } from '../types';
import affectedHostsByPlaybook from './affectedHostsByPlaybook';
import changesMade from './changesMade';
import playbookRunRate from './playbookRunRate';
import hostsByOrganization from './hostsByOrganizations';
import jobsTasksByOrganization from './jobsTasksByOrganization';
import templatesExplorer from './templatesExplorer';

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

export const getReport = (searchSlug: string): ReportPageParams =>
  prodReports.find(({ slug }) => slug === searchSlug) ?? defaultReport;

export const getAllReports = (): ReportPageParams[] => prodReports;
